```tsx
/* Disclaimer: just totally contrived this, never run this code
  Nevertheless, it might be a good starting point */
const camelToLower = camelCase => camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./g, match => match.toUpperCase())
    .trim()

const myform = () => {
  // note: this will be "prettier" when `react-fieldz` comes out (in a few days)
  const [setState, state] = useState(() => {
    const [fieldzFns, fieldzState] = fieldz(fieldProperties)
    return {
      ...fieldzFns,
      ...fieldzState,
    }
  })
  // fieldz functions
  const {setValue, setTouched, setValues, resetFields, resetField} = state

  return (
    <div className="top-errors">
      {Object.entries(state.errors)
      .map(([fieldName, errors]) => {
        if (errors.length) {
          return <div>Error(s) in {fieldName}
            errors.map(err => <div>{err.toString()}</div>)
          </div>
        }
      }).filter(Boolean)
    </div>
    <form>
      {Object.entries(state.reverseMap)
        .map(([fieldName, {errors, value, touched, pristine}]) => (
          <div>
            {/* we only want to display errors if the value has been "touched" */}
            {/* You would use the following line if you didn't have the errors at the top */}
            {(touched && errors.length) ? <span className="input-error">{errors.map(err => <div>{err.toString()}</div>)}</span> : ""}
            <label for={fieldName}>{camelToTitle(fieldName)}</label>
            <input
              name={fieldName}
              value={value}
              onChange={e => setValue(fieldName, e.target.value)}
              onBlur={_ => setTouched(fieldName)}
            />
          </div>
        ))
      }
      {/* the submit function (not implemented) could loop through just the values */}
      <button type="submit" onClick={submitFn}>
    </form>
}
```
