import { useGetUserQuery } from "@/redux/features/common/auth/authApiSlice";
import { logOut } from "@/redux/features/common/auth/authSlice";
import { useAppSelector, persistor } from "@/redux/store";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useAppSelector(
    (state) => (state.auth.user as unknown as { username: string })?.username
  );

  //attribute profile
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [_birthday, setBirthDay] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  //call api profile
  const { data, refetch } = useGetUserQuery(undefined);
  const [updateUser] = useUpdateUserMutation();

  // set date when load page
  useEffect(() => {
    if (data) {
      setFullName(data.customerDTO.fullName);
      setEmail(data.customerDTO.email);

      console.log(data.customerDTO);

      try {
        if (data?.customerDTO.birthday) {
          const [year, month, day] = data.customerDTO.birthday
            .substring(0, 10)
            .split("-");
          console.log("chuoi date: ", year, month, day);
          const date = new Date(year, month - 1, day);
          setBirthDay(date.toLocaleDateString());
          console.log("date:   ", Intl.DateTimeFormat("vi-VN").format(date));
        } else {
          console.error("Birthday is undefined");
        }
      } catch (error) {
        console.error(`Invalid date string: ${data.birthday}`);
      }
      setGender(data.customerDTO.gender ? "male" : "female");
    }
  }, [data]);

  // Refetch data when component loads
  useEffect(() => {
    refetch();
  }, [refetch]);

  // #region Event handlers
  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setBirthDay(date.toLocaleString());
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };
  // #endregion Event handlers

  //submitting
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Convert date string to date-time string
    const dateString = Intl.DateTimeFormat("vi-VN").format(new Date(_birthday));
    const [day, month, year] = dateString.split("/");
    const birthday = `${year}-${month}-${day}`;

    const requestBody = {
      username,
      email,
      fullName,
      birthday,
      gender: gender === "male",
    };

    handleApiCall<ProfileCustomerResponse, ServerError>({
      callbackFn: async () => {
        return await updateUser(requestBody);
      },
      successCallback: (data) => {
        toast.success("Cập nhật thông tin thành công!");
        console.log(data);
      },
      errorFromServerCallback: (error) => {
        if (error.status === "FORBIDDEN") {
          dispatch(logOut());
          navigate("/login");
          const purgePersistor = async () => {
            try {
              await persistor.purge();
            } catch (error) {
              // handle error
              console.error(error);
            }
          };
          purgePersistor();
          // await persistor.purge();
        }
        if (error.status === "NOT_FOUND") {
          toast.error(error.message);
        }
      },
      errorSerializedCallback: (error) => {
        if (error.message) {
          toast.error(
            "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " +
              error.message
          );
        } else {
          toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
        }
      },
      errorCallback: (error) => {
        toast.error(
          "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " + error
        );
      },
    });

    // try {
    //   const updatedResult = await updateUser(requestBody);

    //   if ("data" in updatedResult) {
    //     const response = updatedResult.data;
    //   } else {
    //     const error = updatedResult.error;
    //     if ("status" in error) {
    //       const serverError = error.data as ServerError;
    //       if (serverError.status === "FORBIDDEN") {
    //         dispatch(logOut());
    //         navigate("/login");
    //         await persistor.purge();
    //       }
    //       if (serverError.status === "NOT_FOUND") {
    //         toast.error(serverError.message);
    //       }
    //     } else {
    //       // Lỗi không xác định (SerializedError)
    //       console.error(error);
    //       alert("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
    //     }
    //   }
    // } catch (error) {
    //   alert("Đã xảy ra lỗi khi cap nhat. Vui lòng thử lại sau.");
    // }
    setOpen(false);
  };

  return (
    <>
      <div className="bg-green-600 w-full h-full">
        <div className="h-full w-full p-10 bg-white">
          <h1 className="text-red-600 text-4xl pb-6">Edit Your Profile</h1>
          <div>
            <form className="w-full" action="#">
              <div className="flex justify-between w-full gap-5">
                <div className="flex flex-col w-2/5 gap-4">
                  <CustomInput
                    labelText="Họ và tên"
                    labelFor="name"
                    inputId="name"
                    inputType="text"
                    inputValue={fullName}
                    handleInputChange={handleFullNameChange}
                  />
                  <CustomInput
                    labelText="Email"
                    labelFor="email"
                    inputId="email"
                    inputType="email"
                    inputValue={email}
                    handleInputChange={handleEmailChange}
                  />
                  <CustomInput
                    labelText="SĐT"
                    labelFor="phone"
                    inputId="phone"
                    inputType="phone"
                    inputValue={"none"}
                    handleInputChange={() => null}
                  />
                </div>
                <div className="flex flex-col w-2/5 gap-4">
                  <DatePickerAsSingle
                    labelFor="birthdate"
                    labelText="Ngày sinh"
                    _setStartDate={_birthday ? new Date(_birthday) : new Date()}
                    handleChange={handleDateChange}
                  />
                  <div className="block w-[63%] mb-4">
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="gender"
                    >
                      Giới tính
                    </label>
                    <select
                      id="gender"
                      className="w-full bg-gray-200 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      value={gender}
                      onChange={handleGenderChange}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  {/* submit */}
                  <div className="block justify-center">
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="w-2/3 -bottom-60  h-auto bg-blue-500 text-white font-bold py-6 px-6 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      Cập nhật
                    </button>
                    <ModalSaveInf open={open} onClose={() => setOpen(false)}>
                      <div className="text-center w-auto">
                        <div className="w-full h-full flex justify-center">
                          <img className="w-1/5" src="/public/edit_info.svg" />
                        </div>
                        <div className="mx-auto my-4 w-full">
                          <h3 className="text-2xl font-black text-gray-800">
                            Xác nhận chỉnh sửa
                          </h3>
                          <p className="text-lg text-gray-500">
                            Bạn có chắc chắn muốn thay đổi thông tin không?
                          </p>
                        </div>
                        <div className="flex justify-between gap-20">
                          <button
                            type="button"
                            className=" w-2/3 shadow-2xl bg-blue-500 text-white font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            onClick={() => setOpen(false)}
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="w-2/3  shadow-2xl bg-red-600 text-white font-bold py-4 px-4 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            // onClick={() => setOpen(false)}
                            onClick={handleSubmit}
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    </ModalSaveInf>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

interface ModelSaveInfProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalSaveInf: React.FC<ModelSaveInfProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <div>
      <div
        onClick={onClose}
        className={`
      fixed inset-0 flex justify-center items-center transition-colors 
      ${open ? "visible bg-black/20" : "invisible"}
      `}
      >
        {/* modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            bg-white rounded-xl shadow p-6 transition-all 
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
        >
          <button
            type="button"
            onClick={onClose}
            className="
                    absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600
                  "
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M14.5 0H1.5C0.671875 0 0 0.671875 0 1.5V12.5C0 13.3281 0.671875 14 1.5 14H14.5C15.3281 14 16 13.3281 16 12.5V1.5C16 0.671875 15.3281 0 14.5 0ZM11.8875 9.07812C12.0375 9.22812 12.0375 9.47188 11.8875 9.62187L10.6219 10.8875C10.4719 11.0375 10.2281 11.0375 10.0781 10.8875L8 8.79062L5.92188 10.8875C5.77187 11.0375 5.52812 11.0375 5.37812 10.8875L4.1125 9.62187C3.9625 9.47188 3.9625 9.22812 4.1125 9.07812L6.20937 7L4.1125 4.92188C3.9625 4.77187 3.9625 4.52813 4.1125 4.37813L5.37812 3.1125C5.52812 2.9625 5.77187 2.9625 5.92188 3.1125L8 5.20937L10.0781 3.1125C10.2281 2.9625 10.4719 2.9625 10.6219 3.1125L11.8875 4.37813C12.0375 4.52813 12.0375 4.77187 11.8875 4.92188L9.79062 7L11.8875 9.07812Z"
                fill="#E20010"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

interface CustomInputProps {
  labelText: string;
  labelFor: string;
  inputId: string;
  inputType: string;
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  labelText,
  labelFor,
  inputId,
  inputType,
  inputValue,
  handleInputChange,
}) => {
  return (
    <div
      className={`block w-full mb-4 ${labelFor === "phone" ? "hidden" : ""}`}
    >
      <label className="block text-gray-700 mb-2" htmlFor={labelFor}>
        {labelText}
      </label>
      <input
        className="w-4/5 bg-gray-200 border border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-gray-500 focus:outline-none"
        id={inputId}
        name={inputId}
        type={inputType}
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

//==============================
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateUserMutation } from "@/redux/features/common/customer/customerApiSlice";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ProfileCustomerResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ProfileCustomerResponse";

interface DatePickerAsSingleProps {
  labelText: string;
  labelFor: string;
  _setStartDate: Date;
  handleChange: (date: Date) => void;
}

function DatePickerAsSingle({
  labelText,
  labelFor,
  _setStartDate,
  handleChange,
}: DatePickerAsSingleProps) {
  return (
    <div className="block w-full mb-4">
      <label className="block text-gray-700 mb-2" htmlFor={labelFor}>
        {labelText}
      </label>
      <div className="w-full">
        <DatePicker
          className="w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-gray-500 focus:outline-none"
          showIcon
          id={labelFor}
          selected={_setStartDate}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </div>
  );
}

export default Profile;
