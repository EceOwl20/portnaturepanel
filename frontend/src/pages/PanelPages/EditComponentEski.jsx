import React, { useState, useEffect } from "react";

const EditComponent = ({ componentId }) => {
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetch(`/api/components/${componentId}`);
        const data = await response.json();
        setComponent(data);
      } catch (error) {
        setError("Failed to fetch component");
      }
    };

    fetchComponent();
  }, [componentId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ props: component.props }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!component) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Edit {component.type}</h3>
      {Object.keys(component.props).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input
            type="text"
            value={component.props[key]}
            onChange={(e) =>
              setComponent((prev) => ({
                ...prev,
                props: { ...prev.props, [key]: e.target.value },
              }))
            }
          />
        </div>
      ))}
      <button onClick={handleUpdate}>Save</button>
      {success && <p>Update successful!</p>}
    </div>
  );
};
export default EditComponent