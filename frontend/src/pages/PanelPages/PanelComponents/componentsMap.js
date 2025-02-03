// src/componentsMap.js
import CarouselComponent from "../../../components/homepage/HomeCarousel";
import HeaderSection from "../../../components/header/Header";
import FooterComponent from "../../../components/header/Footer";
// Diğer bileşenlerinizi burada içe aktarın

const componentsMap = {
  Carousel: CarouselComponent,
  HeaderSection: HeaderSection,
  Footer: FooterComponent,
  // Yeni bileşenler eklenebilir
};

export default componentsMap;
