// controllers/componentsController.js
import Component from "../models/components.js";

// Belirli bir sayfadaki tüm bileşenleri getir
export const getComponentsByPage = async (req, res) => {
  const { page } = req.params;

  try {
    const components = await Component.find({ page });
    res.status(200).json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ message: "Failed to fetch components" });
  }
};

// Bir bileşeni güncelle
export const updateComponent = async (req, res) => {
  const { id } = req.params;
  const { props } = req.body;

  try {
    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      { props },
      { new: true, runValidators: true }
    );

    if (!updatedComponent) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error("Error updating component:", error);
    res.status(500).json({ message: "Failed to update component" });
  }
};
