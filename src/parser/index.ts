import operations from './operations'
import parser from './parser'
import lexer from './rules'
import { makeTokenParsers } from './token'

import type { Plan } from './@types'

/**
 * Takes a dice notation input, and outputs an execution plan
 */
export default function (input: string): Plan {
  // set up our lexer with a new input
  lexer.reset(`(${input})`)

  // this needs to happen every time (don't push it into parent scope) because
  // it contains the stack for the execution (perhaps should be renamed)
  const tokens = makeTokenParsers(operations)

  // parse the lexed results
  parser.parse(Array.from(lexer)).forEach(token => {
    if (!token) {
      return
    }

    // handle each token according to its type
    if ((token.type || '') in tokens.parse) {
      tokens.parse[token.type || ''](token)
    } else {
      // if it's not a known token, just push it onto the stack
      tokens.stack.push(token)
    }
  })

  // the stack will now only be 1 element long: the execution plan
  return tokens.stack.get()
}