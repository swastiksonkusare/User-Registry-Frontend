import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "./InputField";

import axios from "axios";
import UserCard from "./UserCard";
import EditUserForm from "./EditUserForm";

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

const UserForm = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countrySelected, setCountrySelected] = useState("");
  const [countryIsoSelected, setCountryIsoSelected] = useState("");

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    countryCode: "+91",
    address1: "",
    address2: "",
    state: "",
    country: countrySelected,
    zipCode: "",
  };

  const config = {
    headers: {
      "X-CSCAPI-KEY":
        "dTZiOGNGQ1lqWXpncnNYV1J0NjRYbXR4R000Umx3TDhKVTR6ZHNJQQ==",
    },
  };

  const fetchData = async () => {
    try {
      const countriesResponse = axios.get(
        "https://api.countrystatecity.in/v1/countries",
        config
      );

      const usersResponse = axios.get("http://localhost:8080/users");

      // Execute both requests in parallel
      const [countriesData, usersData] = await axios.all([
        countriesResponse,
        usersResponse,
      ]);

      setCountries(countriesData.data);
      setUsers(usersData.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStatesByCountry(countryIsoSelected);
  }, [countrySelected, countryIsoSelected]);

  const onEdit = async (user) => {
    setEditingUser(user);
  };
  const onDelete = async (user) => {
    try {
      await axios.delete(`http://localhost:8080/users/${user._id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log(countrySelected);

    values.country = countrySelected;
    try {
      console.log("Form values:", values);
      await axios.post("http://localhost:8080/users/create", values);
      resetForm();
      fetchData();
    } catch (error) {
      console.log(error);
    }

    // Perform submit action, e.g., sending data to the server
  };

  // console.log(countries);

  const fetchStatesByCountry = async (countryIsoSelected) => {
    try {
      const { data } = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryIsoSelected}/states`,
        config
      );

      setStates(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h2 className="text-xl mb-4 text-center">Create User</h2>
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

          <div className="mb-5">
            <label>States:</label>
            <Field name="state" as="select">
              {states.length > 0 &&
                states.map((s) => (
                  <option
                    key={s.id}
                    value={s.name}
                    data-iso2={s.iso2} // Add the iso2 code as a custom data attribute
                  >
                    {s.name}
                  </option>
                ))}
            </Field>
          </div>

          <div className="mb-5">
            <label>Country:</label>
            <Field
              name="country"
              as="select"
              onChange={(e) => {
                setCountrySelected(e.target.value);
                setCountryIsoSelected(
                  e.target.options[e.target.selectedIndex].getAttribute(
                    "data-iso"
                  )
                );
              }}
              value={countrySelected}
            >
              {countries.length > 0 &&
                countries.map((c) => (
                  <option key={c.id} value={c.name} data-iso={c.iso2}>
                    {c.name}
                  </option>
                ))}
            </Field>
          </div>
          <InputField label="Zip Code" name="zipCode" />
          <div>
            <label>Mobile Number:</label>
            <Field name="countryCode" as="select">
              <option value="+1">+1</option>
              <option value="+91">+91</option>
              <option value="+44">+44</option>
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
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard user={user} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <h1>No Results Found</h1>
        )}
      </div>
      {editingUser && (
        <EditUserForm
          user={editingUser}
          fetchData={fetchData}
          setEditingUser={setEditingUser}
          countries={countries}
        />
      )}
    </div>
  );
};

export default UserForm;
