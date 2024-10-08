'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";


export default function Slider({movieData, title}) {

//   const [movieData, setmovieData] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gapSize, setGapSize] = useState(0);
  const [slides, setSlides] = useState(0);
  const [visibleCards, setVisibleCards] = useState(0);
  const sliderRef = useRef(null);
  let scrollTimeout = useRef(null);



  useEffect(() => {
    // Calculate gap size after movies are loaded
    if (sliderRef.current && sliderRef.current.children.length > 1) {
      const firstChildRect = sliderRef.current.children[0].getBoundingClientRect();
      const secondChildRect = sliderRef.current.children[1].getBoundingClientRect();
      const calculatedGapSize = secondChildRect.left - firstChildRect.right;
      setGapSize(calculatedGapSize);

      const slides= Math.round(((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width);

      const visCards= Math.round(sliderRef.current.getBoundingClientRect().width / sliderRef.current.children[0].getBoundingClientRect().width);
      setVisibleCards(visCards);
      
      const slideControl = ((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width) - slides <= sliderRef.current.children[0].getBoundingClientRect().width / sliderRef.current.getBoundingClientRect().width);

      if (slideControl){
      setSlides(slides);} else {setSlides(slides+1);}

      // console.log("slides" + slides)
      // console.log((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width))
      // console.log(sliderRef.current.children[0].getBoundingClientRect().width / sliderRef.current.getBoundingClientRect().width)
      // console.log((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width) - slides)

    }
  }, [movieData]); 

  const slideTo = (index) => {

   if (sliderRef.current) {
      const targetIndex = index < 0
        ? movieData.length - 1 // Go to last slide
        : index >= movieData.length
        ? 0 // Go to first slide
        : index;

      sliderRef.current.scrollTo({
        left: sliderRef.current.getBoundingClientRect().width * targetIndex,
        behavior: 'smooth'
      });
      setCurrentSlide(targetIndex);
    }
  };


  const handleScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!sliderRef.current) return;

      const scrollLeft = sliderRef.current.scrollLeft;
      const sliderWidth = sliderRef.current.getBoundingClientRect().width;
      const newSlideIndex = Math.round(scrollLeft / sliderWidth);

      // **CORRECTED LOGIC (Removed duplicate check)**
      if (newSlideIndex >= slides) { 
        sliderRef.current.scrollTo({
          left: 0,
          behavior: 'auto'
        });
        setCurrentSlide(0);
      } else if (newSlideIndex < 0) {
        sliderRef.current.scrollTo({
          left: sliderWidth * (movieData.length - 1),
          behavior: 'auto'
        });
        setCurrentSlide(movieData.length - 1);
      } else {
        setCurrentSlide(newSlideIndex);
      }
    }, 100);
  };


  return (
      <div className="w-full flex flex-col ">
        {/* <h1 className="text-white font-light text-xl md:text-2xl ml-6 md:ml-14 flex items-center gap-1">{title} <span className="text-white font-semibold p-1 text-sm mx-1 bg-[#CC1175] rounded rounded-full">{movieData.length}</span></h1> */}
      <div className="Slider flex flex-row w-full items-center justify-center h-[50svh]">
      <button  onClick={() => slideTo(currentSlide - 1)} className={`text-white px-1 md:px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
      <FaAngleDoubleLeft className="md:size-6"></FaAngleDoubleLeft></button>
        <div
          className="flex flex-row flex-nowrap grow overflow-x-scroll scroll-smooth snap-x snap-mandatory h-full"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {movieData.map((movie, index) => (
            <div
              className={`relative flex flex-col items-center justify-end text-center overflow-hidden min-w-[100%] h-full z-[1] ${
                index % visibleCards === 0 ? 'snap-start' : ''
              }`}
              key={movie.id}
            
            >
            <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover absolute top-0 left-0 z-[-10] transition-transform duration-500" />
             <div className="w-full flex flex-row items-center justify-center p-2 bg-black bg-opacity-40 pointer-events-none">{movie.title}</div>
            </div>
          ))}
        </div>
        <button  onClick={() => slideTo(currentSlide + 1)} className={`text-white px-1 md:px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
        <FaAngleDoubleRight className="md:size-6"></FaAngleDoubleRight></button>
          
      </div>

      </div>
  );
}
