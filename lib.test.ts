import { test, /*describe, before, after, afterEach, beforeEach*/ } from 'tezt'
import { fieldz } from './lib'
import expect from "expect"

test("it works", () => {
  expect(fieldz()).toBe("it works")
})