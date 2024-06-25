import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetProfileShopQuery,
  useUpdateShopMutation,
} from "@/redux/features/vendor/shop/shopApiSlice";
import {
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "@/services/common/AddressService";
import { ProvinceDTO } from "@/utils/DTOs/common/ProfileCustomer/Response/ListProvinceResponse";
import { DistrictDTO } from "@/utils/DTOs/common/ProfileCustomer/Response/ListDistrictResponse";
import { WardDTO } from "@/utils/DTOs/common/ProfileCustomer/Response/ListWardResponse";
import { ShopDTO } from "@/utils/DTOs/vendor/shop/Response/ShopResponse";

const UpdateShopProfile: React.FC = () => {
  const navigate = useNavigate();
  const { data: shopData, isLoading: isLoadingShop } = useGetProfileShopQuery();
  const [updateShop] = useUpdateShopMutation();

  const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
  const [districts, setDistricts] = useState<DistrictDTO[]>([]);
  const [wards, setWards] = useState<WardDTO[]>([]);

  const { control, handleSubmit, setValue, watch } = useForm<ShopDTO>();

  const selectedProvince = watch("provinceName");
  const selectedDistrict = watch("districtName");

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data.provinceDTOs);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const data = await getDistrictsByProvinceCode(selectedProvince);
        setDistricts(data.districtDTOs);
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const data = await getWardsByDistrictCode(selectedDistrict);
        setWards(data.wardDTOs);
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (shopData) {
      Object.entries(shopData.shopDTO).forEach(([key, value]) => {
        setValue(key as keyof ShopDTO, value);
      });
    }
  }, [shopData, setValue]);

  const convertShopDTOToFormData = (data: ShopDTO): FormData => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("provinceName", data.provinceName);
    formData.append("districtName", data.districtName);
    formData.append("wardName", data.wardName);
    formData.append("wardCode", data.wardCode);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("description", data.description);
    formData.append("openTime", data.openTime);
    formData.append("closeTime", data.closeTime);

    // Handle avatar
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
      formData.append("changeAvatar", "true");
    } else {
      formData.append("changeAvatar", "false");
    }

    return formData;
  };

  const onSubmit = async (data: ShopDTO) => {
    try {
      const formData = convertShopDTOToFormData(data);
      await updateShop(formData).unwrap();
      toast.success("Cập nhật cửa hàng thành công");
      navigate("/vendor/shop/profile");
    } catch (error) {
      toast.error(
        "Cập nhật cửa hàng thất bại: " + error.data?.message || "Đã xảy ra lỗi",
      );
    }
  };

  if (isLoadingShop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        Cập Nhật Cửa Hàng
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Tên cửa hàng là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tên cửa hàng
                </label>
                <input
                  {...field}
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Địa chỉ là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Địa chỉ
                </label>
                <input
                  {...field}
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="provinceName"
            control={control}
            defaultValue=""
            rules={{ required: "Tỉnh/Thành phố là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="provinceName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tỉnh/Thành phố
                </label>
                <select
                  {...field}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.provinceCode} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="districtName"
            control={control}
            defaultValue=""
            rules={{ required: "Quận/Huyện là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="districtName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Quận/Huyện
                </label>
                <select
                  {...field}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.districtCode} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="wardName"
            control={control}
            defaultValue=""
            rules={{ required: "Phường/Xã là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="wardName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phường/Xã
                </label>
                <select
                  {...field}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((ward) => (
                    <option key={ward.wardCode} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{ required: "Số điện thoại là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Số điện thoại
                </label>
                <input
                  {...field}
                  type="tel"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  {...field}
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Mô tả là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Mô tả
                </label>
                <textarea
                  {...field}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="openTime"
            control={control}
            defaultValue=""
            rules={{ required: "Giờ mở cửa là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="openTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Giờ mở cửa
                </label>
                <input
                  {...field}
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="closeTime"
            control={control}
            defaultValue=""
            rules={{ required: "Giờ đóng cửa là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="closeTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Giờ đóng cửa
                </label>
                <input
                  {...field}
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="avatar"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, ...field } }) => (
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Avatar
                </label>
                <input
                  {...field}
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {value && (
                  <img
                    src={value}
                    alt="Avatar Preview"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                )}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Mô tả là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Mô tả
                </label>
                <textarea
                  {...field}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="openTime"
            control={control}
            defaultValue=""
            rules={{ required: "Giờ mở cửa là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="openTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Giờ mở cửa
                </label>
                <input
                  {...field}
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="closeTime"
            control={control}
            defaultValue=""
            rules={{ required: "Giờ đóng cửa là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label
                  htmlFor="closeTime"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Giờ đóng cửa
                </label>
                <input
                  {...field}
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {error && (
                  <p className="text-red-500 text-xs italic">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cập Nhật Cửa Hàng
          </button>
          <button
            type="button"
            onClick={() => navigate("/vendor/shop/profile")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Quay lại
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UpdateShopProfile;
