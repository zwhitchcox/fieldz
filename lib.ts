import { FieldzInput, IFieldzActions, IFieldzState } from './types'

const memoize = fn => {
  const cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache[key]) {
      return cache[key]
    }
    return cache[key] = fn(...args)
  }
}

const noErrors = (val: any): [] => []
const getValidator = validate => {
  if (typeof validate == "undefined") {
    return noErrors
  }
  if (typeof validate === "function") {
    return validate
  }

  throw new Error(`validate must be a function, got a ${typeof validate}: ${validate}`)
}

const deepCopy = obj => JSON.parse(JSON.stringify(obj))

export const fieldz = (fieldsInput: FieldzInput): IFieldzActions => {
  let state: IFieldzState = {}
  const validators = {}
  for (const fieldName in fieldsInput) {
    const {validate, init} = fieldsInput[fieldName]
    state[fieldName] = {
      value: init,
      touched: false,
      pristine: true,
      errors: [],
    }
    validators[fieldName] = memoize(getValidator(validate))
  }
  const initialState = deepCopy(state)

  const setValue = (key: string, val: any): IFieldzState => (state = {
    ...state,
    [key]: {
      errors: validators[key](val),
      value: val,
      pristine: false,
      touched: state[key].touched
    }
  })

  const setValues = (newVals): IFieldzState => {
    for (const key in newVals) {
      setValue(key, newVals[key])
    }
    return state
  }

  const resetFields = () => (state = deepCopy(initialState))

  const resetField = (key: string) => (state = {
    ...state,
    [key]: deepCopy(initialState[key])
  })

  const setTouched = (key: string) => {
    if (state[key].touched) return state
    return (
      state = {
        ...state,
        [key]: {
          ...state[key],
          touched: true
        }
      }
    )
  }

  const getState = () => state
  const setState = state => (state = state)

  return {
    setValue,
    setValues,
    resetFields,
    resetField,
    setTouched,
    getState,
    setState,
  }
}