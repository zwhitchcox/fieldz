import { fieldPresets } from './field-presets';
import { useState } from 'react'
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
const memoizedGetProp = memoize(getProp)

const getTouchedDefault = properties => Object.keys(properties)
  .reduce((acc, cur) => (acc[cur] = false, acc), {})
const memoizedGetTouchedDefault = memoize(getTouchedDefault)

export const fieldz = properties => {
  const [errors, setErrors] = useState([])
  const [touched, setTouched] = useState(memoizedGetTouchedDefault(properties))
  for (const key in properties) {
    const {validate, preset, ...fields}= memoizedGetProp(properties[key])
    const fieldProps = {
      ...fields,
      onChange: e => {
        try {
          validate(e.target.value)
        } catch (e) {

        }
      }
    }
  }
}

