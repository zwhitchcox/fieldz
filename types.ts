export type FieldzInput = {
  [key: string]: IFieldzInputObject
}

export interface IFieldzInputObject {
  validate?: (arg: any) => Error[]
  init?: any
}

export interface IFieldzState {
  errors: {[key: string]: Error[]}
  values: {[key: string]: any}
  touched: {[key: string]: boolean}
  pristine: {[key: string]: boolean}
  reverseMap: {[key: string]: {
    error: Error[],
    value: any,
    touched: boolean,
    pristine: boolean,
  }}
}

export interface IFieldzFns {
  setValue: (key: string, newVal) => IFieldzState
  setValues: (newVals) => IFieldzState
  resetField: (key: string) => IFieldzState
  resetFields: () => IFieldzState
  setTouched: (key: string) => IFieldzState
}