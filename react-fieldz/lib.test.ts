import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import { useFieldz } from './lib'
import expect from "expect"

test("it works", () => {
  expect(useFieldz()).toBe("it works")
})