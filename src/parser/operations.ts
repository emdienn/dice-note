import { LimitSpec, PrepareExecuteFunction } from './@types'

/**
 * Factory method for making an addition or subtraction operation
 */
const makeSumOp = (op: (a: number, b: number) => number) => (a:number[], b:number[]) => {
  if (!a.length || !b.length) {
    return [ NaN ]
  }
  if (a.length == 1) {
    if (b.length == 1) {
      return [ op(a[0], b[0]) ]
    }
    return b.map(v => op(v, a[0]))
  }
  return a.map(v => op(v, b[0]))
}


/**
 * Operation for adding two values together
 */
const plus = () => makeSumOp((a,b) => a + b)


/**
 * Operation for subtracting one value from another
 */
const minus = () => makeSumOp((a, b) => a - b)


/**
 * Operation for keeping a quantity of values from a set
 */
const keep = ({ edge, qty }:LimitSpec) => (a:number[]) => {
  a.sort((a, b) => a == b ? 0 : a < b ? -1 : 1)

  const output:number[] = []

  for (let i = 0; i < qty; ++i) {
    output.push(edge == 'HIGH' ? a.pop() : a.shift() as any)
  }

  return [ output.reduce((a, v) => a + v, 0) ]
}


/**
 * Operation for dropping a quantity of values from a set
 */
const drop = ({ edge, qty }:LimitSpec) => (a:number[]) => {
  a.sort((a, b) => a == b ? 0 : a < b ? -1 : 1)

  for (let i = 0; i < qty; ++i) {
    if (edge == 'HIGH') {
      a.pop()
    } else {
      a.shift()
    }
  }

  return [ a.reduce((a, v) => a + v, 0) ]
}


/**
 * Operation for preventing a multi-dice roll collapsing (here it does nothing,
 * we just return the values as-is - the prevention happens elsewhere)
 */
const choice = () => (a: number[]) => a


export default { plus, minus, keep, drop, choice } as Record<string, PrepareExecuteFunction>
