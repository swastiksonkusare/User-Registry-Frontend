import { Field } from "formik";

const CountryList = ({ setState, state }) => {
  return (
    <div className="mb-5 flex flex-wrap">
      <label>Country:</label>
      <Field
        name="country"
        as="select"
        onChange={(e) => {
          setState((prevState) => ({
            ...prevState,
            countrySelected: e.target.value,
          }));

          setState((prevState) => ({
            ...prevState,
            countryIsoSelected:
              e.target.options[e.target.selectedIndex].getAttribute("data-iso"),
          }));
        }}
        value={
          !state?.countrySelected
            ? state?.editingUser?.country
            : state?.countrySelected
        }
        className="w-full"
      >
        {state.countries.length > 0 &&
          state.countries.map((c) => (
            <option key={c.id} value={c.name} data-iso={c.iso2}>
              {c.name}
            </option>
          ))}
      </Field>
    </div>
  );
};

export default CountryList;
