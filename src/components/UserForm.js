import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import InputField from "./InputField";
import UserCard from "./UserCard";
import EditUserForm from "./EditUserForm";
import StateList from "./StateList";
import CountryList from "./CountryList";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
  lastName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
  email: Yup.string().email("Invalid email format").required("Required"),
  address1: Yup.string().required("Required"),
  zipCode: Yup.string()
    .matches(/^\d+$/, "Enter a valid numeric ZIP code")
    .required("Required"),

  number: Yup.string()
    .matches(/^\d{10}$/, "Enter a valid mobile number")
    .required("Mobile number is required"),
});

const UserForm = () => {
  const [state, setState] = useState({
    users: [],
    editingUser: null,
    countries: [],
    states: [],
    countrySelected: "",
    stateSelected: "",
    countryIsoSelected: "",
    countryDetails: {},
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    countryCode: "",
    address1: "",
    address2: "",
    state: "",
    country: state.countrySelected,
    zipCode: "",
  };

  const config = {
    headers: {
      "X-CSCAPI-KEY": process.env.REACT_APP_API_KEY,
    },
  };

  const fetchData = async () => {
    try {
      const countriesResponse = axios.get(
        "https://api.countrystatecity.in/v1/countries",
        config
      );

      const usersResponse = axios.get(
        "https://user-registry-backend.onrender.com/users"
      );

      const [countriesData, usersData] = await axios.all([
        countriesResponse,
        usersResponse,
      ]);

      setState((prevState) => ({
        ...prevState,
        countries: countriesData.data,
      }));

      setState((prevState) => ({
        ...prevState,
        users: usersData.data,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStatesByCountry = async (countryIsoSelected) => {
    if (!countryIsoSelected) return;

    try {
      const { data } = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryIsoSelected}/states`,
        config
      );

      setState((prevState) => ({
        ...prevState,
        states: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCountryDetails = async (countryIsoSelected) => {
    if (!countryIsoSelected) return;

    try {
      const { data } = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryIsoSelected}`,
        config
      );

      setState((prevState) => ({
        ...prevState,
        countryDetails: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStatesByCountry(state.countryIsoSelected);
    fetchCountryDetails(state.countryIsoSelected);
  }, [state.countrySelected, state.countryIsoSelected]);

  const handleSubmit = async (values, { resetForm }) => {
    values.country = state.countrySelected;
    values.countryCode = state.countryDetails.phonecode;
    values.state = state.stateSelected;

    try {
      await axios.post(
        "https://user-registry-backend.onrender.com/users/create",
        values
      );
      alert("User Created");
      resetForm();
      fetchData();
      state.countrySelected = "";
      state.stateSelected = "";
      setState((prevState) => ({
        ...prevState,
        countrySelected: "",
        stateSelected: "",
        countryIsoSelected: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (user) => {
    setState((prevState) => ({
      ...prevState,
      editingUser: user,
    }));
  };
  const onDelete = async (user) => {
    try {
      await axios.delete(
        `https://user-registry-backend.onrender.com/users/${user._id}`
      );
      alert("User Deleted");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h2 className="text-xl mb-4 text-center font-bold">Create User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="mx-auto max-w-xl p-4 border rounded">
          <InputField label="First Name" name="firstName" />
          <InputField label="Last Name" name="lastName" />
          <InputField label="Email" name="email" type="email" />
          <InputField label="Address 1" name="address1" />
          <InputField label="Address 2" name="address2" optional="Optional" />

          <StateList state={state} setState={setState} />

          <CountryList state={state} setState={setState} />

          <InputField label="Zip Code" name="zipCode" />
          <div>
            <label>Mobile Number:</label>
            <Field
              name="countryCode"
              as="select"
              value={
                !state?.countryCode
                  ? state?.editingUser?.countryCode
                  : state?.countryCode
              }
            >
              <option value={`+${state.countryDetails.phonecode}`}>
                +{state.countryDetails.phonecode}
              </option>
            </Field>
            <InputField name="number" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </Form>
      </Formik>
      <div className="grid lg:grid-cols-2 gap-4 mt-8">
        {state.users.length > 0 ? (
          state.users.map((user) => (
            <UserCard user={user} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <h1>No Results Found</h1>
        )}
      </div>
      {state.editingUser && (
        <EditUserForm fetchData={fetchData} state={state} setState={setState} />
      )}
    </div>
  );
};

export default UserForm;
