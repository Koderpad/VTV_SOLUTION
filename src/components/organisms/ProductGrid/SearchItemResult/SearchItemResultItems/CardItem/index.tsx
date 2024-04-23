import { useState } from "react";
import { Star } from "@/components/atoms/Icon/Star";

export const CardItem = ({ product }: { product: any }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // const images = [
  //   "https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7",
  //   "https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7",
  //   "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  //   "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  //   "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  // ];

  //   const thumbnails = [
  //     "https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7",
  //     "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  //     "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  //     "https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75",
  //   ];

  return (
    <div>
      <div className="group rounded-2xl bg-white p-2">
        <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
          <a href="" className="relative block h-full w-full">
            <img
              src={product.images[activeIndex]}
              alt={`${product.name} IMG${activeIndex + 1}`}
              className="absolute h-full w-full duration-700 opacity-100"
              decoding="async"
            />
          </a>
        </div>
        <div className="mb-1 mt-2 space-y-4 px-1">
          <div className="flex gap-2">
            {product.images.map((thumbnail: string, index: number) => (
              <button
                key={index}
                className="h-[40px] w-[40px] overflow-hidden rounded-full"
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={thumbnail}
                  alt={`${product.name} Thumbnail ${index + 1}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div>
            <h2 className="text-base font-medium"> {product.name}</h2>
            <h3 className="text-xs font-normal capitalize text-neutral-400">
              {product.shop}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-black">$30.00</h3>
            <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
              <Star typeStar="filled" />
              <h4>
                {product.rating}({product.reviews} reviews)
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import { Star } from "@/components/atoms/Icon/Star";

// export const CardItem = () => {
//   return (
//     <div>
//       <div className="group rounded-2xl bg-white p-2">
//         <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
//           <a href="" className="relative block h-full w-full">
//             <img
//               src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
//               alt="IMG1"
//               className="absolute h-full w-full duration-700  opacity-100"
//               decoding="async"
//             />
//             <img
//               src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
//               alt="IMG2"
//               decoding="async"
//               className="absolute h-full w-full duration-700  opacity-0"
//             />
//             <img
//               src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//               decoding="async"
//               alt="IMG3"
//               className="absolute h-full w-full duration-700  opacity-0"
//             />
//             <img
//               src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//               alt="IMG4"
//               decoding="async"
//               className="absolute h-full w-full duration-700  opacity-0"
//             />
//             <img
//               src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//               alt="IMG5"
//               decoding="async"
//               className="absolute h-full w-full duration-700  opacity-0"
//             />
//           </a>
//         </div>
//         <div className="mb-1 mt-2 space-y-4 px-1">
//           <div className="flex gap-2">
//             <button className="h-[40px] w-[40px] overflow-hidden rounded-full">
//               <img
//                 src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
//                 alt=""
//                 width={40}
//                 height={40}
//                 className="object-cover"
//               />
//             </button>
//             <button className="h-[40px] w-[40px] overflow-hidden rounded-full">
//               <img
//                 src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//                 alt=""
//                 width={40}
//                 height={40}
//                 className="object-cover"
//               />
//             </button>
//             <button className="h-[40px] w-[40px] overflow-hidden rounded-full">
//               <img
//                 src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//                 alt=""
//                 width={40}
//                 height={40}
//                 className="object-cover"
//               />
//             </button>
//             <button className="h-[40px] w-[40px] overflow-hidden rounded-full">
//               <img
//                 src="https://karashop.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fproduct-1.jpg&w=384&q=75"
//                 alt=""
//                 width={40}
//                 height={40}
//                 className="object-cover"
//               />
//             </button>
//           </div>
//           <div>
//             <h2 className="text-base font-medium"> Ten san pham</h2>
//             <h3 className="text-xs font-normal capitalize text-neutral-400">
//               Ten shop
//             </h3>
//           </div>
//           <div className="flex items-center justify-between gap-4">
//             <h3 className="text-lg font-semibold text-black">$30.00</h3>
//             <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
//               <Star typeStar="filled" />
//               <h4>4.2(100 reviews)</h4>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
