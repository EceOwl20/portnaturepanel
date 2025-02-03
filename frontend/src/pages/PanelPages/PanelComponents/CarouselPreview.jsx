import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const CarouselPreview = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden w-full">
      {/* Carousel Container */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_100%] p-2"
            >
              <img
                src={image.firebaseUrl}
                alt={image.altText || `Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
      >
        &larr;
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
      >
        &rarr;
      </button>
    </div>
  );
};

export default CarouselPreview;
