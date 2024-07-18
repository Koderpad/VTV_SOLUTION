import {
  ProductResponse,
  ProductVariantDTO,
} from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useAddNewCartMutation,
  useGetListCartByUsernameQuery,
} from "../../../../redux/features/common/cart/cartApiSlice";
import { InputQuantity } from "../../../molecules/Inputs/InputQuantity";
import {
  useAddFavoriteProductMutation,
  useCheckFavoriteProductExistsQuery,
  useDeleteFavoriteProductMutation,
} from "@/redux/features/common/favorite_product/favoriteProductApiSlice";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CreditCardIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { requestOpenChat } from "@/redux/features/common/chat/chatSlice";
import { useCreateOrderByProductVariantMutation } from "@/redux/features/common/order/orderApiSlice";
import { AdditionalProps } from "@/utils/DTOs/common/Order/AdditionalProps";
import { AES } from "crypto-js";
import { Button } from "@/components/ui/button";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailProps {
  data: ProductResponse;
}

const getAvailableVariants = (
  selectedAttributes: { [key: string]: string },
  productVariants: ProductVariantDTO[],
): ProductVariantDTO[] => {
  return productVariants.filter((variant) => {
    return variant.attributeDTOs.every(
      (attribute) =>
        selectedAttributes[attribute.name] === attribute.value ||
        !selectedAttributes[attribute.name],
    );
  });
};

const getAvailableAttributeValues = (
  attributeName: string,
  availableVariants: ProductVariantDTO[],
): string[] => {
  const attributeValues = new Set<string>();
  availableVariants.forEach((variant) => {
    const attribute = variant.attributeDTOs.find(
      (attr) => attr.name === attributeName,
    );
    if (attribute) {
      attributeValues.add(attribute.value);
    }
  });
  return Array.from(attributeValues);
};
const getSelectedVariant = (
  selectedAttributes: { [key: string]: string },
  productVariants: ProductVariantDTO[],
): ProductVariantDTO | undefined => {
  return productVariants.find((variant) =>
    variant.attributeDTOs.every(
      (attribute) => selectedAttributes[attribute.name] === attribute.value,
    ),
  );
};

const FavoriteButton = ({ productId }: { productId: number }) => {
  const navigate = useNavigate();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: favoriteProductData, refetch: refetchFavoProduct } =
    useCheckFavoriteProductExistsQuery(productId, {
      skip: !isAuth, // Skip the query if the user is not authenticated
    });

  const [addFavoriteProduct] = useAddFavoriteProductMutation();
  const [deleteFavoriteProduct] = useDeleteFavoriteProductMutation();

  const handleFavoriteClick = () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (favoriteProductData?.favoriteProductDTO) {
      deleteFavoriteProduct(
        favoriteProductData.favoriteProductDTO.favoriteProductId,
      ).then(() => refetchFavoProduct());
    } else {
      addFavoriteProduct(productId).then(() => refetchFavoProduct());
    }
  };

  const isFavorite = isAuth && favoriteProductData?.favoriteProductDTO !== null;

  return (
    <button
      className="flex items-center justify-center space-x-2 rounded-full border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-100 transition duration-300"
      onClick={handleFavoriteClick}
    >
      <HeartIcon
        className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-blue-600"}`}
      />
      <span>{isFavorite ? "Đã thích" : "Yêu thích"}</span>
    </button>
  );
};

export const ProductDetail = ({ data }: ProductDetailProps) => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuantity_ForAddToCart, setSelectedQuantity_ForAddToCart] =
    useState(1);
  const [productPrice, setProductPrice] = useState(data.productDTO.minPrice);

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [availableVariants, setAvailableVariants] = useState<
    ProductVariantDTO[]
  >(data.productDTO.productVariantDTOs);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDTO | null>(null);
  const navigate = useNavigate();
  const [addNewCart] = useAddNewCartMutation();

  const [createOrderByProductVariant] =
    useCreateOrderByProductVariantMutation();

  const isAuth: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const { refetch: refetch_ } = useGetListCartByUsernameQuery(undefined, {
    skip: !isAuth,
  });

  const dataImage = Array.from(
    new Set([
      data.productDTO.image,
      ...data.productDTO.productVariantDTOs.map((variant) => variant.image),
    ]),
  ).filter((image): image is string => !!image);

  // const attributeList = data.productDTO.productVariantDTOs.reduce<
  //   { name: string; values: string[] }[]
  // >((acc, variant) => {
  //   variant.attributeDTOs.forEach((attribute) => {
  //     const existingAttribute = acc.find(
  //       (attr) => attr.name === attribute.name,
  //     );
  //     if (existingAttribute) {
  //       if (!existingAttribute.values.includes(attribute.value)) {
  //         existingAttribute.values.push(attribute.value);
  //       }
  //     } else {
  //       acc.push({ name: attribute.name, values: [attribute.value] });
  //     }
  //   });
  //   return acc;
  // }, []);

  useEffect(() => {
    const availableVariants = getAvailableVariants(
      selectedAttributes,
      data.productDTO.productVariantDTOs,
    );
    const selectedVariant = availableVariants.find((variant) =>
      variant.attributeDTOs.every(
        (attribute) => selectedAttributes[attribute.name] === attribute.value,
      ),
    );
    if (selectedVariant) {
      setProductPrice(selectedVariant.price);
    } else {
      setProductPrice(data.productDTO.minPrice);
    }
  }, [selectedAttributes, data.productDTO]);

  // const selectedVariant = getSelectedVariant(
  //   selectedAttributes,
  //   data.productDTO.productVariantDTOs,
  // );
  // const handleAttributeClick = (attributeName: string, value: string) => {
  //   setSelectedAttributes((prevSelectedAttributes) => {
  //     if (prevSelectedAttributes[attributeName] === value) {
  //       const { [attributeName]: _, ...rest } = prevSelectedAttributes;
  //       return rest;
  //     } else {
  //       return { ...prevSelectedAttributes, [attributeName]: value };
  //     }
  //   });
  // };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePrevImage = () => {
    setSelectedImage((prevIndex) =>
      prevIndex === 0 ? dataImage.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex) =>
      prevIndex === dataImage.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleAddToCart = async () => {
    if (!isAuth) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng", {
        onClose: () => navigate("/login"),
        autoClose: 1000,
      });
      return;
    }

    const availableVariants = getAvailableVariants(
      selectedAttributes,
      data.productDTO.productVariantDTOs,
    );
    const selectedVariant = availableVariants.find((variant) =>
      variant.attributeDTOs.every(
        (attribute) => selectedAttributes[attribute.name] === attribute.value,
      ),
    );

    if (!selectedVariant) {
      toast.error("Vui lòng chọn đầy đủ thuộc tính của sản phẩm");
      return;
    }

    try {
      const response = await addNewCart({
        productVariantId: selectedVariant.productVariantId,
        quantity: selectedQuantity,
      }).unwrap();

      if (response && "data" in response) {
        const responseData = response.data;

        if (responseData.status === "Success") {
          toast.success(`🦄 ${responseData.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
          });
        } else {
          toast.error(
            responseData.message ||
              "Thêm vào giỏ hàng thất bại. Vui lòng thử lại.",
          );
        }
      } else {
        toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(error.data.message);
    } finally {
      refetch_();
    }
  };

  const handleRepurchase = async () => {
    const availableVariants = getAvailableVariants(
      selectedAttributes,
      data.productDTO.productVariantDTOs,
    );
    const selectedVariant = availableVariants.find((variant) =>
      variant.attributeDTOs.every(
        (attribute) => selectedAttributes[attribute.name] === attribute.value,
      ),
    );

    if (!selectedVariant) {
      toast.error("Vui lòng chọn đầy đủ thuộc tính của sản phẩm");
      return;
    }
    const additionalProps: AdditionalProps = {
      [selectedVariant?.productVariantId.toString() || ""]: selectedQuantity,
    };
    await handleCreateOrder(additionalProps);
    console.log(additionalProps);
  };
  const handleCreateOrder = async (productVariantIdsAndQuantities: {
    [productVariantId: string]: number;
  }) => {
    try {
      const orderCreationResult = await createOrderByProductVariant(
        productVariantIdsAndQuantities,
      );
      if ("data" in orderCreationResult) {
        // Handle successful order creation
        const result = orderCreationResult.data;

        // Encrypt state
        const stateString = JSON.stringify(result);
        const encryptedState = AES.encrypt(
          stateString,
          "vtv-secret-key-2024",
        ).toString();
        const urlSafeEncryptedState = encodeURIComponent(encryptedState);
        console.log("urlSafeEncryptedState: ", urlSafeEncryptedState);

        // Navigate to checkout page with encrypted state
        navigate(`/checkout-variant?state=${urlSafeEncryptedState}`);
      } else {
        const error = orderCreationResult.error;
        if ("status" in error) {
          // Server error (FetchBaseQueryError)
          const serverError = error.data as ServerError;
          if (
            serverError.status === "NOT_FOUND" &&
            serverError.message === "Thông báo: Khách hàng chưa có địa chỉ nào."
          ) {
            alert(serverError.message);
            // You might want to navigate to the address page here
            // navigate("/user/account/address");
          } else {
            alert(`Lỗi từ server: ${serverError.message}`);
          }
        } else {
          // Unidentified error (SerializedError)
          alert("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // show info and des product
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleInfo = () => {
    setShowFullInfo(!showFullInfo);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    updateAvailableVariants();
  }, [selectedAttributes]);

  const updateAvailableVariants = () => {
    const filteredVariants = data.productDTO.productVariantDTOs.filter(
      (variant) =>
        Object.entries(selectedAttributes).every(([name, value]) =>
          variant.attributeDTOs.some(
            (attr) => attr.name === name && attr.value === value,
          ),
        ),
    );
    setAvailableVariants(filteredVariants);

    if (filteredVariants.length === 1) {
      setSelectedVariant(filteredVariants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const handleAttributeClick = (name: string, value: string) => {
    setSelectedAttributes((prev) => {
      if (prev[name] === value) {
        // If the same value is clicked, remove it
        const { [name]: _, ...rest } = prev;
        return rest;
      } else {
        // Otherwise, update or add the new value
        return { ...prev, [name]: value };
      }
    });
  };

  const getAvailableAttributeValues = (attributeName: string) => {
    return Array.from(
      new Set(
        availableVariants
          .flatMap((variant) => variant.attributeDTOs)
          .filter((attr) => attr.name === attributeName)
          .map((attr) => attr.value),
      ),
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN");
  };

  const renderPrice = () => {
    if (selectedVariant) {
      const { price, originalPrice, discountPercent } = selectedVariant;
      if (price === originalPrice || discountPercent === "0%") {
        return (
          <span className="text-2xl text-red-600 font-bold">
            {formatPrice(price)} VNĐ
          </span>
        );
      } else {
        return (
          <div>
            <span className="text-2xl text-red-600 font-bold">
              {formatPrice(price)} VNĐ
            </span>
            <span className="ml-2 text-lg text-gray-500 line-through ">
              {formatPrice(originalPrice)} VNĐ
            </span>
            <span className="text-xl ml-2 text-red-500">{discountPercent}</span>
          </div>
        );
      }
    } else {
      const minPrice = Math.min(...availableVariants.map((v) => v.price));
      const maxPrice = Math.max(...availableVariants.map((v) => v.price));
      if (minPrice === maxPrice) {
        return (
          <span className="text-2xl text-red-600 font-bold">
            {formatPrice(minPrice)} VNĐ
          </span>
        );
      } else {
        return (
          <span className="text-2xl text-red-600 font-bold">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)} VNĐ
          </span>
        );
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedVariant) return;

    const value = e.target.value;
    // Allow empty input for better UX
    if (value === "") {
      setSelectedQuantity(0);
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      setSelectedQuantity(1);
    } else if (numValue > selectedVariant.quantity) {
      setSelectedQuantity(selectedVariant.quantity);
    } else {
      setSelectedQuantity(numValue);
    }
  };

  const renderQuantityInput = () => {
    if (!selectedVariant) return null;

    return (
      <div className="mt-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Số lượng
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            name="quantity"
            id="quantity"
            className=" focus:ring-indigo-500 focus:border-indigo-500 border border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-xl "
            value={selectedQuantity}
            onChange={handleQuantityChange}
            onBlur={() => {
              // Ensure a valid value on blur
              if (selectedQuantity === 0) setSelectedQuantity(1);
            }}
            min={1}
            max={selectedVariant.quantity}
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-lg">
            / {selectedVariant.quantity} sản phẩm có sẵn
          </span>
        </div>
      </div>
    );
  };

  const attributeList = data.productDTO.productVariantDTOs.reduce<
    { name: string; values: string[] }[]
  >((acc, variant) => {
    variant.attributeDTOs.forEach((attribute) => {
      const existingAttribute = acc.find(
        (attr) => attr.name === attribute.name,
      );
      if (existingAttribute) {
        if (!existingAttribute.values.includes(attribute.value)) {
          existingAttribute.values.push(attribute.value);
        }
      } else {
        acc.push({ name: attribute.name, values: [attribute.value] });
      }
    });
    return acc;
  }, []);

  const renderContent = (content: string, showFull: boolean, type: string) => {
    const words = content.trim().split(/\s+/);
    const wordCount = words.length;
    const displayedContent = showFull
      ? words.join(" ")
      : words.slice(0, 200).join(" ");

    return (
      <>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: displayedContent }}
        />
        {wordCount > 200 && (
          <button
            className="mt-2 text-blue-600 hover:underline"
            onClick={type === "info" ? toggleInfo : toggleDescription}
          >
            {showFull ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </>
    );
  };

  const handleChatNow = () => {
    dispatch(requestOpenChat(data.usernameShop));
  };
  return (
    <>
      <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
        <h1 className="text-2xl font-semibold">Chi tiết sản phẩm</h1>
        <div className="flex flex-row lg:gap-8 w-full">
          {/* Image section */}
          <div className="h-full w-1/2 basis-full lg:basis-4/6">
            {/* Main image */}
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
              <img
                alt={`${data.productDTO.name} - ${dataImage[selectedImage]}`}
                fetchpriority="high"
                decoding="async"
                data-nimg="fill"
                className="h-full w-full object-contain"
                sizes="(min-width: 1024px) 66vw, 100vw"
                src={dataImage[selectedImage]}
                style={{
                  height: "100%",
                  width: "100%",
                  inset: "0px",
                  color: "transparent",
                }}
              />
              {/* Image navigation */}
              <div className="absolute bottom-[15%] flex w-full justify-center">
                <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                  <button
                    aria-label="Previous product image"
                    className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
                    onClick={handlePrevImage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      ></path>
                    </svg>
                  </button>
                  <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                  <button
                    aria-label="Next product image"
                    className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
                    onClick={handleNextImage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Thumbnail images */}
            <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-scroll py-1 lg:mb-0 max-w-full">
              <li className="h-20 w-40 flex-shrink-0"></li>
              {dataImage.map((image, index) => (
                <li
                  key={index}
                  className={`h-20 w-20  flex-shrink-0 transition-all duration-500 ${
                    selectedImage === index
                      ? "h-32 w-32"
                      : `${
                          Math.abs(selectedImage - index) === 1
                            ? "h-24 w-24"
                            : "h-20 w-20"
                        }`
                  }`}
                >
                  <button
                    aria-label="Enlarge product image"
                    className="h-full w-full"
                    onClick={() => handleImageClick(index)}
                  >
                    <div
                      className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black ${
                        selectedImage === index
                          ? "border-2 border-blue-600"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        alt={`${data.productDTO.name} - ${image}`}
                        loading="lazy"
                        width="80"
                        height="80"
                        decoding="async"
                        data-nimg="1"
                        className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
                        style={{
                          color: "transparent",
                        }}
                        src={image}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Product details section */}
          <div className="mx-1 h-full w-px bg-neutral-200"></div>
          <div className="basis-full  lg:basis-2/6">
            {/* Product name and price */}
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl leading-6 font-bold text-gray-900">
                {data.productDTO.name}
              </h1>
              {renderPrice()}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {attributeList.map(({ name, values }) => (
                  <div
                    key={name}
                    className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-gray-500">
                      {name}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => {
                          const isAvailable =
                            getAvailableAttributeValues(name).includes(value);
                          const isSelected = selectedAttributes[name] === value;

                          return (
                            <button
                              key={value}
                              onClick={() =>
                                isAvailable && handleAttributeClick(name, value)
                              }
                              className={`px-3 py-1 rounded-full text-sm ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : isAvailable
                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              disabled={!isAvailable}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {/* Quantity input */}
            <div className="mb-8">
              {/* <InputQuantity */}
              {/*   quantity={selectedQuantity_ForAddToCart} */}
              {/*   setQuantity={setSelectedQuantity_ForAddToCart} */}
              {/*   minQuantity={1} */}
              {/* /> */}
              {renderQuantityInput()}
            </div>
            {/* Add to cart button */}
            {/* <button */}
            {/*   aria-label="Add to cart" */}
            {/*   aria-disabled="false" */}
            {/*   className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90" */}
            {/*   onClick={handleAddToCart} */}
            {/* > */}
            {/*   <div className="absolute left-0 ml-4"> */}
            {/*     <svg */}
            {/*       xmlns="http://www.w3.org/2000/svg" */}
            {/*       fill="none" */}
            {/*       viewBox="0 0 24 24" */}
            {/*       strokeWidth="1.5" */}
            {/*       stroke="currentColor" */}
            {/*       aria-hidden="true" */}
            {/*       data-slot="icon" */}
            {/*       className="h-5" */}
            {/*     > */}
            {/*       <path */}
            {/*         strokeLinecap="round" */}
            {/*         strokeLinejoin="round" */}
            {/*         d="M12 4.5v15m7.5-7.5h-15" */}
            {/*       ></path> */}
            {/*     </svg> */}
            {/*   </div> */}
            {/*   Thêm vào giỏ hàng */}
            {/* </button> */}
            {/* <button */}
            {/*   aria-label="Add to cart" */}
            {/*   aria-disabled="false" */}
            {/*   className="relative flex w-full items-center justify-center rounded-full bg-red-600 p-4 tracking-wide text-white hover:opacity-90" */}
            {/*   onClick={handleRepurchase} */}
            {/* > */}
            {/*   <div className="absolute left-0 ml-4"> */}
            {/*     <svg */}
            {/*       xmlns="http://www.w3.org/2000/svg" */}
            {/*       fill="none" */}
            {/*       viewBox="0 0 24 24" */}
            {/*       strokeWidth="1.5" */}
            {/*       stroke="currentColor" */}
            {/*       aria-hidden="true" */}
            {/*       data-slot="icon" */}
            {/*       className="h-5" */}
            {/*     > */}
            {/*       <path */}
            {/*         strokeLinecap="round" */}
            {/*         strokeLinejoin="round" */}
            {/*         d="M12 4.5v15m7.5-7.5h-15" */}
            {/*       ></path> */}
            {/*     </svg> */}
            {/*   </div> */}
            {/*   Mua ngay */}
            {/* </button> */}
            <div className="flex flex-col space-y-4">
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                onClick={handleRepurchase}
              >
                <CreditCardIcon className="mr-2 h-5 w-5" />
                Mua ngay
              </Button>
            </div>
            <div className="mt-4 flex justify-center">
              <FavoriteButton productId={data.productDTO.productId} />
            </div>
          </div>
        </div>
      </div>

      {/* Shop info */}
      <div className="flex justify-between mt-8 rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-center">
          <img
            src={data.shopAvatar}
            alt={data.shopName}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="text-lg font-medium">{data.shopName}</h2>
            <p className="text-sm text-neutral-500">
              Số đơn hàng: {data.countOrder}
            </p>
          </div>
        </div>
        <div className="order-last mt-4 flex space-x-4">
          <button
            className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleChatNow}
          >
            Chat ngay
          </button>
          <button
            className="rounded-full border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-100"
            onClick={() => navigate(`/${data.usernameShop}.shop`)}
          >
            Xem shop
          </button>
        </div>
      </div>

      {/* Product information and description */}
      <CollapsibleTextarea
        content={data.productDTO.information}
        title="Thông tin sản phẩm"
      />
      <CollapsibleTextarea
        content={data.productDTO.description}
        title="Mô tả sản phẩm"
      />
      <ToastContainer />
    </>
  );
};

interface CollapsibleTextareaProps {
  content: string;
  title: string;
  maxLength?: number;
}

export const CollapsibleTextarea: React.FC<CollapsibleTextareaProps> = ({
  content,
  title,
  maxLength = 300,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const displayContent = isExpanded
    ? content
    : content.slice(0, maxLength) + "...";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [displayContent]);

  return (
    <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-medium">{title}</h2>
      <textarea
        ref={textareaRef}
        value={displayContent}
        readOnly
        className="w-full min-h-[100px] mb-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none"
      />
      {content.length > maxLength && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpand}
          className="mt-2 flex items-center"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUpIcon className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Xem thêm <ChevronDownIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
