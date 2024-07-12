//update address form
import React, { useEffect, useRef, useState } from "react";
import UpdateAddressSelect from "./AddressSelect";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddressRequest } from "@/utils/DTOs/common/ProfileCustomer/Request/AddressRequest";
import { AddressDTO } from "@/utils/DTOs/common/ProfileCustomer/Response/AddressResponse";
import { useUpdateAddressMutation } from "@/redux/features/common/customer/customerApiSlice";
import { getAddressByWardCode } from "@/services/common/AddressService";
import { LocationResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/LocationResponse";

interface UpdateFormProps {
  address: AddressDTO;
  onClose: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ address, onClose }) => {
  const [updateAddress] = useUpdateAddressMutation();
  const ref = useRef<HTMLDivElement>(null);
  const [fullAddress, setFullAddress] = useState<LocationResponse>();

  // useCallback(() => {
  //   const handleClickOutside = (event: any) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };

  //   console.log("add event listener");

  //   document.addEventListener("click", handleClickOutside, true);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // }, [onClose]);

  useEffect(() => {
    const fetchAddress = async () => {
      const response = await getAddressByWardCode(address.wardCode);
      setFullAddress(response);
    };
    fetchAddress();
  }, []);

  const [name, setName] = useState(address.fullName);
  const [phone, setPhone] = useState(address.phone);
  const [province, setProvinceValue] = useState<string>(address.provinceName);
  const [district, setDistrictValue] = useState<string>(address.districtName);
  const [ward, setWardValue] = useState<string>(address.wardName);
  const [detail, setDetail] = useState(address.fullAddress);
  const [wardCode, setWardCode] = useState<string>(address.wardCode);

  const handleSubmit = async () => {
    try {
      if (!province || !district || !ward || !name || !phone || !detail) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const updatedAddress: AddressRequest = {
        addressId: address.addressId, // Thêm addressId vào request
        provinceName: province,
        districtName: district,
        wardName: ward,
        fullAddress: detail,
        fullName: name,
        phone,
        wardCode: wardCode,
      };
      const response = await updateAddress(updatedAddress);

      console.log("address response", response);

      toast.success("Cập nhật địa chỉ thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật địa chỉ thất bại. Vui lòng thử lại!");
    }
  };

  if (!address) return <>Address Not Found! </>;

  if (!fullAddress) return <>Loading...</>;

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

        <UpdateAddressSelect
          initialProvince={fullAddress.provinceDTO}
          initialDistrict={fullAddress.districtDTO}
          initialWard={fullAddress.wardDTO}
          setProvince={setProvinceValue}
          setDistrict={setDistrictValue}
          setWard={setWardValue}
          setWardCode={setWardCode}
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
        {/* <div className="flex items-center mb-4">
          <div className="flex items-center">
            <input
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
        </div> */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-gray-300 focus:ring-offset-2 focus:ring-2"
            onClick={onClose}
          >
            Quay lại
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
          >
            Cap nhat dia chi
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UpdateForm;
