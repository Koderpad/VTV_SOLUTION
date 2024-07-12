import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

export const Account = () => {
  const state = useSelector((state: RootState) => state.auth.user);
  const fullName = state ? state["fullName"] : null;
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(`/user/account/${path}`);
  };

  return (
    <>
      <div className="flex justify-self-center w-full pt-[20px] pb-[50px] mb-14 h-full">
        <div className="flex flex-col h-full">
          <div className="mt-11">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Quản lý tài khoản
              </h1>
              <ul className="pl-4">
                <li>
                  <Link
                    to="profile"
                    className={`hover:text-green-600 ${
                      isActive("profile") ? "text-green-600 font-bold" : ""
                    }`}
                  >
                    Thông tin cá nhân
                  </Link>
                </li>
                <li>
                  <Link
                    to="pw_changes"
                    className={`hover:text-green-600 ${
                      isActive("pw_changes") ? "text-green-600 font-bold" : ""
                    }`}
                  >
                    Thay đổi mật khẩu
                  </Link>
                </li>
                <li>
                  <Link
                    to="address"
                    className={`hover:text-green-600 ${
                      isActive("address") ? "text-green-600 font-bold" : ""
                    }`}
                  >
                    Địa chỉ
                  </Link>
                </li>
                <li>
                  <Link
                    to="favorite-products"
                    className={`hover:text-green-600 ${
                      isActive("favorite-products")
                        ? "text-green-600 font-bold"
                        : ""
                    }`}
                  >
                    Sản phẩm yêu thích
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="voucher-wallet"
                    className={`hover:text-green-600 ${
                      isActive("voucher-wallet")
                        ? "text-green-600 font-bold"
                        : ""
                    }`}
                  >
                    Kho voucher
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="history-purchase"
                    className={`hover:text-green-600 ${
                      isActive("history-purchase")
                        ? "text-green-600 font-bold"
                        : ""
                    }`}
                  >
                    Đơn mua
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="self-end">Xin chào, {fullName}</div>
          <div className="h-full w-full mt-11 pl-16 ">
            <div className="max-h-[1500px] shadow-xl shadow-indigo-500/40">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { Link, Outlet } from "react-router-dom";
// export const Account = () => {
//   const state = useSelector((state: RootState) => state.auth.user);
//   // const username = state ? state["username"] : null;
//   const fullName = state ? state["fullName"] : null;
//   return (
//     <>
//       {/* flex div wrapper */}
//       <div className="flex justify-self-center w-full pt-[20px] pb-[50px] mb-14 h-full">
//         {/* left nav side */}
//         <div className="flex flex-col h-full">
//           {/* <Breadcrumb /> */}

//           {/* navbar */}
//           <div className="mt-11">
//             <div>
//               {/* name of list */}
//               <h1 className="text-2xl font-bold text-gray-800 mb-1">
//                 Quản lý tài khoản
//               </h1>
//               <ul className="pl-4 ">
//                 <li>
//                   <Link to="profile" className=" hover:text-green-600 ">
//                     Thông tin cá nhân
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="pw_changes" className=" hover:text-green-600 ">
//                     Thay đổi mật khẩu
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="address" className=" hover:text-green-600 ">
//                     Địa chỉ
//                   </Link>
//                 </li>
//                 {/* space */}
//                 <li>
//                   <Link
//                     to="favorite-products"
//                     className=" hover:text-green-600 "
//                   >
//                     Sản phẩm yêu thích
//                   </Link>
//                 </li>

//                 <li>
//                   <Link to="voucher-wallet" className=" hover:text-green-600 ">
//                     Kho voucher
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="history-purchase"
//                     className=" hover:text-green-600 "
//                   >
//                     Đơn mua
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* right content side */}
//         <div className="flex flex-col w-full h-full">
//           {/* <div className="flex flex-col w-[1020px] h-[568px]"> */}
//           {/* welcome */}
//           <div className="self-end">Xin chào, {fullName}</div>

//           {/* content */}
//           <div className="h-full w-full mt-11 pl-16 ">
//             {/* <div className="h-full shadow-xl shadow-indigo-500/40 overflow-y-auto">
//               <Outlet />
//             </div> */}
//             <div className="max-h-[1500px] shadow-xl shadow-indigo-500/40">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
