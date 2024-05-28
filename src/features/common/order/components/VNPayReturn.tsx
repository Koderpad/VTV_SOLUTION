import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { CSSTransition } from "react-transition-group";
import "./VNPayReturn.css";
import { useGetVNPayReturnQuery } from "@/redux/features/common/order/vnPayApiSlice";

const VNPayReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpTxnRef = searchParams.get("vnp_TxnRef");

  const { data: vnPayReturn, isLoading } = useGetVNPayReturnQuery(
    { vnp_ResponseCode: vnpResponseCode || "", vnp_TxnRef: vnpTxnRef || "" },
    { skip: !vnpResponseCode || !vnpTxnRef }
  );

  useEffect(() => {
    const checkPaymentStatus = () => {
      if (vnPayReturn?.vnp_ResponseCode === "00") {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failure");
      }
    };

    const timer = setTimeout(() => {
      setLoading(false);
      checkPaymentStatus();
    }, 5000);

    return () => clearTimeout(timer);
  }, [vnPayReturn]);

  useEffect(() => {
    if (paymentStatus) {
      const timer = setTimeout(() => {
        navigate("/user/account/history-purchase");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="vnpay-return">
      {loading || isLoading ? (
        <div className="loading-container">
          <BeatLoader color="#36d7b7" loading={true} size={20} />
          <p>Đang xử lý kết quả thanh toán...</p>
        </div>
      ) : (
        <CSSTransition in={!loading} timeout={300} classNames="fade" unmountOnExit>
          <div className="result-container">
            {paymentStatus === "success" ? (
              <div className="success-message">
                <h2>Thanh toán thành công!</h2>
                <p>{vnPayReturn?.vnp_Message}</p>
              </div>
            ) : (
              <div className="failure-message">
                <h2>Thanh toán thất bại!</h2>
                <p>{vnPayReturn?.vnp_Message}</p>
              </div>
            )}
          </div>
        </CSSTransition>
      )}
    </div>
  );
};

export default VNPayReturn;
// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BeatLoader } from "react-spinners";
// import { CSSTransition } from "react-transition-group";
// import "./VNPayReturn.css";
//
// const VNPayReturn = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | null>(null);
//
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const vnpResponseCode = searchParams.get("vnp_ResponseCode");
//     const vnpTransactionStatus = searchParams.get("vnp_TxnRef");
//
//     const checkPaymentStatus = () => {
//       if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
//         setPaymentStatus("success");
//       } else {
//         setPaymentStatus("failure");
//       }
//     };
//
//     const timer = setTimeout(() => {
//       setLoading(false);
//       checkPaymentStatus();
//     }, 5000);
//
//     return () => clearTimeout(timer);
//   }, [location.search]);
//
//   useEffect(() => {
//     if (paymentStatus === "success") {
//       const timer = setTimeout(() => {
//         navigate("/user/account/history-purchase");
//       }, 2000);
//
//       return () => clearTimeout(timer);
//     } else if (paymentStatus === "failure") {
//       const timer = setTimeout(() => {
//         navigate("/checkout");
//       }, 2000);
//
//       return () => clearTimeout(timer);
//     }
//   }, [paymentStatus, navigate]);
//
//   return (
//     <div className="vnpay-return">
//       {loading ? (
//         <div className="loading-container">
//           <BeatLoader color="#36d7b7" loading={true} size={20} />
//           <p>Đang xử lý kết quả thanh toán...</p>
//         </div>
//       ) : (
//         <CSSTransition
//           in={!loading}
//           timeout={300}
//           classNames="fade"
//           unmountOnExit
//         >
//           <div className="result-container">
//             {paymentStatus === "success" ? (
//               <div className="success-message">
//                 <h2>Thanh toán thành công!</h2>
//                 <p>Cảm ơn bạn đã mua hàng.</p>
//               </div>
//             ) : (
//               <div className="failure-message">
//                 <h2>Thanh toán thất bại!</h2>
//                 <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
//               </div>
//             )}
//           </div>
//         </CSSTransition>
//       )}
//     </div>
//   );
// };
//
// export default VNPayReturn;
