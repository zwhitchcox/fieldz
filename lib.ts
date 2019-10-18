import { useState, useMemo } from 'react'
import { createValidator, validatorzPresets, ValidatorzPresetName } from 'validatorz'
import { ReactFieldzInput } from './types'

const wrap = (str: string, wrapper: string) => `${wrapper}${str}${wrapper}`
// join list with conjunction: [1,2,3] => "1, 2, and 3"
const getHumanList = (arr: any[], conjunction = "and") => [arr.slice(0, -1).join(', '), arr.slice(-1)[0]]
  .join(arr.length < 2 ? '' : arr.length < 3 ? ` ${conjunction} ` : `, ${conjunction} `)
const presetHumanList = getHumanList(Object.keys(validatorzPresets))
// get preset from validatorz
const getPreset = (presetName: ValidatorzPresetName) => {
  if (validatorzPresets[presetName]) {
    return validatorzPresets[presetName]
  }
  throw new Error(`Cannot find preset validator preset ${wrap(presetName,"`")}. Presets must be one of ${presetHumanList}`)
}

// create an object with all the fields in the current object with the same initial value
// that is getStateSameInit({x: 3, y: 4}, false) => {x: false, y: false} wrapped in
// `useState` and memoized
const getStateSameInit = <T>(fields: ReactFieldzInput, val: T) => useState(useMemo(() => Object.keys(fields)
  .reduce((acc: {[key: string]: T}, cur) => (acc[cur] = val, acc), {}), [fields]))

const noop = (val: any): [] => []
const getValidator = validate => {
  if (typeof validate === "undefined") {
    return noop
  }
  return createValidator(validate)
}

const initValsByType = {
  string: "",
  number: 0,
}
const getInitValue = (fieldInput, fieldName) => {
  if (typeof fieldInput.init !== "undefined") {
    return fieldInput.init
  }

  if (typeof fieldInput.validate === "string") {
    const preset = getPreset(fieldInput.validate)
    return initValsByType[(preset as {[key:string]: ValidatorzPresetName}).type]
  }

  throw new Error(`Could not create default value for ${fieldName}`)
}

const parseFields = (fields: ReactFieldzInput) => {
  const initValidators = {}
  const initValues = {}
  for (const fieldName in fields) {
    const fieldInputRaw = fields[fieldName]
    const fieldInput = typeof fieldInputRaw === "string" ? {validate: fieldInputRaw} : fieldInputRaw
    initValidators[fieldName] = useMemo(() => getValidator(fieldInput.validate), [fieldInput])
    initValues[fieldName] = useMemo(() => getInitValue(fieldInput, fieldName), [fieldInput])
  }
  return {initValidators, initValues}
}

const getReverseMap = state => useMemo(() => {
  const reverseMap = {}
  for (const fieldName in state.values) {
    reverseMap[fieldName] = {
      errors: state.errors[fieldName],
      touched: state.touched[fieldName],
      validator: state.validators[fieldName],
      value: state.values[fieldName]
    }
  }
  return reverseMap
}, [state])

export const useFieldz = (fields: ReactFieldzInput) => {
  const [errors, setErrors] = getStateSameInit(fields, [])
  const [touched, setTouched] = getStateSameInit(fields, false)
  const {initValidators, initValues} = useMemo(() => parseFields(fields), [fields])
  const [values, setValues] = useState(initValues)
  const [validators, setValidators] = useState(initValidators)

  const setValue = (key, val) => {
    const newErrors = useMemo(() => validators[key](val), [key, val])
    if (!touched[key]) {
      setTouched({
        ...touched,
        [key]: true,
      })
    }
    setValues({
      ...values,
      [key]: val,
    })
    setErrors({
      ...errors,
      [key]: newErrors
    })
  }

  const result = {
    errors,
    setErrors,
    touched,
    setTouched,
    validators,
    setValidators,
    setValues,
    values,
    setValue,
  }

  ;(result as any).reverseMap = getReverseMap(result)

  return result
}