export type Plan = Operation<string, any> | Operand<string, any>

export type Operand<T extends string, V> = {
  type: T
  value: V
}

export type Operation<T extends string, V extends Operation<string, any> | Operand<any, any>> = {
  operator: T
  operands: V[]
  execute: ExecuteFunction,
}

export type PrepareExecuteFunction = (spec?: any) => ExecuteFunction
export type ExecuteFunction = (...args: any[]) => number[]

export type LimitSpec = { edge: 'LOW'|'HIGH', qty: number }
