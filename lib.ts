import { fieldPresets } from './field-presets';
import { useState, useMemo } from 'react'
import memoize from "lodash/memoize"

const getHumanList = (arr, conjunction = "and") => [arr.slice(0, -1).join(', '), arr.slice(-1)[0]]
  .join(arr.length < 2 ? '' : arr.length < 3 ? ` ${conjunction} ` : `, ${conjunction} `)

const getProp = (prop: string | {[key: string]: any}) => {
  if (typeof prop === "string") {
    prop = {preset: prop}
  }
  let preset = {};
  if (typeof prop.preset === "string") {
    if (!fieldPresets[prop.preset]) {
      throw new Error(`Cannot find preset ${prop}. Presets must be one of ${getHumanList(Object.keys(fieldPresets))}`)
    } else {
      preset = prop.preset
    }
  }
  prop = {
    ...prop,
    ...preset,
  }
  if (typeof prop.validate === "string") {

  }
  return prop
}

const getTouchedInit = properties => Object.keys(properties)
  .reduce((acc, cur) => (acc[cur] = false, acc), {})

export const fieldz = fields => {
  const [errors, setErrors] = useState([])
  const initTouched = useMemo(() => getTouchedInit(fields), [fields])
  const [touched, setTouched] = useState(initTouched)

  const result = {}
  for (const fieldName in fields) {
    const {validate, preset, ...additionalProps}= useMemo(() => getProp(fields[fieldName]), [fields[fieldName]])
    const props = useMemo(() => ({
      ...fields,
      onChange: e => {
        if (!touched[fieldName]) {
          setTouched({
            ...touched,
            fieldName: true,
          })
        }
        const fieldErrors = validate(e.target.value, {
          collectAll: true,
        })
        setErrors({
          ...errors,
          [fieldName]: fieldErrors,
        })
      },
      ...additionalProps
    }), [validate, additionalProps])
    result[fieldName] = {
      props,
      errors,
      touched,
    }
  }
  return result
}

