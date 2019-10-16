export const fieldPresets = {
  name: {
    spellcheck: false,
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    type: "text",
    validate: "name"
  },
  username: {
    spellcheck: false,
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    type: "text",
    validate: "username"
  },
  password: {
    type: "password",
    validate: "password"
  },
  date: {
    type: "date",
  },
  phone: {
    type: "text",
    validate: "phone"
  }
}

function camelToTitle(camelCase) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
}