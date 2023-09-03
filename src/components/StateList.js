import { Field } from "formik";
import { useEffect } from "react";

const StateList = ({ state, setState }) => {
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
      }));
    }
  };

  return (
    <div className="mb-5 flex flex-wrap">
      <label>States:</label>
      <Field
        name="state"
        as="select"
        onChange={handleStateChange}
        value={state.stateSelected}
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
