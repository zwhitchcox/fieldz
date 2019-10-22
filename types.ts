export type FieldzInput = {
  [key: string]: IFieldzInputObject
}

export interface IFieldzInputObject {
  validate?: (arg: any) => Error[]
  init?: any
}

export interface IFieldzState {
  [key: string]: {
    errors: Error[],
    touched: boolean,
    pristine: boolean,
    value: any,
  }
}

export interface IFieldzActions {
  setValue: (key: string, newVal) => IFieldzState
  setValues: (newVals) => IFieldzState
  resetField: (key: string) => IFieldzState
  resetFields: () => IFieldzState
  setTouched: (key: string) => IFieldzState
  getState: () => IFieldzState
  setState: (IFieldzState) => IFieldzState
}