import { Field } from "formik";

const StateList = ({ state }) => {
  // console.log(state);

  return (
    <div className="mb-5">
      <label>States:</label>
      <Field name="state" as="select">
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
