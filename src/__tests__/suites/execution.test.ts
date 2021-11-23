/**
 * Check we can get all the way through the execution
 */
import { ERROR_INVALID_NOTATION, prepare } from '../..'
import fixtures from '../fixtures'

Object.entries(fixtures).forEach(
  ([ notation, { dice:expectedDice, roll, result:expectedOutcome } ]) => test(
    notation,
    () => {
      if (expectedDice instanceof Error) {
        expect(() => prepare(notation)).toThrowError(ERROR_INVALID_NOTATION)
      } else {
        const { dice, result } = prepare(notation)
        expect(dice).toEqual(expectedDice)

        if (expectedOutcome instanceof Error) {
          expect(() => result(roll)).toThrowError()
        } else {
          expect(result(roll)).toEqual(expectedOutcome)
        }

      }
    }
  )
)
