import React from "react";

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div
      key={user._id}
      className="relative bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {user.firstName} {user.lastName}
      </h2>
      <div>
        <p>{user.address1}</p>
        {user?.address2 && <p>{user?.address2}</p>}
        <p>
          {user.city}, {user.state}, {user.country}
        </p>
        <p>{user.zipCode}</p>
      </div>
      <div className="text-left">
        <p>Email: {user.email}</p>
        <p>
          Mobile: +{user.countryCode} {user.number}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => onDelete(user)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
