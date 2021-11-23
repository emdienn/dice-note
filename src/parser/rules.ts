import { compile, Rule } from 'moo'

import type { LimitSpec } from './@types'

/**
 * Returns a function that will handle either keeping or discarding a certain
 * quantity of values, from either the high edge or the low edge of a set.
 */
function makeLimitRule(operator: '-'|'+'): (s: string) => LimitSpec {
  return s => {
    let edge: 'LOW'|'HIGH', qty: number

    if (s.indexOf(operator) > -1) {
      edge = s.substr(-1) == 'L' ? 'LOW' : 'HIGH'
      qty = parseInt(s.substring(1).substr(0, s.length - 2) || '1')
    } else {
      edge = s[1] == 'L' ? 'LOW' : 'HIGH'
      qty = parseInt(s.substr(2) || '1')
    }

    return { edge, qty }
  }
}

/** Rule for dropping n dice from a roll */
const dropRule:Rule = {
  match: /\-\d*[LH]|d[LH]\d*/,
  value: makeLimitRule('-') as any
}

/** Rule for keeping n dice from a roll */
const keepRule:Rule = {
  match: /\+\d*[LH]|k[LH]\d*/,
  value: makeLimitRule('+') as any
}

/** Your garden-variety integer */
const numberRule:Rule = {
  match: /[1-9]\d*/,
  value: v => +v as any
}

/** Rule for what a dice looks like */
const diceRule:Rule = {
  match: /\d*d\d+/,
  value: s => {
    const [ qty, sides ] = s.split('d')
    return { qty: parseInt(qty || '1'), sides: parseInt(sides), collapse: true } as any
  },
}

/** Export the compiled lexer */
export default compile({
  WS: /[ \t]+/,
  dice: diceRule,
  drop: dropRule,
  keep: keepRule,
  number: numberRule,
  plus: '+',
  minus: '-',
  lparen: '(',
  rparen: ')',
  choice: 'c',
})
