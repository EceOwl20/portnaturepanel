import React, { useState, useEffect } from "react";

const EditPage = ({ pageName }) => {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages/${pageName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch page data");
        }
        const data = await response.json();
        setComponents(data.components);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPageData();
  }, [pageName]);

  const handleComponentChange = (index, updatedProps) => {
    const updatedComponents = [...components];
    updatedComponents[index].props = updatedProps;
    setComponents(updatedComponents);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/pages/${pageName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ components }),
      });

      if (!response.ok) {
        throw new Error("Failed to update page");
      }

      alert("Page updated successfully!");
    } catch (err) {
      alert("Error updating page: " + err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2>Edit Page: {pageName}</h2>
      {components.map((component, index) => (
        <div key={index} className="flex flex-col gap-2">
          <h3>{component.type}</h3>
          <textarea
            value={JSON.stringify(component.props, null, 2)}
            onChange={(e) =>
              handleComponentChange(index, JSON.parse(e.target.value))
            }
            className="w-full h-32 p-2 border"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditPage;
