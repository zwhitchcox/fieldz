### fieldz

`fieldz` is a form state management tool that *should* integrate well with
* [React](https://reactjs.org/)
* [vanilla](http://vanilla-js.com/)
* \* whatever you happen to be using

It's a minimalistic library with only [~90 LoC](lib.ts) and follows functional programming pattern.

It's also heckin' easy to use.

The first step is to declare your field properties:

```ts
import { nameValidator } from "validatorz"

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
```

Field properties consist of two values:

* `init`: initial value for the field
* `validate`: validation function that returns array of errors

This library is designed to integrate well with [validatorz](https://npmjs.com/validatorz),
but you can feel free to use whatever validation functions you want like in `customField`.

Next, we instantiate our fieldz™ using the `fieldz` function:
```ts
import { fieldz } from 'fieldz'
// fieldProperties

const [reducers, state] = fieldz(fieldProperties)
```

You can see `fieldz` returns a tuple with two objects.

`state` is the initial state of our fields. It's just data.

For our field properties, it would be something like this:

```ts
{
  firstName: {
    errors: [],
    touched: false,
    pristine: true,
    value: ''
  },
  customField: {
    errors: [],
    touched: false,
    pristine: true,
    value: 'this is my init value'
  }
}
```

There are 4 state properties

* `errors`: their array of errors (possibly empty) based on the current value
* `value`: their current value
* `touched`: boolean: whether they have been "touched" or not (the value has been adjusted, and the `input` has lost focus)
* `pristine`: a boolean value indicating whether or not the fields have been

Quite simple, but how do we manipulate state?

Well, for that, we'll turn to our handy dandy state-manipulators:

```ts
const [reducers, state] = fieldz(fieldProperties)
const {setValue, setValues, setTouched, resetField, resetFields } = reducers
```

Each function adjusts state and then returns the new state:

* `setValue`:
  * takes a `key` and a `value`
  * validates the data sets `errors` to any returned errors from the validator
  * sets pristine to `false` if not already set
* `setValues`:
  * takes a map of key values
  * performs everything `setValue` does
* `setTouched`: sets field's `touched` property to true if not already set
* `resetField`: sets a field's properties to their original value
* `resetFields`: same as `resetField`, but for all fields

But enough of the theory, let's see it in action.

With large chunks of code omitted, you could see something like this:

```tsx
import { fieldz } from 'fieldz'
import { nameValidator } from "validatorz"

const fieldProperties = {
  firstName: {
    errors: [],
    touched: false,
    pristine: true,
    value: ''
  },
  customField: {
    errors: [],
    touched: false,
    pristine: true,
    value: 'this is my init value'
  }
}

const Form = () => {
  const [[reducers, formState], _setFormState] = useState(() => fieldz(fieldProperties))
  const {setValue, setValues, setTouched, resetField, resetFields } = reducers
  const setFormState = state => _setFormState([reducers, state])

  return (
    <form>
      {Object.entries(formState)
        .map(([fieldName, {errors, value, touched, pristine}]) => (
          <div>
            {(touched && errors.length) ? <span className="input-error">{errors.map(err => <div>{err.toString()}</div>)}</span> : ""}
            <label for={fieldName}>{camelToTitle(fieldName)}</label>
            <input
              name={fieldName}
              value={value}
              onChange={e => setFormState(setValue(fieldName, e.target.value))}
              onBlur={_ => setFormState(setTouched(fieldName))}
            />
          </div>
        ))
      }
    </form>
  )
}
```

But of course, this will be much easier with react once `react-fieldz` is released, and that is in the works.

Please feel free to drop an issue or PR if you think anything could be improved!

Or just tell me if you like it, I would really appreciate that!