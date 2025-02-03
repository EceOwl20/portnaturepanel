import React, { useState } from "react";

const EditImageName = ({ currentName }) => {
  const [newName, setNewName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/images/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldName: currentName, newName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update image name");
      }

      setSuccess(true);
      alert("Image name updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Current Name: <strong>{currentName}</strong>
        </label>
        <br />
        <input
          type="text"
          placeholder="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit">Update Name</button>
      </form>
      {success && <p>Success: Image name updated!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default EditImageName;
