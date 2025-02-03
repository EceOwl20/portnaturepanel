import React, { useEffect, useState } from "react";
import componentsMap from "./PanelComponents/componentsMap"; // Component haritası

const DynamicPage = ({ page }) => {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/page/${page}`);
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
  }, [page]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {components.map((component, index) => {
        const Component = componentsMap[component.type];
        return Component ? <Component key={index} {...component.props} /> : null;
      })}
    </div>
  );
};

export default DynamicPage;
