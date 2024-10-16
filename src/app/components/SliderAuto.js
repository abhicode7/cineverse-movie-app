import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SliderAuto = ({ movieData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);
  const router = useRouter();

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (movieData.length + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let intervalId;
    if (!isHovered) {
      intervalId = setInterval(handleNextSlide, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isHovered, movieData.length]);

  

  const handleTransitionEnd = () => {
    if (currentIndex === movieData.length) {
      setIsTransitioning(false); // Disable transition
      setCurrentIndex(0); // Reset index to actual first slide
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true); // Re-enable transition after resetting
      }, 50); // Small delay to allow the DOM to update
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div
      className="relative w-full h-[40svh] md:h-[60svh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex w-full h-full" 
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
        }}
        ref={sliderRef}
        onTransitionEnd={handleTransitionEnd}
      >
        {movieData.map((movie, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              
            />
          </div>
        ))}
        <div className="w-full h-full flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movieData[0]?.backdrop_path}`}
            alt="Slide 1"
            className="w-full h-full object-cover"
            
          />
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        {movieData.map((_, index) => (
          <button
            key={index}
            className={`mx-1 w-2 h-2 transition duration-800 ${currentIndex === index ? 'bg-white' : 'bg-white opacity-20 rounded-full'}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>

      {/* overlay */}
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 flex flex-col items-center md:items-start md:justify-end text-center md:text-start justify-end px-8 py-16 md:py-36 md:gap-4 gap-2 cursor-pointer"
        onClick={() => router.push(`/movies/${movieData[currentIndex]?.id}`)}
      >
        <h1 className='text-4xl font-bold text-white pointer-events-none'>{
  currentIndex < movieData.length 
    ? movieData[currentIndex]?.title 
    : movieData[0]?.title
}</h1>
        <p className='text-white text-lg md:w-1/3 w-[80%] line-clamp-3 md:line-clamp-4 md:mb-8 mb-2 pointer-events-none'>{
  currentIndex < movieData.length 
    ? movieData[currentIndex]?.overview 
    : movieData[0]?.overview
}</p>

<button className='bg-pink-500 px-4 py-2 rounded-md flex flex-row justify-center items-center gap-2 text-white hover:bg-opacity-[70%] active:bg-opacity-[40%] transition-all duration-300 pointer-events-auto'> Read More</button>
      </div>
    </div>
  );
};

export default SliderAuto;
