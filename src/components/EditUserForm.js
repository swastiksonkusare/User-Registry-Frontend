import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import InputField from "./InputField";
import StateList from "./StateList";
import CountryList from "./CountryList";

const EditUserForm = ({ fetchData, state, setState }) => {
  const initialValues = {
    firstName: state.editingUser.firstName,
    lastName: state.editingUser.lastName,
    email: state.editingUser.email,
    number: state.editingUser.number,
    address1: state.editingUser.address1,
    address2: state.editingUser?.address2,
    state: state.editingUser.state,
    country: state.editingUser.country,
    zipCode: state.editingUser.zipCode,
    countryCode: state.editingUser.countryCode,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
    lastName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
    email: Yup.string().email("Invalid email format").required("Required"),
    address1: Yup.string().required("Required"),
    zipCode: Yup.number().required("Required"),
    number: Yup.string()
      .matches(/^\d{10}$/, "Enter a valid mobile number")
      .required("Mobile number is required"),
  });

  const handleUpdate = async (values) => {
    values.country = state.countrySelected;
    values.state = state.stateSelected
      ? state.stateSelected
      : state.states[0].name;
    values.countryCode = state.countryDetails.phonecode;

    try {
      await axios.put(
        `https://user-registry-backend.onrender.com/users/${state.editingUser._id}`,
        values
      );
      alert("User updated");

      setState((prevState) => ({
        ...prevState,
        editingUser: null,
        stateSelected: "",
        countrySelected: "",
      }));
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="fixed top-0 left-0 w-full  h-full bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="max-h-96 overflow-y-auto">
        <div class="bg-white p-10 rounded-lg shadow-2xl m-6 ">
          <h2 className="text-lg font-bold mb-4 text-center">Edit User</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            <Form>
              <InputField label="First Name" name="firstName" />
              <InputField label="Last Name" name="lastName" />
              <InputField label="Email" name="email" type="email" />
              <InputField label="Address 1" name="address1" />
              <InputField
                label="Address 2"
                name="address2"
                optional="Optional"
              />

              <StateList state={state} setState={setState} />

              <CountryList state={state} setState={setState} />
              <InputField label="Zip Code" name="zipCode" type="number" />
              <div>
                <label>Mobile Number:</label>
                <Field name="countryCode" as="select">
                  <option value={`+${state.countryDetails.phonecode}`}>
                    +{state.countryDetails.phonecode}
                  </option>
                </Field>
                <InputField type="text" name="number" />
              </div>

              <div className="mt-3 flex justify-evenly">
                <button
                  className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md"
                  onClick={() => setState({ ...state, editingUser: null })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
                >
                  Update
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
