import React, { useState, useEffect } from "react";
import { useUpdateAddressMutation } from "@/redux/features/common/customer/customerApiSlice";

interface AddressDTO {
  addressId?: number;
  province: string;
  district: string;
  ward: string;
  fullAddress: string;
  fullName: string;
  phone: string;
  status: string; // You may want to define a more specific type for status
}

interface UpdateFormProps {
  address: AddressDTO;
  onClose: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ address, onClose }) => {
  const [name, setName] = useState(address.fullName);
  const [phone, setPhone] = useState(address.phone);
  const [province, setProvince] = useState(address.province);
  const [district, setDistrict] = useState(address.district);
  const [ward, setWard] = useState(address.ward);
  const [detail, setDetail] = useState(address.fullAddress);
  const [type, setType] = useState(address.status);

  const [updateAddress, { isLoading }] = useUpdateAddressMutation();

  useEffect(() => {
    setName(address.fullName);
    setPhone(address.phone);
    setProvince(address.province);
    setDistrict(address.district);
    setWard(address.ward);
    setDetail(address.fullAddress);
    setType(address.status);
  }, [address]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedAddress: AddressDTO = {
        ...address,
        fullName: name,
        phone: phone,
        province: province,
        district: district,
        ward: ward,
        fullAddress: detail,
        status: type,
      };
      await updateAddress(updatedAddress).unwrap();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500/25">
      <div className=" px-4 py-8 min-w-[500px] bg-white shadow-xl rounded-xl">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Họ và tên:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Số điện thoại:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="province"
            >
              Tỉnh/Thành phố:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="province"
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="district"
            >
              Quận/Huyện:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="ward"
            >
              Phường/Xã:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ward"
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="detail"
            >
              Địa chỉ cụ thể:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="type"
            >
              Loại:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cập nhật địa chỉ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;

// // UpdateForm.tsx
// import React from "react";

// const UpdateForm = ({ address, onClose }) => {
//   // TODO: Implement form fields and logic for updating an address
//   // Use the `address` prop to pre-fill the form fields

//   return (
//     <div>
//       {/* Form goes here */}
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default UpdateForm;

// import React, { useState, useEffect } from "react";
// import { AddressDTO } from "./AddressForm";
// import { useUpdateAddressMutation } from "../../redux/api/addressApi";

// interface UpdateFormProps {
//   address: AddressDTO;
//   onClose: () => void;
// }

// const UpdateForm: React.FC<UpdateFormProps> = ({ address, onClose }) => {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [province, setProvince] = useState("");
//   const [district, setDistrict] = useState("");
//   const [ward, setWard] = useState("");
//   const [detail, setDetail] = useState("");
//   const [type, setType] = useState("");

//   const [updateAddress, { isLoading }] = useUpdateAddressMutation();

//   useEffect(() => {
//     if (address) {
//       setName(address.fullName);
//       setPhone(address.phone);
//       setProvince(address.province);
//       setDistrict(address.district);
//       setWard(address.ward);
//       setDetail(address.fullAddress);
//       setType(address.status);
//     }
//   }, [address]);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       const updatedAddress: AddressDTO = {
//         ...address,
//         fullName: name,
//         phone: phone,
//         province: province,
//         district: district,
//         ward: ward,
//         fullAddress: detail,
//         status: type,
//       };
//       await updateAddress(updatedAddress).unwrap();
//       onClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500/25">
//       <div
//         className=" px-4 py-8 min-w-[500px] bg-white shadow-xl rounded-xl"
//         ref={}
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
//       {/* <ToastContainer position="bottom-right" /> */}
//     </div>
//     // <form onSubmit={handleSubmit}>
//     //   {/* Form fields similar to AddForm.tsx */}
//     //   {/* Don't forget to pre-fill the form fields with the current address details */}
//     //   {/* ... */}
//     //   <button type="submit" disabled={isLoading}>
//     //     Cập nhật địa chỉ
//     //   </button>
//     //   <button type="button" onClick={onClose}>
//     //     Hủy
//     //   </button>
//     // </form>
//   );
// };

// export default UpdateForm;
