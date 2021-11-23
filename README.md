# Dice Note

Dice notation interpreter, for all your digital dice rolling needs (except the
actual rolling).

## Installation

Install any way you normally get node packages onto your computer. I tend to use:
```sh
npm i dice-note
```

## What even is this?

Dice Note is fundamentally a string parser, designed to abstract away needing to
think too hard about the outcomes of dice rolls when making games or
applications that require such things. Think: table-top role-play games, but
online.

## What does it do

DN accepts a string representation of a dice roll, eg. `d6`, `4d8+4` or
`2d20kH+3`.

These can be quite complex at times, given various games require semantics like
"roll with advantage" or "drop lowest `n` values", etc.

As output, the initial `prepare()` function will provide a list of dice your
application needs to "roll" (by whatever mechanism you care to use), and a
`result() `function into which those raw dice results can be put, which will
then itself return the final numeric result(s).

It will also validate a string for you&mdash;tell you whether or not it's valid
notation.

## What doesn't it do

Specifically, DN does *not* roll dice for you. That's left to the application's
discretion, because you may want to use a random number generator, a THREE.js
dice roller, or fudge the numbers in any given circumstance.

## How does it work?

Less tell, more show:

```ts
import { prepare } from 'dice-note'

// A simple example to start: two d6 die
const { dice, result } = prepare('2d6')
// dice = [ "d6", "d6" ]

// Let's fudge those numbers, but we could use RNG to get this result.

// Remember that it's important that the INDEX of the result matches that of
// the dice from the `dice` array
const weRolled = [ 2, 6 ]

const outcome = result(weRolled)
// outcome = [ 8 ]
```

Dice Note expects the following constraints on the array input into the `result`
function:
 - all array elements are numbers
 - the length of the array matches that of `dice`, given from the `prepare`
   function
 - each element in the roll results array (`weRolled`, above) must positionally
   match the die for which it was rolled, ie. their index in the array must be
   the same


You may notice that the "preparation step" and the "execution step" have been
separated. This is on purpose, one of the benefits of which is that you can
run the same roll more than once without having to redo the execution-plan step.

To that end, if certain rolls are going to be executed frequently, for
performance it would be beneficial for your application to cache the execution
plan, rather than recompute it every time.

## More complex examples

### Selective results

Dropping or keeping certain results within a roll is common (eg. to roll with
advantage or disadvantage). While supporting every possible variant notation
isn't possible, the following quasi-standard notations should provide enough
flexibility to support most scenarios.

To **drop** dice, the following notations are supported:
 - `-(n)H` (eg. 4d6-2H) - drop the highest 2 results
 - `-(n)L` (eg. 4d6-L) - drop the lowest 1 (implied) result
 - `dL(n)` (eg. 4d6dL2) - drop the lowest 2 results (`n` can be omitted if 1)
 - `dH(n)` (eg. 4d6dH1) - drop the highest 1 result (`n` can be omitted if 1)

To **keep** dice, the following notations are supported:
 - `+(n)L` (eg. 4d6+2L) - keep the lowest 2 results
 - `+(n)H` (eg. 4d6+H) - keep the highest 1 (implied) result
 - `kH(n)` (eg. 4d6kH2) - keep the highest 2 (`n` can be omitted if 1)
 - `kL(n)` (eg. 4d6kL1) - keep the lowest 1 (`n` can be omitted if 1)

```ts
import { prepare } from 'dice-note'

const rollWithDisadvantage = '2d20dH'
const rollWithAdvantage = '2d20+H'

const dis = prepare(rollWithDisadvantage)
const adv = prepare(rollWithAdvantage)
// dis.dice = adv.dice = [ "d20", "d20" ]

const roll = [ 19, 4 ]

const disOutcome = dis.result(roll)
// disOutcome = [ 4 ]

const advOutcome = adv.result(roll)
// advOutcome = [ 19 ]
```

### Player's choice

In some games, the player can choose which value they want to apply, rather
than sum the results. For Dice Note, this is represented with a suffix of 'c'
on the dice notation, eg. `2d20c`.

Using the choice option should be used sparingly, and on not-too-complicated
rolls; the more complicated a roll, the more likely players will wonder how the
results they got were derived, and whether or not your application is cheating.

_Note that it is not possible with Dice Note to combine 'c' with 'k' or 'd'._

```ts
import { prepare } from 'dice-note'

const { dice, result } = prepare('2d20c+4')
// dice = [ "d20", "d20" ]

const outcome = result([ 17, 3 ])
// if there were no 'c' term, the 17 and 3 would be summed; instead, the +4 is
// applied to each roll before being included in the output
// outcome = [ 21, 7 ]
```

This feature can also be used to emulate situations such as Dungeons &amp;
Dragons' "Magic Bullet" spell, where 3 or more dice are rolled, but all the
dice values are used separately:

```ts
import { prepare } from 'dice-note'

const { dice, result } = prepare('3d4c+1') // magic bullet cast at level 1
// dice = [ "d4", "d4", "d4" ]

const outcome = result([ 4, 2, 3 ])
// outcome = [ 5, 3, 4 ]
```

### Arithmetic

Dice Note supports basic addition and substraction of modifiers. Multiplication
and division are not supported.

#### Adding a modifier
```ts
import { prepare } from 'dice-note'

const { dice, result } = prepare('d20+7')
// dice = [ "d20" ]

const outcome = result([ 11 ])
// outcome = [ 18 ]
```

## Validation

The `validate` function is intended as a lightweight (as in, per-keystroke)
means to prevent invalid notations hitting the more complex&mdash; and thus
slower&mdash;logic.

```ts
import { validate } from 'dice-note'

const valid = validate('4+2d20-2')
// valid = true
```

## Licence

MIT

## Bugs and Issues

Please use GitHub's issue tracker to report bugs.