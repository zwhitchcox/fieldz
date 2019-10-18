import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import { useFieldz } from './lib'
import expect from "expect"

const fieldProperties = {
  firstName: "name",
  lastName: "name",
  email: "email",
  phoneNumber: "phone",
  dob: "dob",
  username: {
    validate: "username",
    init: "user3",
  },
  customField: {
    validate: () => (val: string) => {
      if (val !== "hello") {
        return [new Error("value must be hello!")]
      }
      return []
    },
    init: "this is my value"
  }
}

test("it works", () => {
  const testComponent = useFieldz(fieldProperties)

})

type x = "mystring"

function myfunc(x: x) {
  console.log(x)
}
myfunc("mystring")