import React from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "lucide-react";
import { useGetListFollowedShopQuery } from "@/redux/features/common/followed_shop/followedShopApiSlice";
import { useLazyGetShopCusByIdQuery } from "@/redux/features/common/shop/shopApiSlice";

export const FollowedShop = () => {
  const navigate = useNavigate();
  const {
    data: followedShopsData,
    isLoading,
    isError,
    error,
  } = useGetListFollowedShopQuery();
  const [getShopById, { isLoading: isLoadingShopDetails }] =
    useLazyGetShopCusByIdQuery();

  const handleShopClick = async (shopId: number) => {
    try {
      const { data: shopDetails } = await getShopById(shopId);
      if (shopDetails && shopDetails.shopDTO.shopUsername) {
        navigate(`/${shopDetails.shopDTO.shopUsername}.shop`);
      } else {
        console.error("Không tìm thấy username của shop");
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin chi tiết của shop:", err);
    }
  };

  if (isLoading) {
    return <div>Đang tải danh sách shop...</div>;
  }

  if (isError) {
    return <div>Lỗi: {error.toString()}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Các Shop Bạn Đang Theo Dõi</h1>
      {followedShopsData && followedShopsData.followedShopDTOs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {followedShopsData.followedShopDTOs.map((shop) => (
            <div
              key={shop.followedShopId}
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300"
              onClick={() => handleShopClick(shop.shopId)}
            >
              <div className="flex items-center mb-4">
                {shop.avatar ? (
                  <img
                    src={shop.avatar}
                    alt={shop.shopName}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400 mr-4" />
                )}
                <h2 className="text-xl font-semibold">{shop.shopName}</h2>
              </div>
              {isLoadingShopDetails && <p>Đang tải thông tin shop...</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>Bạn chưa theo dõi shop nào.</p>
      )}
    </div>
  );
};

// import React from "react";
// import { UserIcon } from "lucide-react";
// import { useGetListFollowedShopQuery } from "@/redux/features/common/followed_shop/followedShopApiSlice";

// export const FollowedShop = () => {
//   const {
//     data: followedShopsData,
//     isLoading,
//     isError,
//     error,
//   } = useGetListFollowedShopQuery();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error: {error.toString()}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Shops You're Following</h1>
//       {followedShopsData && followedShopsData.followedShopDTOs.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {followedShopsData.followedShopDTOs.map((shop) => (
//             <div
//               key={shop.followedShopId}
//               className="bg-white shadow-md rounded-lg p-6"
//             >
//               <div className="flex items-center mb-4">
//                 {shop.avatar ? (
//                   <img
//                     src={shop.avatar}
//                     alt={shop.shopName}
//                     className="w-12 h-12 rounded-full mr-4"
//                   />
//                 ) : (
//                   <UserIcon className="w-12 h-12 text-gray-400 mr-4" />
//                 )}
//                 <h2 className="text-xl font-semibold">{shop.shopName}</h2>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>You're not following any shops yet.</p>
//       )}
//     </div>
//   );
// };
