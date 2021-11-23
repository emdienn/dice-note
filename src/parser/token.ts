import { Token } from 'moo'

import type { Operand, Operation, Plan, PrepareExecuteFunction } from './@types'

type DiceOperand = Operand<'dice', { qty: number, sides: number, collapse: boolean }>

export type TokenParser = (token: Token) => void
export type OutputParser = {
  parse: Record<string, TokenParser>
  stack: {
    push: TokenParser
    get: () => Plan
  }
}

/**
 * Factory function for generating the token parsers known to our lexicon
 */
export const makeTokenParsers = (operations: Record<string, PrepareExecuteFunction>): OutputParser => {
  const stack: (Operation<any, any> | Operand<any, any>)[] = []

  const sum = () => (token: Token) => {
    const b = stack.pop()
    const a = stack.pop()

    if (!(a && b)) {
      throw new Error('Parse error.')
    }

    stack.push({
      operator: token.type,
      execute: operations[token.type || ''](),
      operands: [ a, b ],
    })
  }

  const limit = () => (token: Token) => {
    const a = stack.pop()

    if (!a) {
      throw new Error('Parse error.')
    }

    // force the dice to not collapse
    (a as DiceOperand).value.collapse = false

    stack.push({
      operator: token.type,
      execute: operations[token.type || ''](token.value),
      operands: [ a ],
    })
  }

  const choice = () => (token: Token) => {
    const a = stack.pop()

    if (!a) {
      throw new Error('Parse error.')
    }

    // force the dice to not collapse
    (a as DiceOperand).value.collapse = false

    stack.push({
      operator: 'choice',
      execute: operations[token.type || ''](),
      operands: [ a ]
    })
  }

  const push = () => (token: Token) => {
    stack.push({ type: token.type, value: token.value })
  }

  return {
    parse: {
      plus: sum(),
      minus: sum(),
      drop: limit(),
      keep: limit(),
      choice: choice(),
    },
    stack: {
      push: push(),
      get: () => stack[0]
    }
  }
}
