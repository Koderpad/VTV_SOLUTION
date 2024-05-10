// AddForm.tsx
import React, { useEffect, useRef, useState } from "react";
import AddressSelect from "./AddressSelect";
import { useAddAddressMutation } from "@/redux/features/common/customer/customerApiSlice";

interface AddFormProps {
  handleCloseForm: () => void;
  showForm: boolean;
}

const AddForm: React.FC<AddFormProps> = ({ handleCloseForm, showForm }) => {
  const [addAddress] = useAddAddressMutation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleCloseForm && handleCloseForm();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleCloseForm]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvinceValue] = useState<string>();
  const [district, setDistrictValue] = useState<string>();
  const [ward, setWardValue] = useState<string>();
  const [detail, setDetail] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async () => {
    try {
      const addressDTO: AddressDTO = {
        province,
        district,
        ward,
        fullAddress: detail,
        fullName: name,
        phone,
        status: "ACTIVE",
      };
      const response = await addAddress(addressDTO);

      console.log("response", response);

      toast.success("Thêm địa chỉ thành công!");
      handleCloseForm();
    } catch (error) {
      console.error(error);
      toast.error("Thêm địa chỉ thất bại. Vui lòng thử lại!");
    }
  };

  if (!showForm) return <></>;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500/25">
      <div
        className="px-4 py-8 min-w-[500px] bg-white shadow-xl rounded-xl"
        ref={ref}
      >
        <h1 className="text-2xl font-bold text-center mb-4">Địa chỉ mới</h1>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Họ và tên
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập họ và tên của bạn"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Số điện thoại
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            id="phone"
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nhập số điện thoại của bạn"
          />
        </div>
        <AddressSelect
          setProvince={setProvinceValue}
          setDistrict={setDistrictValue}
          setWard={setWardValue}
        />

        <div className="mb-4">
          <label
            htmlFor="detail"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Địa chỉ cụ thể
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            id="detail"
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Nhập địa chỉ cụ thể của bạn"
          ></textarea>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <input
              onChange={(e) => setType(e.target.value)}
              type="radio"
              id="home"
              name="type"
              value="home"
              className="text-indigo-500 focus:ring-indigo-500"
              checked
            />
            <label
              htmlFor="home"
              className="text-gray-700 text-sm font-medium ml-2"
            >
              Nhà riêng
            </label>
          </div>
          <div className="flex items-center ml-4">
            <input
              onChange={(e) => setType(e.target.value)}
              type="radio"
              id="office"
              name="type"
              value="office"
              className="text-indigo-500 focus:ring-indigo-500"
            />
            <label
              htmlFor="office"
              className="text-gray-700 text-sm font-medium ml-2"
            >
              Văn phòng
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-gray-300 focus:ring-offset-2 focus:ring-2"
            onClick={handleCloseForm}
          >
            Quay lại
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
          >
            Thêm địa chỉ mới
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AddForm;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { AddressProps } from "./AddressForm";
// import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { useAddAddressMutation } from "@/redux/features/customer/customerApiSlice";

// interface AddressDTO {
//   addressId?: number;
//   province: string;
//   district: string;
//   ward: string;
//   fullAddress: string;
//   fullName: string;
//   phone: string;
//   status: string;
// }

// const AddForm = (props: {
//   handleCloseForm: () => void;
//   showForm: boolean;
//   listAddress: AddressProps[];
//   setListAddress: (value: AddressProps[]) => void;
// }): React.ReactElement => {
//   const [addAddress, { data }] = useAddAddressMutation();

//   const ref = React.useRef<HTMLDivElement>(null);
//   const { handleCloseForm } = props;

//   React.useEffect(() => {
//     const handleClickOutside = (event: any) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         handleCloseForm && handleCloseForm();
//       }
//     };

//     document.addEventListener("click", handleClickOutside, true);

//     return () => {
//       document.removeEventListener("click", handleClickOutside, true);
//     };
//   }, [handleCloseForm]);

//   const [name, setName] = React.useState("");
//   const [phone, setPhone] = React.useState("");
//   const [province, setProvince] = React.useState<any>("");
//   const [district, setDistrict] = React.useState<any>("");
//   const [ward, setWard] = React.useState<any>("");
//   const [detail, setDetail] = React.useState("");
//   const [type, setType] = React.useState("");

//   const handleSubmit = async () => {
//     try {
//       const addressDTO: AddressDTO = {
//         province: province,
//         district: district,
//         ward: ward,
//         fullAddress: detail,
//         fullName: name,
//         phone: phone,
//         status: "ACTIVE",
//       };
//       const response = await addAddress(addressDTO);

//       console.log("response", response);

//       toast.success("Thêm địa chỉ thành công!");
//       handleCloseForm();
//     } catch (error) {
//       console.error(error);
//       toast.error("Thêm địa chỉ thất bại. Vui lòng thử lại!");
//     }
//   };

//   if (!props.showForm) return <></>;

//   return (
//     <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500/25">
//       <div
//         className="px-4 py-8 min-w-[500px] bg-white shadow-xl rounded-xl"
//         ref={ref}
//       >
//         <h1 className="text-2xl font-bold text-center mb-4">Địa chỉ mới</h1>
//         <div className="mb-4">
//           <label
//             htmlFor="name"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Họ và tên
//           </label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             type="text"
//             id="name"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Nhập họ và tên của bạn"
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="phone"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Số điện thoại
//           </label>
//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             type="tel"
//             id="phone"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Nhập số điện thoại của bạn"
//           />
//         </div>
//         <AddressSelect
//           setProvince={setProvince}
//           setDistrict={setDistrict}
//           setWard={setWard}
//         />
//         <div className="mb-4">
//           <label
//             htmlFor="detail"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Địa chỉ cụ thể
//           </label>
//           <textarea
//             value={detail}
//             onChange={(e) => setDetail(e.target.value)}
//             id="detail"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={3}
//             placeholder="Nhập địa chỉ cụ thể của bạn"
//           ></textarea>
//         </div>
//         <div className="flex items-center mb-4">
//           <div className="flex items-center">
//             <input
//               onChange={(e) => setType(e.target.value)}
//               type="radio"
//               id="home"
//               name="type"
//               value="home"
//               className="text-indigo-500 focus:ring-indigo-500"
//               checked
//             />
//             <label
//               htmlFor="home"
//               className="text-gray-700 text-sm font-medium ml-2"
//             >
//               Nhà riêng
//             </label>
//           </div>
//           <div className="flex items-center ml-4">
//             <input
//               onChange={(e) => setType(e.target.value)}
//               type="radio"
//               id="office"
//               name="type"
//               value="office"
//               className="text-indigo-500 focus:ring-indigo-500"
//             />
//             <label
//               htmlFor="office"
//               className="text-gray-700 text-sm font-medium ml-2"
//             >
//               Văn phòng
//             </label>
//           </div>
//         </div>
//         <div className="flex justify-between">
//           <button
//             type="button"
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-gray-300 focus:ring-offset-2 focus:ring-2"
//             onClick={props.handleCloseForm}
//           >
//             Quay lại
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
//           >
//             Thêm địa chỉ mới
//           </button>
//         </div>
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default AddForm;

// const AddressSelect = ({
//   setProvince,
//   setDistrict,
//   setWard,
// }: {
//   setProvince: (value: string) => void;
//   setDistrict: (value: string) => void;
//   setWard: (value: string) => void;
// }): React.ReactElement => {
//   const [open, setOpen] = React.useState(false);
//   const [showList, setShowList] = React.useState(0);
//   const [address, setAddress] = React.useState(
//     "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
//   );
//   const ref = React.useRef<HTMLDivElement>(null);
//   const [data, setData] = React.useState<any[]>([]);
//   const [province, setProvinceState] = React.useState<any>(null);
//   const [district, setDistrictState] = React.useState<any>(null);
//   const [ward, setWardState] = React.useState<any>(null);

//   React.useEffect(() => {
//     const getApi = async () => {
//       const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
//       setData(res.data);
//     };
//     getApi();
//   }, []);

//   React.useEffect(() => {
//     setAddress(
//       `${province ? province.name : "Tỉnh/ Thành phố"}, ${
//         district ? district.name : "Quận/Huyện"
//       }, ${ward ? ward.name : "Phường/Xã"}`
//     );
//     setProvince(province ? province.name : "Tỉnh/ Thành phố");
//     setDistrict(district ? district.name : "Quận/Huyện");
//     setWard(ward ? ward.name : "Phường/Xã");
//   }, [province, district, ward]);

//   React.useEffect(() => {
//     const handleClickOutside = (event: any) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setOpen && setOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside, true);

//     return () => {
//       document.removeEventListener("click", handleClickOutside, true);
//     };
//   }, [setOpen]);

//   const handleProvinceClick = (item: any) => {
//     setProvinceState(item);
//     setShowList(1);
//   };

//   const handleDistrictClick = (item: any) => {
//     setDistrictState(item);
//     setShowList(2);
//   };

//   const handleWardClick = (item: any) => {
//     setWardState(item);
//     setShowList(-1);
//   };

//   return (
//     <div className="mb-4">
//       <label
//         htmlFor="address"
//         className="block text-gray-700 text-sm font-medium mb-2"
//       >
//         Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã
//       </label>

//       <div className="relative">
//         <button
//           type="button"
//           className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full flex items-center justify-between"
//           id="dropdown-button"
//           aria-haspopup="true"
//           aria-expanded="true"
//           onClick={() => setOpen(!open)}
//         >
//           {address}
//           <svg
//             className="w-5 h-5 ml-2 -mr-1"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>

//         <div
//           ref={ref}
//           className={
//             "absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10" +
//             (open ? " block " : " hidden ")
//           }
//         >
//           <div className="grid grid-cols-3 gap-4 p-4">
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 0
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Tỉnh/ Thành phố
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 1
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Quận/ Huyện
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 2
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Phường/ Xã
//               </div>
//             </div>
//           </div>
//           <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//             <ul className="divide-y divide-gray-200 h-full overflow-auto">
//               {showList === 0 &&
//                 data.map((item) => (
//                   <li
//                     className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//                     key={item.code}
//                     onClick={() => handleProvinceClick(item)}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               {showList === 1 &&
//                 province?.districts?.map((item: any) => (
//                   <li
//                     className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//                     key={item.code}
//                     onClick={() => handleDistrictClick(item)}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               {showList === 2 &&
//                 district?.wards?.map((item: any) => (
//                   <li
//                     className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//                     key={item.code}
//                     onClick={() => handleWardClick(item)}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { AddressProps } from "./AddressForm";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { useAddAddressMutation } from "@/redux/features/customer/customerApiSlice";

// interface AddressDTO {
//   addressId?: number;
//   province: string;
//   district: string;
//   ward: string;
//   fullAddress: string;
//   fullName: string;
//   phone: string;
//   status: string; // You may want to define a more specific type for status
// }

// const AddForm = (props: {
//   handleCloseForm: () => void;
//   showForm: boolean;
//   listAddress: AddressProps[];
//   setListAddress: (value: AddressProps[]) => void;
// }): React.ReactElement => {
//   const [addAddress, { data }] = useAddAddressMutation();

//   const ref = React.useRef<HTMLDivElement>(null);
//   const { handleCloseForm } = props;

//   React.useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const handleClickOutside = (event: any) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         handleCloseForm && handleCloseForm();
//       }
//     };

//     document.addEventListener("click", handleClickOutside, true);

//     return () => {
//       document.removeEventListener("click", handleClickOutside, true);
//     };
//   }, [handleCloseForm]);

//   //
//   const [name, setName] = React.useState("");
//   const [phone, setPhone] = React.useState("");
//   const [province, setProvince] = React.useState<any>("");
//   const [district, setDistrict] = React.useState<any>("");
//   const [ward, setWard] = React.useState<any>("");
//   const [detail, setDetail] = React.useState("");
//   const [type, setType] = React.useState("");

//   // const handleSubmit = () => {
//   //   const handleAddAddress = async () => {
//   //     try {
//   //       const addressDTO: AddressDTO = {
//   //         province: province,
//   //         district: district,
//   //         ward: ward,
//   //         fullAddress: detail,
//   //         fullName: name,
//   //         phone: phone,
//   //         status: "ACTIVE",
//   //       };
//   //       const response = await addAddress(addressDTO);

//   //       console.log("response", response);
//   //       // Handle the response...
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };
//   //   handleAddAddress();
//   // };

//   const handleSubmit = async () => {
//     try {
//       const addressDTO: AddressDTO = {
//         province: province,
//         district: district,
//         ward: ward,
//         fullAddress: detail,
//         fullName: name,
//         phone: phone,
//         status: "ACTIVE",
//       };
//       const response = await addAddress(addressDTO);

//       console.log("response", response);

//       // Display success toast
//       toast.success("Thêm địa chỉ thành công!");

//       // close form
//       handleCloseForm();

//       // TODO: You may want to update the list of addresses or perform other actions on success
//     } catch (error) {
//       console.error(error);

//       // Display error toast
//       toast.error("Thêm địa chỉ thất bại. Vui lòng thử lại!");

//       // TODO: You may want to handle other error scenarios here
//     }
//   };

//   if (!props.showForm) return <></>;

//   return (
//     <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500/25">
//       <div
//         className=" px-4 py-8 min-w-[500px] bg-white shadow-xl rounded-xl"
//         ref={ref}
//       >
//         <h1 className="text-2xl font-bold text-center mb-4">Địa chỉ mới</h1>
//         {/* <form className="w-full bg-white p-6"> */}
//         <div className="mb-4">
//           <label
//             htmlFor="name"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Họ và tên
//           </label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             type="text"
//             id="name"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Nhập họ và tên của bạn"
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="phone"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Số điện thoại
//           </label>
//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             type="tel"
//             id="phone"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Nhập số điện thoại của bạn"
//           />
//         </div>
//         <ListAddressSelect
//           setProvince_={setProvince}
//           setDistrict_={setDistrict}
//           setWard_={setWard}
//         />
//         <div className="mb-4">
//           <label
//             htmlFor="detail"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Địa chỉ cụ thể
//           </label>
//           <textarea
//             value={detail}
//             onChange={(e) => setDetail(e.target.value)}
//             id="detail"
//             className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={3}
//             placeholder="Nhập địa chỉ cụ thể của bạn"
//           ></textarea>
//         </div>
//         <div className="flex items-center mb-4">
//           {/* <button
//             type="button"
//             onClick={handleSubmit}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
//           >
//             Thêm địa chỉ mới
//           </button> */}
//           <div className="flex items-center">
//             <input
//               onChange={(e) => setType(e.target.value)}
//               type="radio"
//               id="home"
//               name="type"
//               value="home"
//               className="text-indigo-500 focus:ring-indigo-500"
//               checked
//             />
//             <label
//               htmlFor="home"
//               className="text-gray-700 text-sm font-medium ml-2"
//             >
//               Nhà riêng
//             </label>
//           </div>
//           <div className="flex items-center ml-4">
//             <input
//               onChange={(e) => setType(e.target.value)}
//               type="radio"
//               id="office"
//               name="type"
//               value="office"
//               className="text-indigo-500 focus:ring-indigo-500"
//             />
//             <label
//               htmlFor="office"
//               className="text-gray-700 text-sm font-medium ml-2"
//             >
//               Văn phòng
//             </label>
//           </div>
//         </div>
//         <div className="flex justify-between">
//           <button
//             type="button"
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-gray-300 focus:ring-offset-2 focus:ring-2"
//             onClick={props.handleCloseForm}
//           >
//             Quay lại
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
//           >
//             Thêm địa chỉ mới
//           </button>
//         </div>
//         {/* </form> */}
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default AddForm;

// const ListAddressSelect = ({
//   setProvince_,
//   setDistrict_,
//   setWard_,
// }: {
//   setProvince_: (value: string) => void;
//   setDistrict_: (value: string) => void;
//   setWard_: (value: string) => void;
// }): React.ReactElement => {
//   const [open, setOpen] = React.useState(false);
//   const [showList, setShowList] = React.useState(0);
//   const [address, setAddress] = React.useState(
//     "Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
//   );
//   const ref = React.useRef<HTMLDivElement>(null);
//   const [data, setData] = React.useState<any[]>([]);
//   const [province, setProvince] = React.useState<any>(null);
//   const [district, setDistrict] = React.useState<any>(null);
//   const [ward, setWard] = React.useState<any>(null);
//   React.useEffect(() => {
//     const getApi = async () => {
//       const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");

//       setData(res.data);
//     };
//     getApi();
//   }, []);
//   React.useEffect(() => {
//     setAddress(
//       `${province ? province.name : "Tỉnh/ Thành phố"}, ${
//         district ? district.name : "Quận/Huyện"
//       }, ${ward ? ward.name : "Phường/Xã"}`
//     );
//     setProvince_ && setProvince_(province ? province.name : "Tỉnh/ Thành phố");
//     setDistrict_ && setDistrict_(district ? district.name : "Quận/Huyện");
//     setWard_ && setWard_(ward ? ward.name : "Phường/Xã");
//   }, [province, district, ward]);

//   React.useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const handleClickOutside = (event: any) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setOpen && setOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside, true);

//     return () => {
//       document.removeEventListener("click", handleClickOutside, true);
//     };
//   }, [setOpen]);

//   return (
//     <div className="mb-4">
//       <label
//         htmlFor="address"
//         className="block text-gray-700 text-sm font-medium mb-2"
//       >
//         Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã
//       </label>

//       <div className="relative">
//         <button
//           type="button"
//           className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full flex items-center justify-between"
//           id="dropdown-button"
//           aria-haspopup="true"
//           aria-expanded="true"
//           onClick={() => setOpen(!open)}
//         >
//           {address}
//           <svg
//             className="w-5 h-5 ml-2 -mr-1"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>

//         <div
//           ref={ref}
//           className={
//             " absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10" +
//             (open ? " block " : " hidden ")
//           }
//         >
//           <div className="grid grid-cols-3 gap-4 p-4">
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 0
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Tỉnh/ Thành phố
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 1
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Quận/ Huyện
//               </div>
//             </div>
//             <div className="col-span-1">
//               <div
//                 className={
//                   showList === 2
//                     ? "py-2 flex items-center justify-center text-red-600 font-semibold cursor-pointer border-b-2 border-red-500"
//                     : "py-2 flex items-center justify-center text-gray-400 font-semibold cursor-pointer"
//                 }
//               >
//                 Phường/ Xã
//               </div>
//             </div>
//           </div>
//           {showList === 0 && (
//             <ListProvince
//               setProvince={setProvince}
//               setShowList={setShowList}
//               data={data}
//             />
//           )}
//           {showList === 1 && (
//             <ListDistrict
//               setDistrict={setDistrict}
//               setShowList={setShowList}
//               data={province}
//             />
//           )}
//           {showList === 2 && (
//             <ListWard
//               setWard={setWard}
//               setShowList={setShowList}
//               data={district}
//               // setOpen={setOpen}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ListProvince = (props: {
//   setProvince: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: any[];
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setProvince(item);
//     props.setShowList(1);
//   };

//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data.map((item) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// const ListDistrict = (props: {
//   setDistrict: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: any;
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setDistrict(item);
//     props.setShowList(2);
//   };
//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data?.districts?.map((item: any) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const ListWard = (props: {
//   setWard: (value: string) => void;
//   setShowList: (value: number) => void;
//   data: any;
// }): React.ReactElement => {
//   const handClick = (item: any) => {
//     props.setWard(item);
//     props.setShowList(-1);
//   };
//   return (
//     <div className="w-full p-2 px-4 max-h-[200px] overflow-y-scroll">
//       <ul className="divide-y divide-gray-200 h-full overflow-auto">
//         {props.data?.wards?.map((item: any) => (
//           <li
//             className="py-4 px-4 hover:bg-gray-100 cursor-pointer"
//             key={item.code}
//             onClick={() => handClick(item)}
//           >
//             {item.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
