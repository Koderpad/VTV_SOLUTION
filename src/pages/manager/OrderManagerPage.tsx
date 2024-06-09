import React from "react";
import {useNavigate} from "react-router-dom";

const OrderManagerPage = () => {
    const navigate = useNavigate();
  return (
      <div>


          <div className="flex justify-between items-center">


              <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                  onClick={() => navigate(-1)}
              >
                  Quay Lại
              </button>

              <button
                  onClick={() => navigate('/manager/order/revenue')}
                  className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
                  Thống kê khách hàng
              </button>
          </div>

          <h1>Order Manager</h1>
      </div>
  )
      ;
}

export default OrderManagerPage;