import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const LanguageContext = createContext();

// Dil değerini okumak için kullanılacak özel hook
export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  // Uygulama açıldığında eğer cookie'de language varsa onu al, yoksa "en" kullan
  const [language, setLanguage] = useState(Cookies.get("language") || "en");

  // language state'i her güncellendiğinde cookie'yi de güncelle
  useEffect(() => {
    Cookies.set("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
