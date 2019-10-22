import { test, before, /*describe, after, afterEach, beforeEach*/ } from 'tezt'
import { fieldz } from './lib'
import { nameValidator, dobValidator, usernameValidator } from 'validatorz'
import expect from "expect"

const fieldProperties = {
  firstName: {
    init: "",
    validate: nameValidator
  },
  customField: {
    validate: (val: string) => {
      if (val !== "hello") {
        return [new Error("value must be hello!")]
      }
      return []
    },
    init: "this is my init value"
  }
}

const initExpected = {
  firstName: { errors: [], touched: false, pristine: true, value: '' },
  customField: {
    errors: [],
    touched: false,
    pristine: true,
    value: 'this is my init value'
  }
}

let setValue, setTouched, setValues, resetFields, resetField, state;
before(() => {
  const {getState, ...actions} = fieldz(fieldProperties)
  state = getState()
  setValue = actions.setValue
  setTouched = actions.setTouched
  setValues = actions.setValues
  resetFields = actions.resetFields
  resetField = actions.resetField
})



test("it initializes", () => {
  const { getState } = fieldz(fieldProperties)
  const state = getState()
  expect(state).toEqual(initExpected)
})

test("it shows correct error", () => {
  expect(setValue("firstName", "Zane")).toEqual({
    firstName: { errors: [], touched: false, pristine: false, value: 'Zane' },
    customField: {
      errors: [],
      touched: false,
      pristine: true,
      value: 'this is my init value'
    }
  })
})

test("it handles multiple values set and touched", () => {
  expect(setTouched("firstName").firstName.touched).toBe(true)
  expect(resetField("firstName").firstName.touched).toBe(false)
  expect(setValue("customField", "hell").customField.errors).toEqual([new Error("value must be hello!")])
  expect(setValue("firstName", "Zane")).toEqual({
    firstName: { errors: [], touched: false, pristine: false, value: 'Zane' },
    customField: { errors: [new Error("value must be hello!")], touched: false, pristine: false, value: 'hell' }
  })
})

test("it resets all fields and sets them back again", () => {
  expect(resetFields()).toEqual(initExpected)
  expect(setValues({
    firstName: "Todd",
    customField: "hello",
  })).toMatchObject({
    firstName: {
      value: "Todd",
    },
    customField: {
      value: "hello",
      errors: [],
    }
  })
})