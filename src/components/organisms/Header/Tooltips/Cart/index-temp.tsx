import React from "react";
import { A } from "@/components/atoms/Link/A";
import CartIcon from "@/components/atoms/Icon/Cart";
import {
  ListCartByShopDTO,
  Cart,
} from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const CartTooltip = () => {
  const navigate = useNavigate();
  const carts: ListCartByShopDTO[] = useSelector(
    (state: RootState) => state.carts.carts
  );

  // Flatten and sort all cart items by updateAt
  const allCartItems = carts
    .flatMap((shop) => shop.carts)
    .sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="relative group">
      <div
        className="px-3 text-white text-left cursor-pointer flex items-center"
        onClick={() => navigate("/cart")}
      >
        {/* <span className="mr-2">Cart</span> */}
        <CartIcon className="h-10 w-10" />
      </div>

      <div className="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-xl invisible group-hover:visible transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100">
        <div className="arrow-up"></div>
        <div className="p-4">
          {allCartItems.length === 0 ? (
            <p className="text-gray-500">Giỏ trống, vui lòng thêm sản phẩm</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-3">Sản phẩm mới thêm</h3>

              <ul className="space-y-3">
                {allCartItems.map((item: Cart, index: number) => (
                  <li
                    key={index}
                    className="flex items-center p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-100"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">
                        {truncateText(item.productName, 20)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.productVariantDTO.price.toLocaleString()} VND
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={() => navigate("/cart")}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

// import { A } from "@/components/atoms/Link/A";
// import CartIcon from "@/components/atoms/Icon/Cart";
// import { ListCartByShopDTO } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// import { useNavigate } from "react-router-dom";

// export const CartTooltip = () => {
//   const navigate = useNavigate();
//   const carts: ListCartByShopDTO[] = useSelector(
//     (state: RootState) => state.carts.carts
//   );
//   console.log("carts: ", carts);

//   return (
//     <>
//       <div className="px-3 text-white text-left md:cursor-pointer group relative">
//         <h1
//           className="py-7 flex justify-between items-center md:pr-0 pr-5 group"
//           onClick={() => navigate("/cart")}
//         >
//           Cart!
//           <span className="text-xl md:mt-1 md:ml-2 md:block hidden">
//             <CartIcon />
//           </span>
//         </h1>
//         {/* Tooltip container */}
//         <div className="group-hover:scale-100 scale-0 absolute right-0 -translate-y-4  transition-transform origin-bottom transform-gpu">
//           {/* Arrow pointing up */}
//           <div className="w-4 h-4 absolute right-8 bg-white rotate-45 transform -translate-y-1/2"></div>
//           {/* Tooltip content */}
//           <div className="bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out w-screen max-w-md">
//             <div className="p-5 flex flex-col gap-4">
//               {carts.length === 0 ? (
//                 <div className="">
//                   <span className="text-blue-600">Giỏ hàng trống</span>
//                 </div>
//               ) : (
//                 carts.map((item, index) => (
//                   <div
//                     key={index}
//                     className="text-sm text-gray-600 hover:bg-gray-100 rounded-md p-2"
//                   >
//                     <A href="#" className="flex items-center gap-2">
//                       {index}
//                     </A>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
