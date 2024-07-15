import {
  useGetProfileShopQuery,
  useRegisterShopMutation,
} from "@/redux/features/vendor/shop/shopApiSlice";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressSelect from "../Account/Address/AddForm/AddressSelect";
import { useDispatch } from "react-redux";
import { persistor } from "@/redux/store";
import { logOut } from "@/redux/features/common/auth/authSlice";

interface ShopRequest {
  name: string;
  address: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  wardCode: string;
  phone: string;
  email: string;
  avatar: string | File;
  description: string;
  openTime: string;
  closeTime: string;
}

const VendorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [registerShop] = useRegisterShopMutation();
  const { control, handleSubmit, setValue, watch } = useForm<ShopRequest>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const dispatch = useDispatch();

  const {
    data: shopResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileShopQuery();

  const handleLogout = async () => {
    // await persistor.purge();
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    localStorage.removeItem("token");
    dispatch(logOut());
    navigate("/");
    window.location.reload();
  };

  const convertShopRequestToFormData = (data: ShopRequest): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar") {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };

  const onSubmit = async (data: ShopRequest) => {
    try {
      const formData = convertShopRequestToFormData(data);
      await registerShop(formData)
        .unwrap()
        .then((payload) => {
          toast.success(payload.message);
          handleLogout();
        })
        .catch((error) => {
          toast.error(error.data.message);
          console.log(error);
        });
      //   toast.success("Đăng ký cửa hàng thành công");
    } catch (error) {
      toast.error("Đăng ký cửa hàng thất bại");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {shopResponse?.code === 200 ? (
        <div className="text-center text-red-500 font-bold">
          Bạn đã đăng ký cửa hàng rồi.
          <button
            className="text-blue-400"
            onClick={() => {
              navigate("/");
            }}
          >
            Quay lại trang chủ
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-200 min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-6 text-blue-600">
            Đăng Ký Trở Thành Người Bán
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <AddressSelect
                setProvince={(value) => setValue("provinceName", value)}
                setDistrict={(value) => setValue("districtName", value)}
                setWard={(value) => setValue("wardName", value)}
                setWardCode={(value) => setValue("wardCode", value)}
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                      <p className="text-red-500 text-xs italic">
                        {error.message}
                      </p>
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
                Đăng Ký Cửa Hàng
              </button>
            </div>
          </form>
          <ToastContainer position="bottom-right" />
        </div>
      )}
    </>
  );
};

export default VendorRegister;
