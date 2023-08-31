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
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    countryCode: "+91",
    address1: "",
    address2: "",
    state: "",
    country: "",
    zipCode: "",
  };

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:8080/users");

    setUsers(data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const onEdit = async (user) => {
    console.log(user);
    setEditingUser(user);
  };
  const onDelete = async (user) => {
    try {
      await axios.delete(`http://localhost:8080/users/${user._id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(users);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Form values:", values);
      await axios.post("http://localhost:8080/users/create", values);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.log(error);
    }

    // Perform submit action, e.g., sending data to the server
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
          {/* <InputField label="Number" name="number" /> */}
          <InputField label="Address 1" name="address1" />
          <InputField label="Address 2" name="address2" optional="Optional" />
          <InputField label="State" name="state" />
          <InputField label="Country" name="country" />
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
          fetchUsers={fetchUsers}
          setEditingUser={setEditingUser}
        />
      )}
    </div>
  );
};

export default UserForm;
