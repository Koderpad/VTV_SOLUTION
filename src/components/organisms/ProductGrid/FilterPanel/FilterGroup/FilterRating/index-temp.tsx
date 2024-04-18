import { Rating } from "@/components/molecules/Rating";
import { FilterGroup } from "..";

export const FilterRating = () => {
  const ui = (
    <ul className="flex flex-col gap-3 px-2.5 pb-2.5">
      {[3, 4, 4.5].map((rating) => (
        <li key={rating} className="flex items-center gap-3">
          <input
            id={String(rating)}
            name={String(rating)}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-violet-700 focus:ring-violet-700"
          />
          <label htmlFor={String(rating)} className="flex items-center gap-3">
            <Rating rating={rating} />
            <span className="text-sm font-medium">{rating}+</span>
          </label>
        </li>
      ))}
    </ul>
  );

  return <FilterGroup name="PRODUCT RATE">{ui}</FilterGroup>;
};

// import { Rating } from "@/components/molecules/Rating";

// export const FilterRating = () => {
//   return (
//     <div className="rounded-lg bg-neutral-100">
//       <button className="flex w-full items-center justify-between px-2.5 py-2.5 text-sm font-semibold text-neutral-600">
//         <span>PRODUCT RATE</span>
//         <svg
//           stroke="currentColor"
//           fill="none"
//           stroke-width="2"
//           viewBox="0 0 24 24"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="transition duration-200"
//           height="1rem"
//           width="1rem"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <polyline points="6 9 12 15 18 9"></polyline>
//         </svg>
//       </button>

//       <div
//         className="overflow-hidden duration-200 ease-in-out h-auto"
//         aria-hidden="true"
//       >
//         <div className="transition-opacity duration-200 ease-in-out opacity-0 hidden">
//           <ul className="flex flex-col gap-3 px-2.5 pb-2.5">
//             {[3, 4, 4.5].map((rating) => (
//               <li key={rating} className="flex items-center gap-3">
//                 <input
//                   id={String(rating)}
//                   name={String(rating)}
//                   type="checkbox"
//                   className="h-4 w-4 rounded border-gray-300 text-violet-700 focus:ring-violet-700"
//                 />
//                 <label
//                   htmlFor={String(rating)}
//                   className="flex items-center gap-3"
//                 >
//                   <Rating rating={rating} />
//                   <span className="text-sm font-medium">{rating}+</span>
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };
