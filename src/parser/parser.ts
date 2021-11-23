import Parser from './shunt'

import type { Operator } from './shunt'

const factor = {
  precedence: 2,
  associativity: 'left',
} as Operator

const term = {
  precedence: 1,
  associativity: 'left',
} as Operator

const suffix = {
  precedence: 10,
  associativity: 'left',
} as Operator

// the list of tokens known to our lexicon
export default new Parser({
  plus: term,
  minus: term,
  repeat: factor,
  drop: suffix,
  keep: suffix,
  choice: suffix,
})
