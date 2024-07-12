import { useEffect, useState } from "react";
import { useChangePasswordMutation } from "@/redux/features/common/customer/customerApiSlice";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ProfileCustomerResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ProfileCustomerResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { persistor, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/redux/features/common/auth/authSlice";

const PasswordChanges = () => {
  const [oldpw, setOldpw] = useState("");
  const [newpw, setNewpw] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const username = useAppSelector(
    (state) => (state.auth.user as unknown as { username: string })?.username
  );
  //get username from store

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    // await persistor.purge();
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    localStorage.removeItem("token");
    dispatch(logOut());
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
      setOldpw("");
      setNewpw("");
      setErrorMessage("");
    }

    return () => {
      clearTimeout;
    };
  }, [showModal]);

  const handleOldpwChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldpw(event.target.value);
  };

  const handleNewpwChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewpw(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // try {
    //   await changePassword({
    //     oldPassword: oldpw,
    //     newPassword: newpw,
    //   }).unwrap();
    //   setShowModal(true);
    // } catch (error) {
    //   console.error(error);
    //   setErrorMessage("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    // }
    handleApiCall<ProfileCustomerResponse, ServerError>({
      callbackFn: async () => {
        return await changePassword({
          username: username,
          oldPassword: oldpw,
          newPassword: newpw,
        });
      },
      successCallback: (data) => {
        console.log(data);
        setShowModal(true);
        handleLogout();
      },
      errorFromServerCallback: (error) => {
        setErrorMessage(error.message);
      },
      errorSerializedCallback: (error) => {
        setErrorMessage(
          error.message
            ? error.message
            : "Đổi mật khẩu thất bại. Vui lòng thử lại."
        );
      },
      errorCallback: () => {
        setErrorMessage("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      },
    });
  };

  return (
    <div className=" w-full p-10 bg-white">
      <h1 className="text-red-600 text-4xl pb-6">Đổi mật khẩu</h1>
      <h2 className="text-gray-500 text-2xl pb-6">
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </h2>
      <div className="w-full flex justify-center items-center">
        <form
          className="flex flex-col gap-4 w-auto"
          action="#"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className={`flex flex-col w-full mb-4`}>
                <label
                  className="block text-gray-700 mb-2 w-full"
                  htmlFor="oldpw"
                >
                  Mật khẩu cũ
                </label>
                <input
                  className="bg-gray-200 border border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-gray-500 focus:outline-none"
                  id="oldpw"
                  name="oldpw"
                  type="password"
                  value={oldpw}
                  onChange={handleOldpwChange}
                />
              </div>
              <div className={`block w-full mb-4`}>
                <label className="block text-gray-700 mb-2" htmlFor="newpw">
                  Mật khẩu mới
                </label>
                <input
                  className=" bg-gray-200 border border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:bg-white focus:border-gray-500 focus:outline-none"
                  id="newpw"
                  name="newpw"
                  type="password"
                  value={newpw}
                  onChange={handleNewpwChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className=" inline-flex items-center justify-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:bg-white dark:text-gray-800"
              >
                Lưu
              </button>
              {showModal && (
                <div>
                  <p
                    className="
                      text-red-600
                      "
                  >
                    Đổi mật khẩu thành công!
                  </p>
                  <button onClick={() => setShowModal(false)}></button>
                </div>
              )}
              {errorMessage && (
                <div>
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChanges;
