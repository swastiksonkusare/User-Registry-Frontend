import React from "react";
import { Field, ErrorMessage } from "formik";

const InputField = ({ label, name, type = "text" }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name}>{label}</label>
      <Field type={type} id={name} name={name} className="w-full p-2 border" />
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
};

export default InputField;
