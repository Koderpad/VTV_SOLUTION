// // import TextIcon from "../components/TextIcon";
// import { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
//
// function RegisForm_fix() {
//   const [isMaleChecked, setIsMaleChecked] = useState(false);
//   const navigate = useNavigate();
//
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//     gender: false,
//     fullName: "",
//     birthday: "",
//   });
//
//   const handleCheckboxChange = (isMale: boolean) => {
//     setIsMaleChecked(isMale);
//     setFormData((prevData) => ({ ...prevData, gender: isMale }));
//   };
//
//   const handleUsernameInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({ ...prevData, username: value }));
//   };
//
//   const handlePasswordInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({ ...prevData, password: value }));
//   };
//
//   const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({ ...prevData, email: value }));
//   };
//
//   const handleFullNameInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({ ...prevData, fullName: value }));
//   };
//
//   const handleBirthdayInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({ ...prevData, birthday: value }));
//   };
//
//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8181/api/auth/register",
//         formData
//       );
//
//       console.log("Response:", response.data);
//       // Display success toast
//       toast.success("Đăng ký thành công!");
//
//       //dừng 1 giấy để hiển thị toast
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//
//       navigate("/login", { replace: true });
//
//       // TODO: You may want to redirect or perform other actions on successful registration
//     } catch (error) {
//       console.error("Error:", error.response.data);
//       // Display error toast
//       toast.error("Đăng ký thất bại. Vui lòng thử lại!");
//
//       // TODO: You may want to handle other error scenarios here
//     }
//   };
//
//   return (
//     <>
//       <div className="flex w-full max-w-full items-start gap-2.5 max-md:ml-1">
//         <form className="space-y-3" action="#">
//           {/* tên tài khoản */}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/account_circle.png
//                 "
//               />
//             </div>
//             <div className="flex flex-col">
//               <input
//                 className="block w-full bg-transparent border-none focus:outline-none border-0 py-1.5  sm:leading-6"
//                 type="text"
//                 id="username"
//                 placeholder="Tên Tài Khoản"
//                 onChange={handleUsernameInputChange}
//               />
//             </div>
//           </div>
//           <div className="bg-neutral-400 w-[427px] h-px max-md:max-w-full" />
//           <br />
//           {/* mật khẩu */}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/pass.png
//                       "
//               />
//             </div>
//             <div className="flex flex-col">
//               <input
//                 className="block w-full bg-transparent border-none focus:outline-none border-0 py-1.5  sm:leading-6"
//                 type="password"
//                 id="password"
//                 placeholder="Mật khẩu"
//                 onChange={handlePasswordInputChange}
//               />
//             </div>
//           </div>
//           <div className="bg-neutral-400 w-[427px] h-px max-md:max-w-full" />
//           <br />
//           {/* email */}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/mail.png
//                       "
//               />
//             </div>
//             <div className="flex flex-col">
//               <input
//                 className="block w-full bg-transparent border-none focus:outline-none border-0 py-1.5 sm:leading-6"
//                 type="email"
//                 id="email"
//                 placeholder="Địa chỉ email"
//                 onChange={handleEmailInputChange}
//               />
//             </div>
//           </div>
//           <div className="bg-neutral-400 w-[427px] h-px max-md:max-w-full" />
//           <br />
//           {/* giới tính */}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/sex.png
//                       "
//               />
//             </div>
//             <span>Giới tính</span>
//             {/* checkbox select Nam or Nữ */}
//             <div className="flex flex-row gap-44 ml-4">
//               <div className="flex gap-6 ml-32">
//                 <label htmlFor="male">Nam</label>
//                 <input
//                   id="male"
//                   type="checkbox"
//                   name="gender"
//                   value="male"
//                   checked={isMaleChecked}
//                   onChange={() => handleCheckboxChange(true)}
//                 />
//               </div>
//               <div className="flex gap-6">
//                 {/* <br /> */}
//                 <label htmlFor="female">Nữ</label>
//                 <input
//                   id="female"
//                   type="checkbox"
//                   name="gender"
//                   value="female"
//                   checked={!isMaleChecked}
//                   onChange={() => handleCheckboxChange(false)}
//                 />
//               </div>
//
//               <br />
//             </div>
//           </div>
//           <br />
//           {/* họ và tên */}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/account_circle.png
//                       "
//               />
//             </div>
//             <div className="flex flex-col">
//               <input
//                 className="block w-full bg-transparent border-none focus:outline-none border-0 py-1.5 sm:leading-6"
//                 type="text"
//                 id="fullname"
//                 placeholder="Họ và tên"
//                 onChange={handleFullNameInputChange}
//               />
//             </div>
//           </div>
//           <div className="bg-neutral-400 w-[427px] h-px max-md:max-w-full" />
//           <br />
//           {/* ngày sinh*/}
//           <div className="flex gap-2">
//             <div className="flex">
//               <TextIcon
//                 srcSet="
//                 /public/birthday.png
//                       "
//               />
//             </div>
//             <span className="mt-5 mr-3">Ngày sinh: </span>
//             <div className="flex flex-col mt-3">
//               <input
//                 className="block w-full bg-transparent border-none focus:outline-none border-0 py-1.5  sm:leading-6"
//                 type="date"
//                 id="date"
//                 placeholder="Ngày sinh"
//                 onChange={handleBirthdayInputChange}
//               />
//             </div>
//           </div>
//           <div className="bg-neutral-400 w-[427px] h-px max-md:max-w-full" />
//           <br />
//
//           {/* button submit */}
//           <div className="flex flex-row gap-2 w-full">
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="border w-[40rem] h-[3rem] shadow-[2px_4px_6px_0px_rgba(79,79,79,0.15)] bg-sky-500 bg-opacity-80 flex min-h-[34px] flex-col rounded-2xl border-solid border-stone-300"
//             >
//               <div className="text-white font-extrabold text-xl mt-2 self-center">
//                 Đăng Ký
//               </div>
//             </button>
//             {/* <div className="w-0.5/4"></div> */}
//           </div>
//         </form>
//         <ToastContainer position="bottom-right" />
//       </div>
//     </>
//   );
// }
//
// export default RegisForm_fix;
