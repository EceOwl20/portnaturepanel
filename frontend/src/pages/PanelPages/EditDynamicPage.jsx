import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditDynamicPage = () => {
  const { page } = useParams(); // URL'den sayfa adını al
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch(`/api/components/${page}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch components");
        }

        setComponents(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchComponents();
  }, [page]);

  const handleInputChange = (componentId, key, value) => {
    setComponents((prev) =>
      prev.map((component) =>
        component._id === componentId
          ? { ...component, props: { ...component.props, [key]: value } }
          : component
      )
    );
  };

  const handleSave = async (componentId) => {
    const componentToSave = components.find((c) => c._id === componentId);
    if (!componentToSave) return;

    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ props: componentToSave.props }),
      });

      if (!response.ok) {
        throw new Error("Failed to update component");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Edit {page} Components</h1>
      {success && <p className="text-green-500">Component updated!</p>}
      {components.map((component) => (
        <div key={component._id} className="mb-4">
          <h3>{component.type}</h3>
          {Object.keys(component.props).map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                value={component.props[key]}
                onChange={(e) =>
                  handleInputChange(component._id, key, e.target.value)
                }
                className="border py-1 px-2"
              />
            </div>
          ))}
          <button
            onClick={() => handleSave(component._id)}
            className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditDynamicPage;
