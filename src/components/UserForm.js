import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "./InputField";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
  lastName: Yup.string().required("Required").min(5, "Minimum 5 characters"),
  email: Yup.string().email("Invalid email format").required("Required"),
  address1: Yup.string().required("Required"),
  zipCode: Yup.number().required("Required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Enter a valid mobile number")
    .required("Mobile number is required"),
});

const UserForm = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    state: "",
    country: "",
    zipCode: "",
    countryCode: "+91",
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    // Perform submit action, e.g., sending data to the server
  };

  console.log(initialValues.firstName);

  return (
    <div className="mx-auto max-w-md p-4 border rounded m-4">
      <h2 className="text-xl mb-4">Create User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <InputField label="First Name" name="firstName" />
          <InputField label="Last Name" name="lastName" />
          <InputField label="Email" name="email" type="email" />
          <InputField label="Mobile" name="mobile" />
          <InputField label="Address 1" name="address1" />
          <InputField label="Address 2" name="address2" />
          <InputField label="State" name="state" />
          <InputField label="Country" name="country" />
          <InputField label="Zip Code" name="zipCode" type="number" />
          <div>
            <label>Mobile Number:</label>
            <Field name="countryCode" as="select">
              <option value="+1">+1</option>
              <option value="+91">+91</option>
              <option value="+44">+44</option>
            </Field>
            <InputField type="text" name="mobile" />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default UserForm;
