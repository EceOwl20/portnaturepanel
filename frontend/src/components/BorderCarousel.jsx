import React, { useEffect, useCallback, useState } from "react";
import useCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const BorderCarousel = ({images}) => {
    const [emblaRef, emblaApi] = useCarousel({
        loop: true,
        align:"start",
        startIndex:0,
      }, [
        Autoplay({ delay: 2000 }),
      ]
    );
    
      const [curr, setCurr] = useState(0);
    
      const scrollPrev = useCallback(() => {
        if (emblaApi && emblaApi.scrollPrev) emblaApi.scrollPrev();
        setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
        //setCurr(newIndex);
      }, [emblaApi, curr, images.length]);
    
      const scrollNext = useCallback(() => {
        if (emblaApi && emblaApi.scrollNext) emblaApi.scrollNext();
        setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));
        //setCurr(newIndex);
      }, [emblaApi, curr, images.length]);
    
      const handleJump = useCallback(
        (index) => {
          if (emblaApi && emblaApi.scrollTo) emblaApi.scrollTo(index);
          setCurr(index);
        },
        [emblaApi]
      );
    
      const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurr(emblaApi.selectedScrollSnap());
      }, [emblaApi]);
    
      useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        return () => emblaApi.off("select", onSelect);
      }, [emblaApi, onSelect]);
      
  return (
    <div className="flex flex-col lg:w-11/12 xl:w-full h-auto items-end justify-end my-40">
    <div className="overflow-hidden relative xl:h-[698px] w-[90%] lg:w-[75%]" ref={emblaRef}>
        <div className="flex grid-flow-col">
          {images.map((image, index) => (
            <div className="flex-[0_0_auto] mx-1 sm:w-[calc(50%-1rem)] lg:mx-4 xl:mx-2 lg:w-[calc(33.3%-1rem)] xl:w-[calc(33.3%-0.5rem)]  w-11/12 flex justify-center relative group" key={index}>
              <div className="flex flex-col relative z-10 xl:max-w-[553px]">
              <img
                className="cursor-pointer overflow-hidden object-cover relative"
                height={589}
                width={348}
                layout="responsive"
                src={image.firebaseUrl}
                alt={`Slide ${index + 1}`}
              />
              <div className="flex w-full items-end justify-end">
                <div className="flex text-start justify-start items-center pt-[3%] w-[80%]">
                    <p className="text-[12px] text-black font-monserrat font-normal leading-[18px] w-[88%]">{image.text}</p>
                </div>
              </div>
              </div>

              <div className="absolute flex flex-col top-4 text-start items-center justify-center ">
                <span className="text-[18px] font-lora lg:text-[25px] leading-normal text-white uppercase font-medium ">{image.header}</span>
              </div>
              <div className="absolute top-[8%] left-[18%] border border-[#CFCFCF] h-[55vh] w-[70%] z-1">

              </div>
              
            
            </div>
          ))}
        </div>
        
    </div>
  </div>
  )
}

export default BorderCarousel
