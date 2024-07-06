import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreVertical, Trash } from "lucide-react";
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
} from "@/redux/features/common/customer/customerApiSlice";
import {
  OrderDTO,
  OrderItemDTO,
} from "@/utils/DTOs/common/Order/Response/ListOrderResponse";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetReviewDetailByOrderItemIdQuery,
  useIsReviewExistQuery,
} from "@/redux/features/common/review/reviewApiSlice";
import { ReviewRequest } from "@/utils/DTOs/common/Review/Request/ReviewRequest";
import { createPortal } from "react-dom";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Controller, useForm } from "react-hook-form";
import { Rating } from "@/components/molecules/Rating";
import { CustomerDTO, useUser } from "@/hooks/useUser";
import {
  useAddNewCommentByCustomerMutation,
  useDeleteCommentByCustomerMutation,
} from "@/redux/features/common/comment/commentApiSlice";
import { CommentResponse } from "@/utils/DTOs/common/Comment/Response/CommentResponse";
import {
  CommentDTO,
  ReviewDTO,
} from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

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
  const navigate = useNavigate();

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
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isErrorOther) {
    return <div className="text-red-500 text-center">Error loading data</div>;
  }

  const data = otherData;
  const orderDTOs: OrderDTO[] = data?.orderDTOs || [];

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success("Hủy đơn hàng thành công");
      setIsUpdate(!isUpdate);
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    // try {
    //   await completeOrder(orderId).unwrap();
    //   toast.success("Đơn hàng đã được hoàn thành");
    //   setIsUpdate(!isUpdate);
    // } catch (error) {
    //   toast.error("Không thể hoàn thành đơn hàng");
    // }
  };

  const handleReturnOrder = async (orderId: string) => {
    // try {
    //   await returnOrder(orderId).unwrap();
    //   toast.success("Yêu cầu trả hàng đã được gửi");
    //   setIsUpdate(!isUpdate);
    // } catch (error) {
    //   toast.error("Không thể gửi yêu cầu trả hàng");
    // }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          {purchaseTabs.map((tab) => (
            <Link
              key={tab.status}
              to={{
                pathname: "/user/account/history-purchase",
                search: createSearchParams({
                  status: String(tab.status),
                }).toString(),
              }}
              className={cn(
                "flex-1 py-4 px-6 text-center transition-colors duration-200",
                {
                  "bg-blue-500 text-white": status === tab.status,
                  "hover:bg-gray-100": status !== tab.status,
                }
              )}
            >
              {tab.name}
            </Link>
          ))}
        </div>
        <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
          {orderDTOs?.map((purchase) => (
            <div key={purchase.orderId} className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Ngày đặt hàng: {formatDate(purchase.orderDate)}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {purchase.status === "PENDING"
                    ? "Đang chờ xử lý"
                    : purchase.status === "PROCESSING"
                      ? "Đang xử lý"
                      : purchase.status === "PICKUP_PENDING"
                        ? "Chờ lấy hàng"
                        : purchase.status === "SHIPPING"
                          ? "Đang giao hàng"
                          : purchase.status === "DELIVERED"
                            ? "Đã giao hàng"
                            : purchase.status === "COMPLETED"
                              ? "Hoàn thành"
                              : purchase.status === "RETURNED"
                                ? "Đã trả lại"
                                : purchase.status === "WAITING"
                                  ? "Đang thanh toán"
                                  : purchase.status === "REFUNDED"
                                    ? "Đã hoàn tiền"
                                    : purchase.status === "CANCEL"
                                      ? "Đã hủy"
                                      : purchase.status === "PAID"
                                        ? "Đã thanh toán"
                                        : purchase.status === "UNPAID"
                                          ? "Chưa thanh toán"
                                          : "Không xác định"}
                </span>
              </div>
              {purchase.orderItemDTOs.map((item: OrderItemDTO) => (
                <div
                  key={item.cartId}
                  className="flex items-center mb-4 p-4 border rounded-lg"
                >
                  <img
                    className="h-20 w-20 object-cover rounded"
                    src={item.productVariantDTO.productImage}
                    alt={item.productVariantDTO.productName}
                  />
                  <div className="ml-4 flex-grow">
                    <NavLink
                      to={`/product/${item.productVariantDTO.productId}`}
                      className="text-lg font-semibold hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.productVariantDTO.productName}
                    </NavLink>
                    <div className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.quantity * item.price)} VNĐ
                    </div>
                  </div>
                  {purchase.status === "COMPLETED" && (
                    // <ReviewButton orderItemId={item.orderItemId} />
                    <ReviewButton
                      orderItemId={item.orderItemId}
                      productId={item.productVariantDTO.productId}
                    />
                  )}
                </div>
              ))}
              <div className="mt-4 flex flex-wrap justify-between items-center">
                <div className="mb-2 sm:mb-0">
                  <span className="text-sm text-gray-600">
                    Tổng khuyến mãi:
                  </span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatPrice(
                      purchase.discountSystem + purchase.discountShop
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="mb-2 sm:mb-0">
                  <span className="text-sm text-gray-600">Tổng giá tiền:</span>
                  <span className="ml-2 font-medium text-red-600">
                    {formatPrice(purchase.paymentTotal)} VNĐ
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      navigate(`/user/account/order/${purchase.orderId}`)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    Xem chi tiết
                  </button>
                  {purchase.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelOrder(purchase.orderId)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                  {purchase.status === "DELIVERED" && (
                    <>
                      <button
                        onClick={() => handleCompleteOrder(purchase.orderId)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                      >
                        Hoàn thành
                      </button>
                      <button
                        onClick={() => handleReturnOrder(purchase.orderId)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
                      >
                        Trả lại
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const ReviewButton = ({
  orderItemId,
  productId,
}: {
  orderItemId: string;
  productId: number;
}) => {
  const { data: isReviewExistData, refetch: refetchIsReviewExist } =
    useIsReviewExistQuery(orderItemId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        {isReviewExistData ? "Xem đánh giá" : "Đánh giá"}
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isReviewExistData ? (
          <ReviewDetail
            orderItemId={orderItemId}
            productId={productId.toString()}
          />
        ) : (
          <AddReviewForm
            orderItemId={orderItemId}
            onReviewAdded={() => {
              closeModal();
              refetchIsReviewExist();
            }}
          />
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewRequest>({
    defaultValues: {
      rating: 0,
    },
  });
  const [image, setImage] = useState<File | null>(null);
  const [addReview] = useAddReviewMutation();
  const { refetch: refetchOrders } = useGetOrdersByStatusVer2Query("ALL");

  const watchRating = watch("rating");

  const onSubmit = async (data: ReviewRequest) => {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("rating", String(data.rating));
    formData.append("orderItemId", orderItemId);
    formData.append("hasImage", String(!!image));
    if (image) {
      formData.append("image", image);
    }

    try {
      await handleApiCall<ReviewResponse, ServerError>({
        callbackFn: async () => await addReview(formData),
        successCallback: (data) => {
          toast.success(data.message);
          onReviewAdded();
          refetchOrders();
        },
        errorFromServerCallback: (error) => toast.error(error.message),
        errorSerializedCallback: (error) =>
          toast.error("Đánh giá thất bại: " + error.message),
        errorCallback: (error) => toast.error("Đã xảy ra lỗi: " + error),
      });
    } catch (error) {
      toast.error("Đánh giá thất bại: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Đánh giá:
        </label>
        <div className="flex items-center space-x-1">
          <Controller
            name="rating"
            control={control}
            rules={{ required: "Vui lòng chọn số sao" }}
            render={({ field }) => (
              <>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`cursor-pointer ${
                      value <= watchRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => field.onChange(value)}
                  />
                ))}
              </>
            )}
          />
        </div>
        {errors.rating && (
          <span className="text-red-500">{errors.rating.message}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Nội dung đánh giá:
        </label>
        <textarea
          id="content"
          {...register("content", {
            required: "Nội dung đánh giá là bắt buộc",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows={4}
        ></textarea>
        {errors.content && (
          <span className="text-red-500">{errors.content.message}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Hình ảnh:
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

const ReviewDetail = ({
  orderItemId,
  productId,
}: {
  orderItemId: string;
  productId: string;
}) => {
  const { data: reviewData, refetch: refetchReview } =
    useGetReviewDetailByOrderItemIdQuery(orderItemId);
  const review = reviewData?.reviewDTO;
  const navigate = useNavigate();

  const activeReview = review && review.status === "ACTIVE" ? review : null;
  const deletedReview = review && review.status === "DELETED" ? review : null;

  if (!activeReview && deletedReview) {
    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <p className="text-red-600">Đánh giá đã bị xóa</p>
        <RatingComment review={deletedReview} refetchReview={refetchReview} />
        <button
          onClick={() => navigate(`/product/${productId}`)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Xem sản phẩm
        </button>
      </div>
    );
  }

  if (!activeReview) return <p className="text-gray-600">Chưa có đánh giá</p>;

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <RatingComment review={activeReview} refetchReview={refetchReview} />
      <button
        onClick={() => navigate(`/product/${productId}`)}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Xem sản phẩm
      </button>
    </div>
  );
};

const RatingComment = ({
  review,
  refetchReview,
}: {
  review: ReviewDTO;
  refetchReview: () => void;
}) => {
  const user = useUser();
  const [showFullText, setShowFullText] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [deleteReview] = useDeleteReviewMutation();
  const [deleteCommentByCustomer] = useDeleteCommentByCustomerMutation();
  const [addNewComment] = useAddNewCommentByCustomerMutation();

  const toggleFullText = () => setShowFullText(!showFullText);
  const toggleComments = () => setShowComments(!showComments);

  const handleReplyClick = () => setShowCommentForm(true);

  const handleCommentSubmit = async (commentData: {
    content: string;
    reviewId: string;
  }) => {
    handleApiCall<CommentResponse, ServerError>({
      callbackFn: async () => await addNewComment(commentData),
      successCallback(data) {
        setShowCommentForm(false);
        toast.success(data.message);
        refetchReview();
      },
      errorFromServerCallback(error) {
        toast.error(error.message);
        setShowCommentForm(false);
      },
      errorSerializedCallback(error) {
        console.error("Failed to add comment:", error);
        toast.error("Không thể thêm bình luận");
      },
      errorCallback(error) {
        console.error("Failed to add comment:", error);
        toast.error("Không thể thêm bình luận");
      },
    });
  };

  const handleCommentCancel = () => setShowCommentForm(false);

  const handleDeleteReview = async () => {
    // try {
    //   const res = await deleteReview(review.reviewId).unwrap();
    //   toast.success(res.message);
    //   refetchReview();
    // } catch (error) {
    //   // Assuming `toast.error` expects a string message
    //   const errorMessage =
    //     error instanceof Error ? error.message : "An unknown error occurred";
    //   toast.error(errorMessage);
    // }
    handleApiCall<ReviewResponse, ServerError>({
      callbackFn: async () => await deleteReview(review.reviewId),
      successCallback(data) {
        toast.success(data.message);
        refetchReview();
      },
      errorFromServerCallback(error) {
        toast.error(error.message);
      },
      errorSerializedCallback(error) {
        console.error("Failed to add comment:", error);
        toast.error("Không thể thêm bình luận");
      },
      errorCallback(error) {
        console.error("Failed to add comment:", error);
        toast.error("Không thể thêm bình luận");
      },
    });
  };

  const displayText = showFullText
    ? review.content
    : `${review.content.slice(0, 100)}...`;

  const commentCount = review.commentDTOs.length;

  return (
    <article className="flex flex-col max-w-xl">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            className="w-10 h-10 me-4 rounded-full"
            src={review.avatar || "/path/to/default-avatar.png"}
            alt=""
          />
          <div className="font-medium dark:text-white">
            <p>
              {review.username}{" "}
              <time
                dateTime={review.createdAt}
                className="block text-sm text-gray-500 dark:text-gray-400"
              >
                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
              </time>
            </p>
          </div>
        </div>
        {user?.username === review.username && (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <MoreVertical
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={handleDeleteReview}
                    >
                      <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
                      Xóa đánh giá
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
      <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
        <Rating rating={review.rating} />
      </div>
      <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
      {review.content.length > 100 && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          {showFullText ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
      {review.image && (
        <img
          className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
          src={review.image}
          alt=""
        />
      )}
      <aside>
        <div className="flex items-center pl-14 mt-3">
          {user?.username === review.username && (
            <button
              className="text-sm font-medium text-blue-600 hover:underline border-gray-200 md:mb-0"
              onClick={handleReplyClick}
            >
              Trả lời
            </button>
          )}
        </div>
      </aside>
      {commentCount > 0 && (
        <button
          onClick={toggleComments}
          className="flex items-center mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          {showComments ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Ẩn bình luận
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Hiển thị {commentCount} bình luận
            </>
          )}
        </button>
      )}
      {showComments && (
        <div className="mt-4 space-y-4">
          {review.commentDTOs.map((comment) => (
            <CommentReply
              key={comment.commentId}
              comment={comment}
              currentUser={user}
              refetchReview={refetchReview}
            />
          ))}
        </div>
      )}
      {showCommentForm && (
        <CommentForm
          reviewId={review.reviewId}
          onSubmit={handleCommentSubmit}
          onCancel={handleCommentCancel}
        />
      )}
      <div className="my-4 h-px w-full bg-neutral-200"></div>
      <ToastContainer />
    </article>
  );
};

const CommentReply = ({
  comment,
  currentUser,
  refetchReview,
}: {
  comment: CommentDTO;
  currentUser: CustomerDTO | null;
  refetchReview: () => void;
}) => {
  const [deleteCommentByCustomer] = useDeleteCommentByCustomerMutation();

  const handleDeleteComment = async () => {
    try {
      const res = await deleteCommentByCustomer(comment.commentId).unwrap();
      toast.success(res.message);
      refetchReview();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="ml-14 mt-4">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <img
            className="w-8 h-8 me-2 rounded-full"
            src={comment.avatar || "/path/to/default-avatar.png"}
            alt=""
          />
          <div className="font-medium dark:text-white">
            <p>
              {comment.shopName || comment.username}
              {comment.shopName && (
                <span className="ml-2 text-sm text-gray-500">
                  (Tài khoản shop)
                </span>
              )}
            </p>
          </div>
        </div>
        {currentUser?.username === comment.username && (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <MoreVertical
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={handleDeleteComment}
                    >
                      <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
                      Xóa bình luận
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
      <p className="text-sm text-gray-500">{comment.content}</p>
      <p className="text-xs text-gray-400">{comment.createDate}</p>
    </div>
  );
};

const CommentForm = ({
  reviewId,
  onSubmit,
  onCancel,
}: {
  reviewId: string;
  onSubmit: (commentData: { content: string; reviewId: string }) => void;
  onCancel: () => void;
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, reviewId });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="ml-14 mt-4">
      <textarea
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
        rows={4}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          className="px-4 py-2 mr-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
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
    document.body
  );
};

// Utility functions
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export default HistoryPurchase;

// const ReviewButton = ({ orderItemId }: { orderItemId: string }) => {
//   const { data: isReviewExistData } = useIsReviewExistQuery(orderItemId);
//   const isReviewExist = isReviewExistData;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <>
//       <button
//         onClick={openModal}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
//       >
//         {isReviewExist ? "Xem đánh giá" : "Đánh giá"}
//       </button>
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {isReviewExist ? (
//           <ReviewDetail orderItemId={orderItemId} />
//         ) : (
//           <AddReviewForm orderItemId={orderItemId} onReviewAdded={closeModal} />
//         )}
//       </Modal>
//     </>
//   );
// };

// const AddReviewForm = ({
//   orderItemId,
//   onReviewAdded,
// }: {
//   orderItemId: string;
//   onReviewAdded: () => void;
// }) => {
//   const [content, setContent] = useState("");
//   const [rating, setRating] = useState(0);
//   const [image, setImage] = useState<File | null>(null);
//   const [hasImage, setHasImage] = useState(false);
//   const [addReview] = useAddReviewMutation();
//   const { refetch: refetchOther } = useGetOrdersByStatusVer2Query("ALL");

//   const convertReviewRequestToFormData = (
//     reviewRequest: ReviewRequest
//   ): FormData => {
//     const formData = new FormData();
//     formData.append("content", reviewRequest.content);
//     formData.append("rating", String(reviewRequest.rating));
//     formData.append("orderItemId", reviewRequest.orderItemId);
//     formData.append("hasImage", String(reviewRequest.hasImage));

//     if (reviewRequest.hasImage && reviewRequest.image instanceof File) {
//       formData.append("image", reviewRequest.image);
//     }

//     return formData;
//   };

//   const handleAddReview = async (reviewRequest: ReviewRequest) => {
//     try {
//       const req = convertReviewRequestToFormData(reviewRequest);
//       handleApiCall<ReviewResponse, ServerError>({
//         callbackFn: async () => {
//           return await addReview(req);
//         },
//         successCallback: (data) => {
//           toast.success(data.message);
//         },
//         errorFromServerCallback: (error) => {
//           toast.error(error.message);
//         },
//         errorSerializedCallback: (error) => {
//           toast.error(
//             "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " +
//               (error.message || "")
//           );
//         },
//         errorCallback: (error) => {
//           toast.error(
//             "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " + error
//           );
//         },
//       });
//     } catch (error) {
//       toast.error("Đánh giá thất bại: " + error);
//     } finally {
//       refetchOther();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const reviewRequest: ReviewRequest = {
//       content,
//       rating,
//       orderItemId: orderItemId,
//       image,
//       hasImage,
//     };
//     await handleAddReview(reviewRequest);
//     onReviewAdded();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label
//           htmlFor="content"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Nội dung đánh giá:
//         </label>
//         <textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//           rows={4}
//         ></textarea>
//       </div>
//       <div>
//         <label
//           htmlFor="rating"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Đánh giá:
//         </label>
//         <select
//           id="rating"
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//         >
//           <option value={0}>Chọn đánh giá</option>
//           {[1, 2, 3, 4, 5].map((value) => (
//             <option key={value} value={value}>
//               {value} sao
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label
//           htmlFor="image"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Hình ảnh:
//         </label>
//         <input
//           type="file"
//           id="image"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setImage(file);
//               setHasImage(true);
//             }
//           }}
//           className="mt-1 block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-full file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100"
//         />
//       </div>
//       <button
//         type="submit"
//         className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
//       >
//         Đánh giá
//       </button>
//     </form>
//   );
// };

// const ReviewDetail = ({ orderItemId }: { orderItemId: string }) => {
//   const { data: reviewData } =
//     useGetReviewDetailByOrderItemIdQuery(orderItemId);
//   const review = reviewData?.reviewDTO;
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-4">
//       {review ? (
//         <RatingComment review={review} />
//       ) : (
//         <p className="text-gray-600">Chưa có đánh giá cho sản phẩm này.</p>
//       )}
//       {/* <button
//         onClick={() => navigate(`/product/${review?.productId}`)}
//         className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
//       >
//         Xem sản phẩm
//       </button> */}
//     </div>
//   );
// };

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         event.stopPropagation();
//       }
//     };

//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("keydown", handleEscapeKey);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscapeKey);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) {
//     return null;
//   }

//   return createPortal(
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="fixed inset-0 bg-black opacity-50"></div>
//       <div
//         ref={modalRef}
//         className="relative z-10 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>,
//     document.body
//   );
// };
/////////////////////////////////////
// import { cn } from "@/utils/cn";
// import {
//   NavLink,
//   Link,
//   createSearchParams,
//   useNavigate,
// } from "react-router-dom";
// import useQueryParams from "@/hooks/useQueryParams";
// import {
//   useCancelOrderMutation,
//   useGetOrdersByStatusVer2Query,
//   //   useCompleteOrderMutation,
//   //   useReturnOrderMutation,
// } from "@/redux/features/common/customer/customerApiSlice";
// import {
//   OrderDTO,
//   OrderItemDTO,
// } from "@/utils/DTOs/common/Order/Response/ListOrderResponse";
// import { useEffect, useRef, useState } from "react";
// import {
//   useAddReviewMutation,
//   useGetReviewDetailByOrderItemIdQuery,
//   useIsReviewExistQuery,
// } from "@/redux/features/common/review/reviewApiSlice";
// import { ReviewRequest } from "@/utils/DTOs/common/Review/Request/ReviewRequest";

// const purchasesStatus = {
//   ALL: 0,
//   PENDING: 1,
//   PROCESSING: 2,
//   PICKUP_PENDING: 3,
//   SHIPPING: 4,
//   DELIVERED: 5,
//   COMPLETED: 6,
//   RETURNED: 7,
//   WAITING: 8,
//   CANCEL: 9,
//   REFUNDED: 10,
//   PAID: 11,
//   UNPAID: 12,
//   FAIL: 13,
// } as const;

// const purchaseStatusString = [
//   "ALL",
//   "PENDING",
//   "PROCESSING",
//   "PICKUP_PENDING",
//   "SHIPPING",
//   "DELIVERED",
//   "COMPLETED",
//   "RETURNED",
//   "WAITING",
//   "CANCEL",
//   "REFUNDED",
//   "PAID",
//   "UNPAID",
//   "FAIL",
// ];

// const purchaseTabs = [
//   { status: purchasesStatus.ALL, name: "Tất cả" },
//   { status: purchasesStatus.PENDING, name: "Đang chờ xử lý" },
//   { status: purchasesStatus.PROCESSING, name: "Đang xử lý" },
//   { status: purchasesStatus.PICKUP_PENDING, name: "Chờ lấy hàng" },
//   { status: purchasesStatus.SHIPPING, name: "Đang giao" },
//   { status: purchasesStatus.DELIVERED, name: "Đã giao" },
//   { status: purchasesStatus.COMPLETED, name: "Hoàn thành" },
//   { status: purchasesStatus.RETURNED, name: "Đã trả lại" },
//   { status: purchasesStatus.CANCEL, name: "Đã hủy" },
//   { status: purchasesStatus.REFUNDED, name: "Đã hoàn tiền" },
//   { status: purchasesStatus.PAID, name: "Đã thanh toán" },
//   { status: purchasesStatus.UNPAID, name: "Chưa thanh toán" },
//   { status: purchasesStatus.WAITING, name: "Đang thanh toán" },
// ];

// export const HistoryPurchase = () => {
//   const queryParams: { status?: string } = useQueryParams();
//   const status: number = Number(queryParams.status) || purchasesStatus.ALL;

//   const [isUpdate, setIsUpdate] = useState(false);
//   const statusString = purchaseStatusString[status];

//   const {
//     data: otherData,
//     isLoading: isLoadingOther,
//     isError: isErrorOther,
//     refetch: refetchOther,
//   } = useGetOrdersByStatusVer2Query(statusString);

//   const [cancelOrder] = useCancelOrderMutation();

//   const refetchData = async () => {
//     await refetchOther();
//   };

//   useEffect(() => {
//     refetchData();
//   }, [isUpdate, status]);

//   if (isLoadingOther) {
//     return <div>Loading...</div>;
//   }

//   if (isErrorOther) {
//     return <div>Error loading data</div>;
//   }

//   const data = otherData;

//   const orderDTOs: OrderDTO[] = data?.orderDTOs || [];

//   const handleCancelOrder = async (orderId: string) => {
//     try {
//       await cancelOrder(orderId);
//       alert("Hủy đơn hàng thành công");
//       setIsUpdate(!isUpdate);
//     } catch (error) {
//       alert("Hủy đơn hàng thất bại");
//     }
//   };

//   const handleCompleteOrder = async (orderId: string) => {
//     console.log(orderId);
//   };

//   const handleReturnOrder = async (orderId: string) => {
//     console.log("Return order");
//     console.log(orderId);
//   };

//   const formatPrice = (price: number) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };

//   const purchaseTabsLink = purchaseTabs.map((tab) => (
//     <Link
//       key={tab.status}
//       to={{
//         pathname: "/user/account/history-purchase",
//         search: createSearchParams({
//           status: String(tab.status),
//         }).toString(),
//       }}
//       className={cn(
//         "flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
//         {
//           "border-orange-600 text-orange-600": status === tab.status,
//           "border-b-black/10 text-gray-900": status !== tab.status,
//         },
//       )}
//     >
//       {tab.name}
//     </Link>
//   ));

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   return (
//     <div className="overflow-x-auto">
//       <div className="min-w-[700px]">
//         <div className="sticky top-0 flex rounded-t-sm shadow-sm">
//           {purchaseTabsLink}
//         </div>
//         <div>
//           {orderDTOs?.map((purchase) => (
//             <div
//               key={purchase.orderId}
//               className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm"
//             >
//               {purchase.orderItemDTOs.map((item: OrderItemDTO) => (
//                 <div>
//                   <NavLink
//                     to={`/user/account/order/${purchase.orderId}`}
//                     className="flex"
//                     key={item.cartId}
//                   >
//                     <div className="flex-shrink-0">
//                       <img
//                         className="h-20 w-20 object-cover"
//                         src={item.productVariantDTO.productImage}
//                         alt={item.productVariantDTO.productName}
//                       />
//                     </div>
//                     <div className="ml-3 flex-grow overflow-hidden">
//                       <div className="truncate">
//                         {item.productVariantDTO.productName}
//                       </div>
//                       <div className="mt-3">x{item.quantity}</div>
//                     </div>
//                     <div className="ml-3 flex-shrink-0">
//                       <span className="ml-2 truncate text-orange">
//                         {formatPrice(item.quantity * item.price)} VNĐ
//                       </span>
//                     </div>
//                   </NavLink>
//                   {purchase.status === "COMPLETED" && (
//                     <ReviewButton orderItemId={item.orderItemId} />
//                   )}
//                 </div>
//               ))}
//               <div className="flex justify-end">
//                 <span className="mr-4">
//                   Ngày đặt hàng: {formatDate(purchase.orderDate)}
//                 </span>
//                 {purchase.status === "PENDING" && (
//                   <button
//                     onClick={() => handleCancelOrder(purchase.orderId)}
//                     type="button"
//                     className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-yellow-500 hover:bg-yellow-100 hover:text-yellow-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-yellow-800/30 dark:hover:text-yellow-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                   >
//                     Hủy
//                   </button>
//                 )}
//                 {purchase.status === "DELIVERED" && (
//                   <>
//                     <button
//                       onClick={() => handleCompleteOrder(purchase.orderId)}
//                       type="button"
//                       className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-green-500 hover:bg-green-100 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-green-800/30 dark:hover:text-green-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
//                     >
//                       Hoàn thành
//                     </button>
//                     <button
//                       onClick={() => handleReturnOrder(purchase.orderId)}
//                       type="button"
//                       className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-red-500 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                     >
//                       Trả lại
//                     </button>
//                   </>
//                 )}
//                 <div className="mr-4">
//                   <span>Tổng khuyến mãi</span>
//                   <span className="ml-4 text-xl text-orange">
//                     {formatPrice(
//                       purchase.discountSystem + purchase.discountShop,
//                     )}{" "}
//                     VNĐ
//                   </span>
//                 </div>
//                 <div>
//                   <span>Tổng giá tiền</span>
//                   <span className="ml-4 text-xl text-orange">
//                     {formatPrice(purchase.paymentTotal)} VNĐ
//                   </span>
//                 </div>

//                 <div className="ml-4">
//                   <span>
//                     {" "}
//                     Trạng thái:{" "}
//                     {purchase?.status === "PENDING"
//                       ? "Đang chờ xử lý"
//                       : purchase?.status === "PROCESSING"
//                         ? "Đang xử lý"
//                         : purchase?.status === "PICKUP_PENDING"
//                           ? "Chờ lấy hàng"
//                           : purchase?.status === "SHIPPING"
//                             ? "Đang giao hàng"
//                             : purchase?.status === "DELIVERED"
//                               ? "Đã giao hàng"
//                               : purchase?.status === "COMPLETED"
//                                 ? "Hoàn thành"
//                                 : purchase?.status === "RETURNED"
//                                   ? "Đã trả lại"
//                                   : purchase?.status === "WAITING"
//                                     ? "Đang thanh toán"
//                                     : purchase?.status === "REFUNDED"
//                                       ? "Đã hoàn tiền"
//                                       : purchase?.status === "CANCEL"
//                                         ? "Đã hủy"
//                                         : purchase?.status === "PAID"
//                                           ? "Đã thanh toán"
//                                           : purchase?.status === "UNPAID"
//                                             ? "Chưa thanh toán"
//                                             : "Không xác định"}
//                   </span>
//                 </div>
//               </div>
//               <div className="h-[50px] bg-gray-300"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// const ReviewButton = ({ orderItemId }: { orderItemId: string }) => {
//   console.log(orderItemId);
//   const { data: isReviewExistData } = useIsReviewExistQuery(orderItemId);
//   const isReviewExist = isReviewExistData;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     console.log(isReviewExist);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <button
//         onClick={openModal}
//         className="py-3 z-40 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-blue-500 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
//       >
//         {isReviewExist ? "Xem đánh giá" : "Đánh giá"}
//       </button>
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {isReviewExist ? (
//           <ReviewDetail orderItemId={orderItemId} />
//         ) : (
//           <AddReviewForm orderItemId={orderItemId} onReviewAdded={closeModal} />
//         )}
//       </Modal>
//     </>
//   );
// };

// const AddReviewForm = ({
//   orderItemId,
//   onReviewAdded,
// }: {
//   orderItemId: string;
//   onReviewAdded: () => void;
// }) => {
//   const [content, setContent] = useState("");
//   const [rating, setRating] = useState(0);
//   const [image, setImage] = useState<File | null>(null);
//   const [hasImage, setHasImage] = useState(false);
//   const [addReview] = useAddReviewMutation();
//   const { refetch: refetchOther } = useGetOrdersByStatusVer2Query("ALL");

//   const convertReviewRequestToFormData = (
//     reviewRequest: ReviewRequest,
//   ): FormData => {
//     const formData = new FormData();
//     formData.append("content", reviewRequest.content);
//     formData.append("rating", String(reviewRequest.rating));
//     formData.append("orderItemId", reviewRequest.orderItemId);
//     formData.append("hasImage", String(reviewRequest.hasImage));

//     if (reviewRequest.hasImage && reviewRequest.image instanceof File) {
//       formData.append("image", reviewRequest.image);
//     }

//     return formData;
//   };

//   const handleAddReview = async (reviewRequest: ReviewRequest) => {
//     try {
//       const req = convertReviewRequestToFormData(reviewRequest);
//       // console.log(req);
//       // const res = await addReview(req).unwrap();
//       // alert(res.message)
//       // refetchOther();

//       handleApiCall<ReviewResponse, ServerError>({
//         callbackFn: async () => {
//           return await addReview(req);
//         },
//         successCallback: (data) => {
//           // toast.success("Cập nhật thông tin thành công!");
//           toast.success(data.message);
//           refetchOther();
//         },
//         errorFromServerCallback: (error) => {
//           if (error.status === "NOT_FOUND") {
//             toast.error(error.message);
//           }
//           if (error.status === "BAD_REQUEST") {
//             toast.error(error.message);
//           }
//         },
//         errorSerializedCallback: (error) => {
//           if (error.message) {
//             toast.error(
//               "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " +
//                 error.message,
//             );
//           } else {
//             toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
//           }
//         },
//         errorCallback: (error) => {
//           toast.error(
//             "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau. " + error,
//           );
//         },
//       });
//     } catch (error) {
//       alert("Đánh giá thất bại");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const reviewRequest: ReviewRequest = {
//       content,
//       rating,
//       orderItemId: orderItemId,
//       image,
//       hasImage,
//     };
//     await handleAddReview(reviewRequest);
//     onReviewAdded();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="content">Nội dung đánh giá:</label>
//         <textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//         ></textarea>
//       </div>
//       <div>
//         <label htmlFor="rating">Đánh giá:</label>
//         <select
//           id="rating"
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//           required
//         >
//           <option value={0}>Chọn đánh giá</option>
//           <option value={1}>1 sao</option>
//           <option value={2}>2 sao</option>
//           <option value={3}>3 sao</option>
//           <option value={4}>4 sao</option>
//           <option value={5}>5 sao</option>
//         </select>
//       </div>
//       <div>
//         <label htmlFor="image">Hình ảnh:</label>
//         <input
//           type="file"
//           id="image"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setImage(file);
//               setHasImage(true);
//             }
//           }}
//         />
//       </div>
//       <button type="submit">Đánh giá</button>
//     </form>
//   );
// };

// const ReviewDetail = ({ orderItemId }: { orderItemId: string }) => {
//   const { data: reviewData } =
//     useGetReviewDetailByOrderItemIdQuery(orderItemId);
//   const review = reviewData?.reviewDTO;

//   const navigate = useNavigate();

//   return (
//     <div>
//       {review ? (
//         <RatingComment review={review} />
//       ) : (
//         <p>Chưa có đánh giá cho sản phẩm này.</p>
//       )}
//       <button onClick={() => navigate(`/product/${review?.orderItemId}`)}>
//         Xem sản phẩm
//       </button>
//     </div>
//   );
// };

// import { createPortal } from "react-dom";
// import { RatingComment } from "../../ProductDetail/ProductReviews/CommentList/RatingComment";
// import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
// import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";
// import { ServerError } from "@/utils/DTOs/common/ServerError";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         event.stopPropagation();
//       }
//     };

//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("keydown", handleEscapeKey);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscapeKey);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) {
//     return null;
//   }

//   return createPortal(
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="fixed inset-0 bg-black opacity-50"></div>
//       <div
//         ref={modalRef}
//         className="relative z-10 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-800"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>,
//     document.body,
//   );
// };
