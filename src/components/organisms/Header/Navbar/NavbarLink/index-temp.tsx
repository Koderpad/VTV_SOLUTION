import { useState, useEffect } from "react";
import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
import { A } from "@/components/atoms/Link/A";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AccountTooltip } from "../../Tooltips/Account";

interface CustomerDTO {
  customerId: number;
  username: string;
  email: string;
  gender: boolean;
  fullName: string;
  birthday: string; // You may want to use a Date type
  status: string; // You may want to define a more specific type for status
  roles: string[];
}

export const NavbarLink = () => {
  const content = [
    { name: "Thong bao cua hang", link: "/thong-bao-cua-hang" },
    { name: "Thong bao don hang", link: "/thong-bao-don-hang" },
  ];

  const auth = useSelector((state: RootState) => state.auth);

  const { isAuthenticated, user } = auth;

  return (
    <ul className="flex gap-2 items-center">
      <li className="">
        <NotificationTooltip content={content} />
      </li>
      {isAuthenticated ? (
        <AccountTooltip username={user!.username} />
      ) : (
        <div
          className="text-white outline-none
            text-xl font-medium p-1
            "
        >
          <a href="/common/Login">Đăng nhập</a>
          <span className="mx-2">/</span>
          <a href="/common/Register">Đăng ký</a>
        </div>
      )}
    </ul>
  );
};

// import { useState, useEffect } from "react";
// import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
// import { A } from "@/components/atoms/Link/A";

// export const NavbarLink = () => {
//   const content = [
//     {
//       name: "Thong bao cua hang",
//       link: "/thong-bao-cua-hang",
//     },
//     {
//       name: "Thong bao don hang",
//       link: "/thong-bao-don-hang",
//     },
//   ];
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // const loggedInUser = localStorage.getItem("persist:root");
//     // if (loggedInUser) {
//     //   const parsedLoggedInUser = JSON.parse(loggedInUser);
//     // }
//     // if (loggedInUser && loggedInUser.user) {
//     //   setIsLoggedIn(true);
//     //   const username = loggedInUser.user.username;
//     // }
//     // if (loggedInUser) {
//     //   setIsLoggedIn(true);
//     // }
//     if (loggedInUser && loggedInUser.user) {
//       setIsLoggedIn(true);
//       setUsername(loggedInUser.user.username);
//     }
//   }, []);

//   return (
//     <ul className="flex gap-2 items-center">
//       <li className="">
//         <NotificationTooltip content={content} />
//       </li>
//       {!isLoggedIn && (
//         <>
//           <li>
//             <A href="/login" className=" rounded hover:bg-gray-200">
//               Đăng nhập
//             </A>
//           </li>
//           <li>
//             <A href="/register" className=" rounded hover:bg-gray-200">
//               Đăng ký
//             </A>
//           </li>
//         </>
//       )}
//     </ul>
//   );
// };
