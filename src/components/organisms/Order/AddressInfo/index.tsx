import React from "react";

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

export const AddressInfo: React.FC<{ address: AddressDTO }> = ({ address }) => {
  return (
    <div
      className="w-4/5 mx-auto mt-4 bg-white flex flex-col h-36"
      style={{ borderTop: "4px solid red" }}
    >
      <div className="bg-white flex flex-col shadow-md rounded px-8 py-6 mb-4">
        <div className="bg-white flex flex-row">
          <div className="mb-4 flex items-center">
            <span className="text-gray-700 text-2xl font-medium mr-2">
              {address?.fullName}
            </span>
            <span className="text-gray-700 text-2xl font-medium"> | </span>
            <span className="text-gray-700 text-2xl font-medium ml-2">
              {address?.phone}
            </span>
            <span className="text-gray-700 text-2xl font-medium ml-16">
              {address
                ? `${address.provinceFullName} | ${address.districtFullName} | ${address.wardFullName}`
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-end flex-grow">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Thay đổi
            </button>
          </div>
        </div>
        <div className="flex flex-row mt-4">
          <div className="inline-block border-2 border-red-300 rounded p-1 max-w-max">
            <span className="inline-block text-red-500">Mặc định</span>
          </div>
        </div>
      </div>
    </div>
  );
};
