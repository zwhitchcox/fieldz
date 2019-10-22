### fieldz

`fieldz` is a form state management tool that *should* integrate well with
* [React](https://reactjs.org/)
* [vanilla](http://vanilla-js.com/)
* \* whatever you happen to be using

It's a minimalistic library with only [~170 LoC](lib.ts) and follows functional programming pattern.

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

// previous code

const [{setValue, setTouched, setValues, resetFields, resetField}, state] = fieldz(fieldProperties)
```

You can see `fieldz` returns a tuple with two objects.

`state` is the initial state of our fields. It's just data.

For our field properties, it would return something like this:

```ts
{
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
```
woah woah woah, ok, that's a lot, but it's not as complicated as it seems.

There are 4 main state properties we have to worry about. They each hold a map of field names to

* `errors`: their array of errors (possibly empty) based on the current value
* `value`: their current value
* `touched`: boolean: whether they have been "touched" or not (the value has been adjusted, and the `input` has lost focus)
* `pristine`: a boolean value indicating whether or not the fields have been

That's a simple as it gets. But wait, what's that little guy at the end?

`reverseMap` is just a convenience replication of the previous data, of a map of properties to their field name,
it's a map of field names to their properties.

This is sometimes helpful because, for instance, you might want to iterate through all errors to put at the top of your form,
but iterate through each field itself to create the `input` element.

Maybe something like this:
