import { Field } from "formik";

const StateList = ({ state }) => {
  return (
    <div className="mb-5">
      <label>States:</label>
      <Field name="state" as="select">
        {state.states.length > 0 &&
          state.states.map((s) => (
            <option key={s.id} value={s.name} data-iso2={s.iso2}>
              {s.name}
            </option>
          ))}
      </Field>
    </div>
  );
};

export default StateList;
