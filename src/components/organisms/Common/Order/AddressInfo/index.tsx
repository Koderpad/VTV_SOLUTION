import { OrderRequestWithCart } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
import React from "react";
import { AddressDialog } from "./AddressDialog";
import { useGetAllAddressQuery } from "@/redux/features/common/customer/customerApiSlice";

export interface AddressDTO {
  addressId: number;
  provinceName: string;
  provinceFullName: string;
  districtName: string;
  districtFullName: string;
  wardName: string;
  wardFullName: string;
  fullAddress: string;
  fullName: string;
  phone: string;
  status: string;
  wardCode: string;
}

interface Props {
  address: AddressDTO;
  updateOrderRequest: (
    index: number,
    updates: Partial<OrderRequestWithCart>,
  ) => void;
}

export const AddressInfo: React.FC<Props> = ({
  address,
  updateOrderRequest,
}) => {
  const { data: addresses, isLoading, isSuccess } = useGetAllAddressQuery();

  const handleUpdate = (addressId: number) => {
    updateOrderRequest(-1, { addressId: addressId });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className="mt-4 bg-white flex flex-col h-36"
      style={{ borderTop: "4px solid red" }}
    >
      <span className="ml-2 text-gray-700 text-2xl font-medium">
        Địa chỉ nhận hàng
      </span>
      <div className="bg-white flex flex-col shadow-md rounded px-2 py-6 ">
        <div className="bg-white flex flex-row">
          <div className="w-4/5 mb-4 flex items-center">
            <div className="w-2/5">
              <span className="text-gray-700  font-extrabold text-2xl  mr-2">
                {address?.fullName}
              </span>
              <span className="font-extrabold text-gray-700 text-2xl  ml-2">
                {address?.phone}
              </span>
            </div>
            <span className=" text-gray-700 text-2xl text-wrap font-medium ml-32">
              {address
                ? `${address.provinceFullName}, ${address.districtFullName}, ${address.wardFullName}`
                : "N/A"}
            </span>
          </div>
          {address.status === "ACTIVE" && (
            <div className="border-2 border-red-300 rounded flex justify-item items-center">
              <span className="text-red-500">Mặc định</span>
            </div>
          )}
          <div className="flex items-center justify-end flex-grow">
            <AddressDialog
              addresses={addresses!}
              handleUpdate={handleUpdate}
              currentAddressId={address.addressId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// import { OrderRequestWithCart } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
// import React from "react";
// import { AddressDialog } from "./AddressDialog";
// import { useGetAllAddressQuery } from "@/redux/features/common/customer/customerApiSlice";
//
// export interface AddressDTO {
//   addressId: number;
//   provinceName: string;
//   provinceFullName: string;
//   districtName: string;
//   districtFullName: string;
//   wardName: string;
//   wardFullName: string;
//   fullAddress: string;
//   fullName: string;
//   phone: string;
//   status: string;
//   wardCode: string;
// }
//
// interface Props {
//   address: AddressDTO;
//   updateOrderRequest: (
//     index: number,
//     updates: Partial<OrderRequestWithCart>,
//   ) => void;
// }
//
// export const AddressInfo: React.FC<Props> = ({
//   address,
//   updateOrderRequest,
// }) => {
//   const { data: addresses, isLoading, isSuccess } = useGetAllAddressQuery();
//
//   const handleUpdate = (addressId: number) => {
//     updateOrderRequest(-1, { addressId: addressId });
//   };
//   if (isLoading) return <div>Loading...</div>;
//   return (
//     <div
//       className="mt-4 bg-white flex flex-col h-36"
//       style={{ borderTop: "4px solid red" }}
//     >
//       <span className="ml-2 text-gray-700 text-2xl font-medium">
//         Địa chỉ nhận hàng
//       </span>
//       <div className="bg-white flex flex-col shadow-md rounded px-2 py-6 ">
//         <div className="bg-white flex flex-row">
//           <div className="w-4/5 mb-4 flex items-center">
//             <div className="w-2/5">
//               <span className="text-gray-700  font-extrabold text-2xl  mr-2">
//                 {address?.fullName}
//               </span>
//               <span className="font-extrabold text-gray-700 text-2xl  ml-2">
//                 {address?.phone}
//               </span>
//             </div>
//             <span className=" text-gray-700 text-2xl text-wrap font-medium ml-32">
//               {address
//                 ? `${address.provinceFullName}, ${address.districtFullName}, ${address.wardFullName} dasdksakdjsakldjlaskdjlskadjkl`
//                 : "N/A"}
//             </span>
//           </div>
//           <div className=" border-2 border-red-300 rounded flex justify-item items-center">
//             <span className=" text-red-500">Mặc định</span>
//           </div>
//           <div className="flex items-center justify-end flex-grow">
//             <AddressDialog
//               addresses={addresses}
//               handleUpdate={handleUpdate}
//               currentAddressId={address.addressId}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
