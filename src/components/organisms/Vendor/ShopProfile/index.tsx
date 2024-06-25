import { useGetProfileShopQuery } from "@/redux/features/vendor/shop/shopApiSlice";
import { ShopDTO } from "@/utils/DTOs/vendor/shop/Response/ShopResponse";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShopProfile = () => {
  const [callShopProfile] = useGetProfileShopQuery;

  const [shopDTO, setShopDTO] = useState<ShopDTO>();
  const navigate = useNavigate();

  const handleGetShopProfile = async () => {
    try {
      const response = await callShopProfile("").unwrap();
      setShopDTO(response.shopDTO);
      console.log("response", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetShopProfile();
  }, []);

  const handleUpdateShop = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate("/vendor/shop/edit");
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">Thông tin cửa hàng</h3>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleUpdateShop}
      >
        Cập nhật thông tin cửa hàng
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <img
            src={shopDTO?.avatar}
            alt=""
            className="w-full h-auto object-cover rounded"
          />
        </div>
        <div className="md:w-2/3">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-bold pr-2">Tên cửa hàng:</td>
                <td>{shopDTO?.name}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Địa chỉ:</td>
                <td>{shopDTO?.address}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Số điện thoại:</td>
                <td>{shopDTO?.phone}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Email:</td>
                <td>{shopDTO?.email}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Giờ mở cửa:</td>
                <td>{shopDTO?.openTime}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Giờ đóng cửa:</td>
                <td>{shopDTO?.closeTime}</td>
              </tr>
              <tr>
                <td className="font-bold pr-2">Trạng thái:</td>
                <td>{shopDTO?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">Mô tả cửa hàng</h3>
        <p>{shopDTO?.description}</p>
      </div>

      <div className={"mb-4"}>
        <h3 className="text-2xl font-bold mb-4">Địa chỉ cửa hàng</h3>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold pr-2">Tỉnh/Thành phố:</td>
              <td>{shopDTO?.province}</td>
            </tr>
            <tr>
              <td className="font-bold pr-2">Quận/Huyện:</td>
              <td>{shopDTO?.district}</td>
            </tr>
            <tr>
              <td className="font-bold pr-2">Phường/Xã:</td>
              <td>{shopDTO?.ward}</td>
            </tr>
            <tr>
              <td className="font-bold pr-2">Địa chỉ chi tiết:</td>
              <td>{shopDTO?.address}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopProfile;
