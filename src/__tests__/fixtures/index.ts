import { ERROR_INVALID_NOTATION } from '../..'

type Fixture = Record<string, {
  dice: string[]|Error
  roll: number[]
  result: number[]|Error
}>

export default {

  // PASSING

  'd': {
    dice: new Error(ERROR_INVALID_NOTATION),
    roll: [],
    result: new Error,
  },
  '3+5': {
    dice: [],
    roll: [],
    result: [ 8 ],
  },
  'd6': {
    dice: [ 'd6' ],
    roll: [ 4 ],
    result: [ 4 ],
  },
  'd4+d6+d8+d12': {
    dice: [ 'd4', 'd6', 'd8', 'd12' ],
    roll: [   3,    5,    7,    11  ],
    result: [ 26 ],
  },
  '2d20kH+4': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 19 ],
  },
  '2d20kL': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 8 ],
  },
  '2d20dH': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 8 ],
  },
  '2d20dL': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 15 ],
  },
  '2d20-H': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 8 ],
  },
  '2d20-L': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 15 ],
  },
  '2d20+H': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 15 ],
  },
  '2d20+L': {
    dice: [ 'd20', 'd20' ],
    roll: [ 8, 15 ],
    result: [ 8 ],
  },
  'd6+3d4kH': {
    dice: [ 'd6', 'd4', 'd4', 'd4' ],
    roll: [ 6, 4, 1, 2 ],
    result: [ 10 ],
  },
  '3d8': {
    dice: [ 'd8', 'd8', 'd8' ],
    roll: [ 6, 4, 1 ],
    result: [ 11 ],
  },
  '(3+4d6)+(13-(2d20+1))': {
    dice: [ 'd6', 'd6', 'd6', 'd6', 'd20', 'd20' ],
    roll: [   4,    2,    3,    5,    19,    19  ],
    result: [ -9 ],
  },
  '4d4kH2+2d8kL-1': {
    dice: [ 'd4', 'd4', 'd4', 'd4', 'd8', 'd8' ],
    roll: [   1,    3,    2,    4,    6,    1  ],
    result: [ 7 ],
  },
  '(2d4+d6)+(2d8+d12)': {
    dice: [ 'd4', 'd4', 'd6', 'd8', 'd8', 'd12' ],
    roll: [   3,    2,    5,    7,    6,    11  ],
    result: [ 34 ],
  },
  '3d4c+1': {
    dice: [ 'd4', 'd4', 'd4' ],
    roll: [   4,    1,    3  ],
    result: [ 5, 2, 4 ],
  },
  '2d4c+1+4d8kH': {
    dice: [ 'd4', 'd4', 'd8', 'd8', 'd8', 'd8' ],
    roll: [   3,    1,    1,    2,    7,    5  ],
    result: [ 11, 9 ],
  },
  'd6+4+3d4c': {
    dice: [ 'd6', 'd4', 'd4', 'd4' ],
    roll: [   5,    4,    1,    3  ],
    result: [ 13, 10, 12 ],
  },

  /////// TO WORK ON ///////

  // '(d4+1)x3+(d20+4)x2': {
  //   dice: [ 'd4', 'd4', 'd4', 'd20', 'd20' ],
  //   roll: [ 3, 4, 2, 1, 11 ],
  //   result: [ 35 ],
  // },
  // '(2d4c+1)x3+4d8kH': {
  //   dice: [ 'd4', 'd4', 'd4', 'd4', 'd4', 'd4', 'd8', 'd8', 'd8', 'd8' ],
  //   roll: [ 3, 1, 3, 2, 4, 4, 1, 2, 7, 5 ],
  //   result: [ 12, 13, 16 ],
  // },

} as Fixture
