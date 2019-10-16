import React, {useState} from 'react';
import './App.css';

const fieldProperties = {
  firstName: "name",
  lastName: "name",
  email: "email",
  phoneNumber: "phone",
  birthday: "date",
  username: "username",
  customField: {
    placeholder: "My Custom Placeholder",
    spellcheck: false,
    validate: val => {
      if (val !== "hello") {
        throw new Error("value must be hello!")
      }
    }
  }
}

function App() {
  const [formState, setFormState] = useState({
    name: "zane"
  })
  return (
    <form>
      <input value={formState.name} onChange={e => setFormState({
        ...formState,
        name: e.target.value
      })} />
      <br />
      {formState.name}
    </form>
  );
}

export default App;

