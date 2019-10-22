import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
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
  errors: { firstName: [], customField: [] },
  values: { firstName: '', customField: 'this is my init value' },
  touched: { firstName: false, customField: false },
  pristine: { firstName: true, customField: true },
  reverseMap: {
    firstName: { errors: [], touched: false, pristine: true, value: '' },
    customField: {
      errors: [],
      touched: false,
      pristine: true,
      value: 'this is my init value'
    }
  }
}
test("it initializes", () => {
  const [_, state] = fieldz(fieldProperties)
  expect(state).toEqual(initExpected)
})

test("it shows correct error", () => {
  const [{setValue, setTouched, setValues, resetFields, resetField}, _] = fieldz(fieldProperties)

  expect(setValue("firstName", "Zane")).toEqual({
    errors: { firstName: [], customField: [] },
    values: { firstName: 'Zane', customField: 'this is my init value' },
    pristine: { firstName: false, customField: true },
    touched: { firstName: false, customField: false },
    reverseMap: {
      firstName: { errors: [], touched: false, pristine: false, value: 'Zane' },
      customField: {
        errors: [],
        touched: false,
        pristine: true,
        value: 'this is my init value'
      }
    }
  })

  expect(setTouched("firstName").reverseMap.firstName.touched).toBe(true)
  expect(resetField("firstName").reverseMap.firstName.touched).toBe(false)
  expect(setValue("customField", "hell").errors.customField).toEqual([new Error("value must be hello!")])
  expect(setValue("firstName", "Zane")).toEqual({
    errors: {
      firstName: [],
      customField: [new Error("value must be hello!")],
    },
    values: { firstName: 'Zane', customField: 'hell' },
    pristine: { firstName: false, customField: false },
    touched: { firstName: false, customField: false },
    reverseMap: {
      firstName: { errors: [], touched: false, pristine: false, value: 'Zane' },
      customField: { errors: [new Error("value must be hello!")], touched: false, pristine: false, value: 'hell' }
    }
  })
  expect(resetFields()).toEqual(initExpected)
  expect(setValues({
    firstName: "Todd",
    customField: "hello",
  })).toMatchObject({
    reverseMap: {
      firstName: {
        value: "Todd",
      },
      customField: {
        value: "hello",
        errors: [],
      }
    }
  })
})