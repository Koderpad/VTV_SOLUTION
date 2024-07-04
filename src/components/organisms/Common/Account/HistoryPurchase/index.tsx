import { cn } from "@/utils/cn";
import {
  NavLink,
  Link,
  createSearchParams,
  useNavigate,
} from "react-router-dom";
import useQueryParams from "@/hooks/useQueryParams";
import {
  useCancelOrderMutation,
  useGetOrdersByStatusVer2Query,
  //   useCompleteOrderMutation,
  //   useReturnOrderMutation,
} from "@/redux/features/common/customer/customerApiSlice";
import {
  OrderDTO,
  OrderItemDTO,
} from "@/utils/DTOs/common/Order/Response/ListOrderResponse";
import { useEffect, useRef, useState } from "react";
import {
  useAddReviewMutation,
  useGetReviewDetailByOrderItemIdQuery,
  useIsReviewExistQuery,
} from "@/redux/features/common/review/reviewApiSlice";
import { ReviewRequest } from "@/utils/DTOs/common/Review/Request/ReviewRequest";

const purchasesStatus = {
  ALL: 0,
  PENDING: 1,
  PROCESSING: 2,
  PICKUP_PENDING: 3,
  SHIPPING: 4,
  DELIVERED: 5,
  COMPLETED: 6,
  RETURNED: 7,
  WAITING: 8,
  CANCEL: 9,
  REFUNDED: 10,
  PAID: 11,
  UNPAID: 12,
  FAIL: 13,
} as const;

const purchaseStatusString = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "PICKUP_PENDING",
  "SHIPPING",
  "DELIVERED",
  "COMPLETED",
  "RETURNED",
  "WAITING",
  "CANCEL",
  "REFUNDED",
  "PAID",
  "UNPAID",
  "FAIL",
];

const purchaseTabs = [
  { status: purchasesStatus.ALL, name: "Tất cả" },
  { status: purchasesStatus.PENDING, name: "Đang chờ xử lý" },
  { status: purchasesStatus.PROCESSING, name: "Đang xử lý" },
  { status: purchasesStatus.PICKUP_PENDING, name: "Chờ lấy hàng" },
  { status: purchasesStatus.SHIPPING, name: "Đang giao" },
  { status: purchasesStatus.DELIVERED, name: "Đã giao" },
  { status: purchasesStatus.COMPLETED, name: "Hoàn thành" },
  { status: purchasesStatus.RETURNED, name: "Đã trả lại" },
  { status: purchasesStatus.CANCEL, name: "Đã hủy" },
  { status: purchasesStatus.REFUNDED, name: "Đã hoàn tiền" },
  { status: purchasesStatus.PAID, name: "Đã thanh toán" },
  { status: purchasesStatus.UNPAID, name: "Chưa thanh toán" },
  { status: purchasesStatus.WAITING, name: "Đang thanh toán" },
];

export const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams();
  const status: number = Number(queryParams.status) || purchasesStatus.ALL;

  const [isUpdate, setIsUpdate] = useState(false);
  const statusString = purchaseStatusString[status];

  const {
    data: otherData,
    isLoading: isLoadingOther,
    isError: isErrorOther,
    refetch: refetchOther,
  } = useGetOrdersByStatusVer2Query(statusString);

  const [cancelOrder] = useCancelOrderMutation();

  const refetchData = async () => {
    await refetchOther();
  };

  useEffect(() => {
    refetchData();
  }, [isUpdate, status]);

  if (isLoadingOther) {
    return <div>Loading...</div>;
  }

  if (isErrorOther) {
    return <div>Error loading data</div>;
  }

  const data = otherData;

  const orderDTOs: OrderDTO[] = data?.orderDTOs || [];

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      alert("Hủy đơn hàng thành công");
      setIsUpdate(!isUpdate);
    } catch (error) {
      alert("Hủy đơn hàng thất bại");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    console.log(orderId);
  };

  const handleReturnOrder = async (orderId: string) => {
    console.log("Return order");
    console.log(orderId);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: "/user/account/history-purchase",
        search: createSearchParams({
          status: String(tab.status),
        }).toString(),
      }}
      className={cn(
        "flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
        {
          "border-orange-600 text-orange-600": status === tab.status,
          "border-b-black/10 text-gray-900": status !== tab.status,
        },
      )}
    >
      {tab.name}
    </Link>
  ));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="sticky top-0 flex rounded-t-sm shadow-sm">
          {purchaseTabsLink}
        </div>
        <div>
          {orderDTOs?.map((purchase) => (
            <div
              key={purchase.orderId}
              className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm"
            >
              {purchase.orderItemDTOs.map((item: OrderItemDTO) => (
                <div>
                  <NavLink
                    to={`/user/account/order/${purchase.orderId}`}
                    className="flex"
                    key={item.cartId}
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="h-20 w-20 object-cover"
                        src={item.productVariantDTO.productImage}
                        alt={item.productVariantDTO.productName}
                      />
                    </div>
                    <div className="ml-3 flex-grow overflow-hidden">
                      <div className="truncate">
                        {item.productVariantDTO.productName}
                      </div>
                      <div className="mt-3">x{item.quantity}</div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="ml-2 truncate text-orange">
                        {formatPrice(item.quantity * item.price)} VNĐ
                      </span>
                    </div>
                  </NavLink>
                  {purchase.status === "COMPLETED" && (
                    <ReviewButton orderItemId={item.orderItemId} />
                  )}
                </div>
              ))}
              <div className="flex justify-end">
                <span className="mr-4">
                  Ngày đặt hàng: {formatDate(purchase.orderDate)}
                </span>
                {purchase.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelOrder(purchase.orderId)}
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-yellow-500 hover:bg-yellow-100 hover:text-yellow-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-yellow-800/30 dark:hover:text-yellow-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Hủy
                  </button>
                )}
                {purchase.status === "DELIVERED" && (
                  <>
                    <button
                      onClick={() => handleCompleteOrder(purchase.orderId)}
                      type="button"
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-green-500 hover:bg-green-100 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-green-800/30 dark:hover:text-green-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
                    >
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => handleReturnOrder(purchase.orderId)}
                      type="button"
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-red-500 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Trả lại
                    </button>
                  </>
                )}
                <div className="mr-4">
                  <span>Tổng khuyến mãi</span>
                  <span className="ml-4 text-xl text-orange">
                    {formatPrice(
                      purchase.discountSystem + purchase.discountShop,
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                <div>
                  <span>Tổng giá tiền</span>
                  <span className="ml-4 text-xl text-orange">
                    {formatPrice(purchase.paymentTotal)} VNĐ
                  </span>
                </div>

                <div className="ml-4">
                  <span>
                    {" "}
                    Trạng thái:{" "}
                    {purchase?.status === "PENDING"
                      ? "Đang chờ xử lý"
                      : purchase?.status === "PROCESSING"
                        ? "Đang xử lý"
                        : purchase?.status === "PICKUP_PENDING"
                          ? "Chờ lấy hàng"
                          : purchase?.status === "SHIPPING"
                            ? "Đang giao hàng"
                            : purchase?.status === "DELIVERED"
                              ? "Đã giao hàng"
                              : purchase?.status === "COMPLETED"
                                ? "Hoàn thành"
                                : purchase?.status === "RETURNED"
                                  ? "Đã trả lại"
                                  : purchase?.status === "WAITING"
                                    ? "Đang thanh toán"
                                    : purchase?.status === "REFUNDED"
                                      ? "Đã hoàn tiền"
                                      : purchase?.status === "CANCEL"
                                        ? "Đã hủy"
                                        : purchase?.status === "PAID"
                                          ? "Đã thanh toán"
                                          : purchase?.status === "UNPAID"
                                            ? "Chưa thanh toán"
                                            : "Không xác định"}
                  </span>
                </div>
              </div>
              <div className="h-[50px] bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const ReviewButton = ({ orderItemId }: { orderItemId: string }) => {
  console.log(orderItemId);
  const { data: isReviewExistData } = useIsReviewExistQuery(orderItemId);
  const isReviewExist = isReviewExistData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log(isReviewExist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="py-3 z-40 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-blue-500 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
      >
        {isReviewExist ? "Xem đánh giá" : "Đánh giá"}
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isReviewExist ? (
          <ReviewDetail orderItemId={orderItemId} />
        ) : (
          <AddReviewForm orderItemId={orderItemId} onReviewAdded={closeModal} />
        )}
      </Modal>
    </>
  );
};

const AddReviewForm = ({
  orderItemId,
  onReviewAdded,
}: {
  orderItemId: string;
  onReviewAdded: () => void;
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [addReview] = useAddReviewMutation();
  const { refetch: refetchOther } = useGetOrdersByStatusVer2Query("ALL");

  const convertReviewRequestToFormData = (
    reviewRequest: ReviewRequest,
  ): FormData => {
    const formData = new FormData();
    formData.append("content", reviewRequest.content);
    formData.append("rating", String(reviewRequest.rating));
    formData.append("orderItemId", reviewRequest.orderItemId);
    formData.append("hasImage", String(reviewRequest.hasImage));

    if (reviewRequest.hasImage && reviewRequest.image instanceof File) {
      formData.append("image", reviewRequest.image);
    }

    return formData;
  };

  const handleAddReview = async (reviewRequest: ReviewRequest) => {
    try {
      const req = convertReviewRequestToFormData(reviewRequest);
      // console.log(req);
      // const res = await addReview(req).unwrap();
      // alert(res.message)
      // refetchOther();

      handleApiCall<ReviewResponse, ServerError>({
        callbackFn: async () => {
          return await addReview(req);
        },
        successCallback: (data) => {
          // toast.success("Cập nhật thông tin thành công!");
          toast.success(data.message);
          refetchOther();
        },
        errorFromServerCallback: (error) => {
          if (error.status === "NOT_FOUND") {
            toast.error(error.message);
          }
          if (error.status === "BAD_REQUEST") {
            toast.error(error.message);
          }
        },
        errorSerializedCallback: (error) => {
          if (error.message) {
            toast.error(
              "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " +
                error.message,
            );
          } else {
            toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
          }
        },
        errorCallback: (error) => {
          toast.error(
            "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " + error,
          );
        },
      });
    } catch (error) {
      alert("Đánh giá thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewRequest: ReviewRequest = {
      content,
      rating,
      orderItemId: orderItemId,
      image,
      hasImage,
    };
    await handleAddReview(reviewRequest);
    onReviewAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Nội dung đánh giá:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="rating">Đánh giá:</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        >
          <option value={0}>Chọn đánh giá</option>
          <option value={1}>1 sao</option>
          <option value={2}>2 sao</option>
          <option value={3}>3 sao</option>
          <option value={4}>4 sao</option>
          <option value={5}>5 sao</option>
        </select>
      </div>
      <div>
        <label htmlFor="image">Hình ảnh:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setHasImage(true);
            }
          }}
        />
      </div>
      <button type="submit">Đánh giá</button>
    </form>
  );
};

const ReviewDetail = ({ orderItemId }: { orderItemId: string }) => {
  const { data: reviewData } =
    useGetReviewDetailByOrderItemIdQuery(orderItemId);
  const review = reviewData?.reviewDTO;

  const navigate = useNavigate();

  return (
    <div>
      {review ? (
        <RatingComment review={review} />
      ) : (
        <p>Chưa có đánh giá cho sản phẩm này.</p>
      )}
      <button onClick={() => navigate(`/product/${review?.orderItemId}`)}>
        Xem sản phẩm
      </button>
    </div>
  );
};

import { createPortal } from "react-dom";
import { RatingComment } from "../../ProductDetail/ProductReviews/CommentList/RatingComment";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        event.stopPropagation();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
