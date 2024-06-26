import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AccountTooltip } from "../../Tooltips/Account";

export const NavbarLink = () => {
  const content = [
    { name: "Thong bao cua hang ne nha", link: "/thong-bao-cua-hang" },
    { name: "Thong bao don hang", link: "/thong-bao-don-hang ne nha" },
  ];

  const auth = useSelector((state: RootState) => state.auth);

  const { isAuthenticated, user } = auth;

  return (
    <div className="flex gap-2 items-center">
      <NotificationTooltip />
      {isAuthenticated ? (
        <AccountTooltip username={user!.username} />
      ) : (
        <div
          className="text-white outline-none
            text-xl font-medium p-1
            "
        >
          <a href="/login">Đăng nhập</a>
          <span className="mx-2">/</span>
          <a href="/register">Đăng ký</a>
        </div>
      )}
    </div>
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
