import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
  const banners = [
    { id: 1, imageUrl: "/banner_1.jpeg", alt: "Banner 1" },
    { id: 2, imageUrl: "/banner_2.jpeg", alt: "Banner 2" },

    // Add more banners as needed
  ];

  const verticalBanner = {
    imageUrl: "/banner_1_doc.jpeg",
    alt: "Vertical Banner",
  };

  return (
    <div className="banner-container flex w-full">
      <div className="main-banner flex-grow">
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          interval={5000}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              <img
                src={banner.imageUrl}
                alt={banner.alt}
                className="w-full h-auto object-fill"
                style={{ maxHeight: "400px" }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="vertical-banner ml-4 w-1/3">
        <img
          src={verticalBanner.imageUrl}
          alt={verticalBanner.alt}
          className="w-full h-full object-fill"
          style={{ maxHeight: "400px" }}
        />
      </div>
    </div>
  );
};

export default Banner;

// import React from "react";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// const Banner = () => {
//   const banners = [
//     { id: 1, imageUrl: "/banner_1.jpeg", alt: "Banner 1" },
//     { id: 2, imageUrl: "/banner_2.jpeg", alt: "Banner 2" },
//     // { id: 3, imageUrl: "/api/placeholder/1200/400", alt: "Banner 3" },
//   ];

//   return (
//     <div className="banner-container flex w-full max-w-screen-xl">
//       <Carousel
//         autoPlay
//         infiniteLoop
//         showStatus={false}
//         showThumbs={false}
//         interval={5000}
//       >
//         {banners.map((banner) => (
//           <div key={banner.id} className="banner-slide">
//             <img
//               src={banner.imageUrl}
//               alt={banner.alt}
//               className="w-full h-auto object-fill"
//               style={{ maxHeight: "400px" }} // Adjust this value as needed
//             />
//           </div>
//         ))}
//       </Carousel>
//     </div>
//   );
// };

// export default Banner;
