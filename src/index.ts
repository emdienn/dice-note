import parse from './parser'
import { Operand, Operation, Plan } from './parser/@types'

export type DiceList = string[]
export type ResultHandler = (roll: number[]) => number[]

export const ERROR_INVALID_NOTATION = "Invalid notation provided."

export type PreparedRoll = {
  dice: DiceList
  result: ResultHandler
}

type Roll = number[]

/**
 * Prepare a notation string for execution.
 *
 * The return value provides a list of dice to be rolled by a RNG (or similar),
 * as well as a result() function into which you should pass the results of
 * those rolls, to receive your final outcome.
 *
 * If certain rolls are going to be executed often, your application should
 * cache this response, to save having to generate the executation plan more
 * often than is necessary.
 */
export function prepare(notation: string): PreparedRoll {
  const { dice, plan } = parseNotation(notation)
  const result = handleResult(dice, plan)

  return { dice, result }
}

/**
 * Check whether a notation string is valid, and can be executed.
 */
export function validate(notation: string): boolean {
  try {
    parse(notation)
    return true
  } catch (e) {
    return false
  }
}


// zero or more digits, followed by the letter d, followed by one or more digits
const diceRegex = /(\d*)d(\d+)/g
const multiplierRegex = /\(([^\)]*)\)x(\d+)/g


/**
 * Parse a given notation string into a dice list
 *
 * eg.
 * 2d6-6 = [ d6, d6 ]
 * d20+4 = [ d20 ]
 * 4d4kH2+2d8kL-1 = [ d4, d4, d4, d4, d8, d8 ]
 * 3d4c+1 = [ d4, d4, d4 ] -> this is magic missile at level 1
 *
 * @param {string} input
 */
function parseNotation(input: string): { dice: DiceList, plan: Plan } {
  try {
    // will throw if the notation is unparseable
    const plan = parse(input)

    const dice: string[] = []

    // first, inflate any multipliers into discrete terms
    const multiMatch = input.matchAll(multiplierRegex)
    for (const [ parsed, notation, multiplier ] of multiMatch) {
      const replace = new Array(parseInt(multiplier)).fill(notation).join('+')
      input = input.replace(parsed, replace)
    }

    // parse for all dice terms, iterate their count (or assume 1), and append
    // to the list for return
    const matches = input.matchAll(diceRegex)
    for (const [ , c, s ] of matches) {
      const count = c ? parseInt(c) : 1
      const sides = parseInt(s)
      for (let i = 0; i < count; ++i) {
        dice.push(`d${sides}`)
      }
    }

    return { dice, plan }

  } catch (e) {
    throw new Error(ERROR_INVALID_NOTATION + ": " + e)
  }
}


/**
 * Generate the result handler function for a given dice list and plan.
 */
function handleResult(dice: DiceList, plan: Plan): ResultHandler {

  // prepare the plan execution function
  const execute = makePlanExecutor(dice, plan)

  return roll => {
    // there should be the same number of results as dice
    if (roll.length !== dice.length) {
      throw new Error(`Expected ${dice.length} roll values, got ${roll.length} instead`)
    }

    // execute the handler on the roll given
    return execute(roll)
  }
}


/**
 * Generates the plan executor function.
 */
function makePlanExecutor(__dice: DiceList, plan: Plan) {
  return (roll: Roll): number[] => {
    // we need to take replicas of these lists, so we can mutate them safely
    const dice = [ ...__dice ]
    const outcomes = [ ...roll ]

    /**
     * Shim for handing either an operand or operation, depending on what's given
     */
    function handle(op: Plan): number[] {
      return 'type' in op ? handleOperand(op) : handleOperation(op)
    }

    /**
     * Handle an operation
     */
    function handleOperation(op:Operation<string, any>): number[] {

      // resolve nested operands/operations first
      const resolutions = op.operands.map(o => handle(o))

      // now execute ourselves on whatever the result was
      return op.execute.apply(null, resolutions)
    }

    /**
     * Handle an operand
     *
     * TODO: this should be made polymorphic, not hardcoded like this
     */
    function handleOperand(op:Operand<string, any>): number[] {
      // handle a simple integer
      if (op.type == 'number') {
        return [ op.value ]
      }

      // handle a dice roll (eg. 2d20)
      if (op.type == 'dice') {
        const { qty, sides, collapse } = op.value

        const output: number[] = []

        // for however many dice are nominated in the roll, iteratively pop those
        // off their respective stacks, and handle each in turn
        for (let i = 0; i < qty; ++i) {
          const poppedDice = dice.shift()
          const poppedRoll = outcomes.shift()

          // sanity checks

          if (`d${sides}` !== poppedDice) {
            throw new Error('Parser malfunction.')
          }

          if (typeof poppedRoll == 'undefined') {
            throw new Error('Array underflow.')
          }

          if (poppedRoll < 0 || poppedRoll > sides) {
            throw new Error(`Impossible roll (got ${poppedRoll} on a d${sides}), are your dice in the right order?`)
          }

          output.push(poppedRoll)
        }

        // if this roll should be "collapsed", sum the values
        if (collapse) {
          return [ output.reduce((a, v) => a + v, 0) ]
        }

        // an "uncollapsed" roll yields its values separately
        return output
      }

      // if the operand is of an unknown type, yield NaN
      return [ NaN ]
    }

    // begin.
    return handle(plan)
  }
}
