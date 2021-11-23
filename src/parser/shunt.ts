/***
 * A JavaScript Implementation of Edsger Wybe Dijkstra's Shunting Yard Algorithm.
 *
 * @credit adapted from https://gist.github.com/aaditmshah/6683499
 */
import { Token } from 'moo'

export type OperatorSet = Record<string, Operator>
export type Operator = {
  precedence: number
  associativity: 'left' | 'right'
}

const tokenIsLeftParen = (t:Token | undefined) => t && t.type === 'lparen'

export default class {
  private table: OperatorSet

  constructor(table: OperatorSet) {
    this.table = table
  }

  private tableHasToken(token: Token | undefined): boolean {
    return (token?.type || '') in this.table
  }

  private getOperator(token: Token | undefined): Operator | undefined {
    return (token?.type || '') in this.table ? this.table[token?.type || ''] : undefined
  }

  parse(input: Token[]): (Token | undefined)[] {
    const output: (Token | undefined)[] = []
    const stack: Token[] = []

    input.forEach(token => {
      switch (token.type) {
        case 'lparen':
          // left parentheses: add to the stack
          stack.unshift(token)
          return

        case 'rparen':
          // right parentheses: unwind the stack
          let tok
          while (stack.length) {
            // fifo
            tok = stack.shift()
            // break if we hit left parentheses
            if (tokenIsLeftParen(tok)) {
              break // break while
            }
            // push this token onto the output
            output.push(tok)
          }

          // we *should* now have just a left paren left
          if (!tokenIsLeftParen(tok)) {
            throw new Error('Mismatched parentheses.')
          }
          return

        default:
          // any token not parentheses
          if (!this.tableHasToken(token)) {
            output.push(token)
            return
          }

          while (stack.length) {
            const punctuator = stack[0];

            if (tokenIsLeftParen(punctuator)) {
              break // break while
            }

            const operator = this.getOperator(token)
            const precedence = operator?.precedence || Infinity
            const antecedence = this.getOperator(punctuator)?.precedence || Infinity

            if (precedence > antecedence || precedence === antecedence && operator?.associativity === 'right') {
              break // break loop
            }

            output.push(stack.shift())
          }

          stack.unshift(token)
      }
    })

    while (stack.length) {
      const token = stack.shift()
      if (!tokenIsLeftParen(token)) {
        throw new Error("Mismatched parentheses.")
      }
      output.push(token)
    }

    return output
  }
}
