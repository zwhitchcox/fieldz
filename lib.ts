import { useState, useMemo } from 'react'
import { FieldzInput, IFieldzFns } from './types'

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

// create an object with all the fields in the current object with the same initial value
// that is getSameInit({x: 3, y: 4}, false) => {x: false, y: false} wrapped in
// `useState` and memoized
const getSameInit = <T>(fields: FieldzInput, val: T) => Object.keys(fields)
  .reduce((acc: {[key: string]: T}, cur) => (acc[cur] = val, acc), {})

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

// get new memoized reverse map function
// don't want to create global memoizer for memory concerns for SSR
// could potentially implement lru or detect SSR to alleviate
const getReverseMapFn = () => memoize(state => {
  const reverseMap = {}
  for (const fieldName in state.values) {
    reverseMap[fieldName] = {
      errors: state.errors[fieldName],
      touched: state.touched[fieldName],
      pristine: state.pristine[fieldName],
      value: state.values[fieldName]
    }
  }
  return reverseMap
})


const parseFields = (fields: FieldzInput) => Object.entries(fields)
  .reduce((acc, [fieldName, {validate, init}]) => {
    acc.validators[fieldName] = memoize(getValidator(validate))
    acc.initValues[fieldName] = init
    return acc
  }, {
    validators: {},
    initValues: {},
  })

interface IFieldzState {
  errors: {[key: string]: Error[]}
  touched: {[key:string]: boolean}
  pristine: {[key:string]: boolean}
  values: {[key: string]: any}
  reverseMap: {[key: string]: {
    error: Error[],
    touched: boolean,
    pristine: boolean,
    value: any,
  }}
}

export const fieldz = (fields: FieldzInput): [IFieldzFns, IFieldzState] => {
  const {validators, initValues} = parseFields(fields)
  const getReverseMap = getReverseMapFn()
  const initState = {
    errors: getSameInit(fields, []),
    values: initValues,
    touched: getSameInit(fields, false),
    pristine: getSameInit(fields, true),
  }

  let state: IFieldzState = {
    ...initState,
    reverseMap: getReverseMap(initState)
  }

  const setValue = (key: string, val: any): IFieldzState => {
    const newState = {
      errors: {
        ...state.errors,
        [key]: validators[key](val)
      },
      values: {
        ...state.values,
        [key]: val,
      },
      pristine: state.pristine[key] ? {
        ...state.pristine,
        [key]: false,
      } : state.pristine,
      touched: state.touched
    }
    return (state = {
      ...newState,
      reverseMap: getReverseMap(newState),
    })
  }

  const setValues = (newVals): IFieldzState => {
    for (const key in newVals) {
      setValue(key, newVals[key])
    }
    return state
  }

  const resetFields = () => (state = {
    ...initState,
    reverseMap: getReverseMap(initState)
  })

  const resetField = (key: string) => {
    const newState = {
      touched: {
        ...state.touched,
        [key]: false
      },
      pristine: {
        ...state.pristine,
        [key]: true,
      },
      errors: {
        ...state.errors,
        [key]: []
      },
      values: {
        ...state.values,
        [key]: initValues[key],
      },
    }

    return (state = {
      ...newState,
      reverseMap: getReverseMap(newState)
    })
  }

  const setTouched = (key: string) => {
    if (state.touched[key]) return state
    const newState = {
      ...state,
      touched: {
        ...state.touched,
        [key]: true,
      }
    }
    return (state = {
      ...newState,
      reverseMap: getReverseMap(newState)
    })
  }

  return [
    {
      setValue,
      setValues,
      resetFields,
      resetField,
      setTouched,
    },
    state
  ]
}