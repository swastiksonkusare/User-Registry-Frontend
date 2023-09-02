import { Field } from "formik";
import { useEffect } from "react";

const StateList = ({ state, setState }) => {
  console.log(state);

  useEffect(() => {
    if (state.countrySelected && state.states.length > 0 && setState) {
      setState((prevState) => ({
        ...prevState,
        stateSelected: state.states[0].name,
      }));
    }
  }, [state.countrySelected, state.states, state.editingUser]);

  const handleStateChange = (e) => {
    if (state.countrySelected) {
      setState((prevState) => ({
        ...prevState,
        stateSelected: e.target.value,
        editingUser: {
          ...prevState.editingUser,
          state: "",
        },
      }));
    }
  };

  return (
    <div className="mb-5">
      <label>States:</label>
      <Field
        name="state"
        as="select"
        onChange={handleStateChange}
        value={
          state.editingUser ? state.editingUser.state : state.stateSelected
        }
      >
        {!state?.countrySelected ? (
          <option
            key={state?.editingUser?._id}
            value={state?.editingUser?.state}
          >
            {state?.editingUser?.state}
          </option>
        ) : (
          state.states.length > 0 &&
          state.states.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))
        )}
      </Field>
    </div>
  );
};

export default StateList;
