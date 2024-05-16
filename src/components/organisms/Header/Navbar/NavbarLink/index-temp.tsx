import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
import { AccountTooltip } from "../../Tooltips/Account";
import { onMessageListener, requestForToken } from "@/config/fcmConfig";

export const NavbarLink = () => {
  const content = [
    { name: "Thong bao cua hang", link: "/thong-bao-cua-hang" },
    { name: "Thong bao don hang11111111111111", link: "/thong-bao-don-hang" },
  ];

  const [notification, setNotification] = useState("");
  function ToastDisplay() {
    return (
      <div>
      </div>
    );
  };

  useEffect(() => {
    if (notification) {
      ToastDisplay();
    }
  }, [notification])

  requestForToken();

  onMessageListener()
    .then(() => {
      setNotification("New message received.");
    })
    .catch((err) => console.log('failed: ', err));

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
        <div className="text-white outline-none text-xl font-medium p-1">
          <a href="/common/Login">Đăng nhập</a>
          <span className="mx-2">/</span>
          <a href="/common/Register">Đăng ký</a>
        </div>
      )}
    </ul>
  );
};


// import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { AccountTooltip } from "../../Tooltips/Account";
//
//
//
// export const NavbarLink = () => {
//   const content = [
//     { name: "Thong bao cua hang", link: "/thong-bao-cua-hang" },
//     { name: "Thong bao don hang", link: "/thong-bao-don-hang" },
//   ];
//
//   const auth = useSelector((state: RootState) => state.auth);
//
//   const { isAuthenticated, user } = auth;
//
//   return (
//     <ul className="flex gap-2 items-center">
//       <li className="">
//         <NotificationTooltip content={content} />
//       </li>
//       {isAuthenticated ? (
//         <AccountTooltip username={user!.username} />
//       ) : (
//         <div
//           className="text-white outline-none
//             text-xl font-medium p-1
//             "
//         >
//           <a href="/common/Login">Đăng nhập</a>
//           <span className="mx-2">/</span>
//           <a href="/common/Register">Đăng ký</a>
//         </div>
//       )}
//     </ul>
//   );
// };

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
