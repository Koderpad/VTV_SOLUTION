import { CustomLink } from "@/components/atoms/Link";
import { NotificationTooltip } from "@/components/organisms/Header/Tooltips/NotificationTooltip";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <nav className="bg-red-600 text-white">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/vendor" className="hover:underline">
              Kênh Người Bán
            </Link>
            <a href="#" className="hover:underline">
              Trở thành người bán Shopee
            </a>
            <a href="#" className="hover:underline">
              Tải ứng dụng
            </a>
            <a href="#" className="hover:underline">
              Kết nối
            </a>
            {/* Thêm các links khác ở đây nếu cần */}
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="hover:underline">
              Thông Báo
            </a>
            <a href="#" className="hover:underline">
              Hỗ Trợ
            </a>
            <div className="relative group">
              <button className="hover:underline focus:outline-none">
                Tiếng Việt
              </button>
              <div className="absolute hidden group-hover:block group-focus:block mt-1 bg-white text-gray-700 py-2 rounded shadow-lg">
                <a href="#" className="block px-4 py-1 hover:bg-gray-100">
                  English
                </a>
                {/* Các ngôn ngữ khác */}
              </div>
            </div>
            <a href="#" className="hover:underline">
              Đăng Ký
            </a>
            <a href="#" className="hover:underline">
              Đăng Nhập
            </a>
          </div>
        </div>
      </nav>
      <div className="bg-red-600 text-white flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <img src="path-to-logo.svg" alt="Logo" className="mr-2 h-12" />
          <span className="font-semibold hidden lg:block">Shopee</span>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pl-10 pr-16 rounded-full text-gray-700"
              placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
            />
            <button className="absolute right-0 top-0 mt-2 mr-2">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M..." />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <button className="ml-4">
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
              <path d="M..." />
            </svg>
          </button>
        </div>

        {/* <NotificationTooltip /> */}
        <CustomLink to="/login" className="hover:underline">
          Đăng nhập
          <div className="text-red-500 text-sm -mt-4">
            Username or password is incorrect
            <div className="text-center">
              <a href="#" className="text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>
        </CustomLink>
      </div>
    </div>
  );
};

export default Home;
