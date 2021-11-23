/**
 * Check we can convert from string notation to a list of dice
 */
import { ERROR_INVALID_NOTATION, prepare, validate } from '../..'
import fixtures from '../fixtures'

Object.entries(fixtures).forEach(
  ([ notation, { dice:expected } ]) => test(
    notation,
    () => {
      if (expected instanceof Error) {
        expect(validate(notation)).toEqual(false)
        expect(() => prepare(notation)).toThrowError(ERROR_INVALID_NOTATION)
      } else {
        expect(validate(notation)).toEqual(true)
        expect(prepare(notation).dice).toEqual(expected)
      }
    }
  )
)
