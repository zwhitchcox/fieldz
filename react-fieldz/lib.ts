export const useFieldz  = () => "it works"
const [[reducers, formState], _setFormState] = useState(() => fieldz(fieldProperties))
const {setValue, setValues, setTouched, resetField, resetFields } = reducers
const setFormState = state => _setFormState([reducers, state])