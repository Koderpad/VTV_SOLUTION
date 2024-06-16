import {
  ProductResponse,
  ProductVariantDTO,
} from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddNewCartMutation } from "../../../redux/features/common/cart/cartApiSlice";
import { InputQuantity } from "../../molecules/Inputs/InputQuantity";

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
export const ProductDetail = ({ data }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuantity_ForAddToCart, setSelectedQuantity_ForAddToCart] =
    useState(1);
  const [productPrice, setProductPrice] = useState(data.productDTO.minPrice);

  const navigate = useNavigate();
  const [addNewCart] = useAddNewCartMutation();
  const isAuth: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const dataImage = Array.from(
    new Set([
      data.productDTO.image,
      ...data.productDTO.productVariantDTOs.map((variant) => variant.image),
    ]),
  ).filter((image): image is string => !!image);

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

  const selectedVariant = getSelectedVariant(
    selectedAttributes,
    data.productDTO.productVariantDTOs,
  );
  const handleAttributeClick = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelectedAttributes) => {
      if (prevSelectedAttributes[attributeName] === value) {
        const { [attributeName]: _, ...rest } = prevSelectedAttributes;
        return rest;
      } else {
        return { ...prevSelectedAttributes, [attributeName]: value };
      }
    });
  };

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
        quantity: selectedQuantity_ForAddToCart,
      });

      if (response && "data" in response) {
        const responseData = response.data;

        if (responseData.status === "success") {
          toast.success(
            responseData.message || "Thêm vào giỏ hàng thành công!",
          );
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
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
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

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

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
            <div className="mb-6 flex flex-col border-b pb-6">
              <h1 className="mb-2 text-3xl font-medium">
                {data.productDTO.name}
              </h1>
              <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
                {selectedVariant ? (
                  <p>
                    ${selectedVariant.price}
                    <span className="ml-1 inline">VND</span>
                  </p>
                ) : (
                  <p>
                    ${data.productDTO.minPrice} - ${data.productDTO.maxPrice}
                    <span className="ml-1 inline">VND</span>
                  </p>
                )}
              </div>
            </div>
            {/* Product attributes */}
            {attributeList.map(({ name, values }) => (
              <dl key={name} className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide">{name}</dt>
                <dd className="flex flex-wrap gap-3">
                  {values.map((value) => {
                    const availableVariants = getAvailableVariants(
                      selectedAttributes,
                      data.productDTO.productVariantDTOs,
                    );
                    console.log("Available Variants: ", availableVariants);
                    const isAvailable = getAvailableAttributeValues(
                      name,
                      availableVariants,
                    ).includes(value);
                    console.log(
                      "Get Available Attribute Values: ",
                      getAvailableAttributeValues(name, availableVariants),
                    );
                    console.log("Is Available: ", isAvailable);
                    const isSelected = selectedAttributes[name] === value;

                    return (
                      <button
                        key={value}
                        aria-disabled={!isAvailable}
                        title={`${name} ${value}${
                          !isAvailable ? " (Hết hàng)" : ""
                        }`}
                        className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm ${
                          !isAvailable
                            ? "dark:border-neutral-800 relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
                            : isSelected
                              ? "cursor-default ring-2 ring-blue-600"
                              : "ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
                        }`}
                        onClick={() =>
                          isAvailable && handleAttributeClick(name, value)
                        }
                      >
                        {value}
                      </button>
                    );
                  })}
                </dd>
              </dl>
            ))}
            {/* Quantity input */}
            <div className="mb-8">
              <InputQuantity
                quantity={selectedQuantity_ForAddToCart}
                setQuantity={setSelectedQuantity_ForAddToCart}
                minQuantity={1}
              />
            </div>
            {/* Add to cart button */}
            <button
              aria-label="Add to cart"
              aria-disabled="false"
              className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
              onClick={handleAddToCart}
            >
              <div className="absolute left-0 ml-4">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>
              </div>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <ToastContainer />
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
          <button className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
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
      {/* Product information and description */}
      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-medium">Thông tin sản phẩm</h2>
        {renderContent(data.productDTO.information, showFullInfo, "info")}
      </div>
      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-medium">Mô tả sản phẩm</h2>
        {renderContent(
          data.productDTO.description,
          showFullDescription,
          "desc",
        )}
      </div>
    </>
  );
};
// import {
//   ProductDTO,
//   ProductResponse,
// } from "@/utils/DTOs/common/Product/Response/ProductResponse";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useAddNewCartMutation } from "../../../redux/features/common/cart/cartApiSlice";
// import { InputQuantity } from "../../molecules/Inputs/InputQuantity";
//
// interface ProductDetailProps {
//   data: ProductResponse;
//   attributeList: { name: string; values: string[] }[];
//   outOfStockAttributeList: string[][];
// }
// //region
// export const isAttributeValueAlwaysOutOfStock = (
//   attributeName: string,
//   value: string,
//   attributeList: { name: string; values: string[] }[],
//   outOfStockAttributeList: string[][],
// ): boolean => {
//   const otherAttributes = attributeList.filter(
//     (attr) => attr.name !== attributeName,
//   );
//
//   if (otherAttributes.length === 0) {
//     return outOfStockAttributeList.some(
//       (combination) => combination[0] === value,
//     );
//   }
//
//   const allCombinations = otherAttributes.reduce<string[][]>(
//     (combinations, attr) => {
//       const newCombinations = attr.values.flatMap((val) =>
//         combinations.map((combo) => [...combo, val]),
//       );
//       return newCombinations;
//     },
//     [[]],
//   );
//
//   return allCombinations.every((combination: string[]) =>
//     outOfStockAttributeList.some(
//       (outOfStockCombination: string[]) =>
//         outOfStockCombination[0] === value &&
//         combination.every(
//           (val: string, index: number) =>
//             val === outOfStockCombination[index + 1],
//         ),
//     ),
//   );
// };
//
// export const getOutOfStockAttributes = (
//   selectedAttributes: {
//     [key: string]: string;
//   },
//   attributeList: { name: string; values: string[] }[],
//   outOfStockAttributeList: string[][],
// ) => {
//   const outOfStockAttributes: string[] = [];
//
//   attributeList.forEach(({ name, values }) => {
//     values.forEach((value) => {
//       const combination = attributeList.map(({ name: attrName }) => {
//         if (attrName === name) {
//           return value;
//         }
//         return selectedAttributes[attrName];
//       });
//
//       if (
//         isAttributeCombinationOutOfStock(combination, outOfStockAttributeList)
//       ) {
//         outOfStockAttributes.push(value);
//       }
//     });
//   });
//
//   return outOfStockAttributes;
// };
//
// const isAttributeCombinationOutOfStock = (
//   attributeCombination: string[],
//   outOfStockAttributeList: string[][],
// ) => {
//   return outOfStockAttributeList.some((outOfStockCombination) =>
//     outOfStockCombination.every(
//       (value, index) => value === attributeCombination[index],
//     ),
//   );
// };
//
// const getAllImageFromProduct = (product: ProductDTO): string[] => {
//   const images: string[] = [];
//
//   // Thêm hình ảnh chính của sản phẩm
//   if (product.image) {
//     images.push(product.image);
//   }
//
//   // Lấy hình ảnh từ các biến thể sản phẩm
//   if (product.productVariantDTOs) {
//     product.productVariantDTOs.forEach((variant) => {
//       if (variant.image) {
//         images.push(variant.image);
//       }
//     });
//   }
//
//   // Loại bỏ các hình ảnh trùng lặp
//   const uniqueImages = [...new Set(images)];
//
//   return uniqueImages;
// };
//
// // Hàm mới để lấy productVariantId dựa trên selectedAttributes
// export const getProductVariantId = (
//   selectedAttributes: { [key: string]: string },
//   data: ProductResponse,
// ): string | null => {
//   const { productVariantDTOs } = data.productDTO;
//
//   for (const variant of productVariantDTOs) {
//     const { attributeDTOs } = variant;
//     console.log("Selected Attribute: ", selectedAttributes);
//     console.log("Attribute DTOs: ", attributeDTOs);
//     const isMatchingVariant = attributeDTOs.every((attribute) => {
//       console.log("Attribute: ", attribute);
//       let count = 0;
//       let trueCount = 0;
//       while (count < attributeDTOs.length) {
//         count++;
//         if (attribute.value === selectedAttributes[attribute.name]) {
//           trueCount++;
//         }
//       }
//       return trueCount === attributeDTOs.length;
//     });
//
//     if (isMatchingVariant) {
//       console.log("Matching Variant: ", variant);
//       return variant.productVariantId.toString();
//     }
//   }
//
//   return null;
// };
//
// //end region
//
// export const ProductDetail = ({ ...props }: ProductDetailProps) => {
//   console.log("Data: ", props.data);
//   console.log("Attribute List: ", props.attributeList);
//   console.log("Out of Stock Attribute List: ", props.outOfStockAttributeList);
//   const { data, attributeList, outOfStockAttributeList } = props;
//
//   const [selectedImage, setSelectedImage] = useState(0);
//
//   const [selectedAttributes, setSelectedAttributes] = useState<{
//     [key: string]: string;
//   }>({});
//
//   const [selectedQuantity_ForAddToCart, setSelectedQuantity_ForAddToCart] =
//     useState(0);
//
//   const navigate = useNavigate();
//
//   const [addNewCart] = useAddNewCartMutation();
//
//   const isAuth: boolean = useSelector(
//     (state: RootState) => state.auth.isAuthenticated,
//   );
//
//   const dataImage = getAllImageFromProduct(data.productDTO);
//
//   const handleAttributeClick = (attributeName: string, value: string) => {
//     setSelectedAttributes((prevSelectedAttributes) => ({
//       ...prevSelectedAttributes,
//       [attributeName]: value,
//     }));
//   };
//
//   const handleImageClick = (index: number) => {
//     setSelectedImage(index);
//   };
//
//   const handlePrevImage = () => {
//     setSelectedImage((prevIndex: number) =>
//       prevIndex === 0 ? dataImage.length - 1 : prevIndex - 1,
//     );
//   };
//
//   const handleNextImage = () => {
//     setSelectedImage((prevIndex: number) =>
//       prevIndex === dataImage.length - 1 ? 0 : prevIndex + 1,
//     );
//   };
//
//   const handleAddToCart = async () => {
//     if (!isAuth) {
//       toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng", {
//         onClose: () => navigate("/login"),
//         autoClose: 1000,
//       });
//       return;
//     }
//
//     const productVariantId = getProductVariantId(selectedAttributes, data);
//
//     try {
//       const response = await addNewCart({
//         productVariantId,
//         quantity: selectedQuantity_ForAddToCart,
//       });
//
//       if (response && "data" in response) {
//         const responseData = response.data;
//
//         if (responseData.status === "success") {
//           // Assuming success is a boolean indicating whether the operation was successful
//           toast.success(responseData.message || "Added to cart successfully!");
//         } else {
//           toast.error(
//             responseData.message || "Failed to add to cart. Please try again.",
//           );
//         }
//       } else {
//         // Handle unexpected response structure
//         toast.error("Failed to add to cart. Please try again.");
//       }
//       if (!response) {
//         toast.error("Failed to add to cart. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error("An error occurred. Please try again later.");
//     }
//   };
//
//   return (
//     <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
//       <h1 className="text-2xl font-semibold">Product Detail</h1>
//       <div className="flex flex-row lg:gap-8 w-full">
//         <div className="h-full w-1/2 basis-full lg:basis-4/6">
//           <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
//             <img
//               alt="Acme T-Shirt - t-shirt-color-black"
//               //omit error of eslint
//               fetchpriority="high"
//               decoding="async"
//               data-nimg="fill"
//               className="h-full w-full object-contain"
//               sizes="(min-width: 1024px) 66vw, 100vw"
//               // src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
//               src={dataImage[selectedImage]}
//               style={{
//                 // position: "absolute",
//                 height: "100%",
//                 width: "100%",
//                 inset: "0px",
//                 color: "transparent",
//               }}
//             />
//             <div className="absolute bottom-[15%] flex w-full justify-center">
//               <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
//                 <button
//                   aria-label="Previous product image"
//                   className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
//                   // href="/product/acme-t-shirt?size=M&amp;color=Black&amp;image=4"
//                   onClick={handlePrevImage}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                     data-slot="icon"
//                     className="h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
//                     ></path>
//                   </svg>
//                 </button>
//                 <div className="mx-1 h-6 w-px bg-neutral-500"></div>
//                 <button
//                   aria-label="Next product image"
//                   className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
//                   onClick={handleNextImage}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                     data-slot="icon"
//                     className="h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
//                     ></path>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto py-1 lg:mb-0 max-w-full"> */}
//           {/* <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto py-1 lg:mb-0 max-w-full relative"> */}
//           <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-scroll py-1 lg:mb-0 max-w-full">
//             <li className="h-20 w-40 flex-shrink-0"></li>
//             {dataImage.map((image, index) => (
//               <li
//                 key={index}
//                 // className="h-20 w-20 flex-shrink-0 "
//                 className={`h-20 w-20  flex-shrink-0 transition-all duration-500 ${
//                   selectedImage === index
//                     ? "h-32 w-32"
//                     : `${
//                         Math.abs(selectedImage - index) === 1
//                           ? "h-24 w-24"
//                           : "h-20 w-20"
//                       }`
//                 }`}
//               >
//                 <button
//                   aria-label="Enlarge product image"
//                   className="h-full w-full"
//                   onClick={() => handleImageClick(index)}
//                 >
//                   <div
//                     className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black ${
//                       selectedImage === index
//                         ? "border-2 border-blue-600"
//                         : "border-transparent"
//                     }`}
//                   >
//                     <img
//                       alt={`${data.productDTO.name} - ${dataImage[0]}`}
//                       loading="lazy"
//                       width="80"
//                       height="80"
//                       decoding="async"
//                       data-nimg="1"
//                       className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
//                       style={{
//                         color: "transparent",
//                       }}
//                       src={image}
//                     />
//                   </div>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="mx-1 h-full w-px bg-neutral-200"></div>
//         <div className="basis-full  lg:basis-2/6">
//           <div className="mb-6 flex flex-col border-b pb-6">
//             <h1 className="mb-2 text-3xl font-medium">
//               {data.productDTO.name}
//             </h1>
//             <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
//               <p>
//                 ${data.productDTO.minPrice} - ${data.productDTO.maxPrice}
//                 <span className="ml-1 inline">VND</span>
//               </p>
//             </div>
//           </div>
//           {/* <dl className="mb-8">
//           <dt className="mb-4 text-sm uppercase tracking-wide">Color</dt>
//           <dd className="flex flex-wrap gap-3">
//             <button
//               aria-disabled="false"
//               title="Color Black"
//               className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm  cursor-default ring-2 ring-blue-600"
//             >
//               Black
//             </button>
//             <button
//               aria-disabled="false"
//               title="Color Blue"
//               className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
//             >
//               Blue
//             </button>
//
//             <button
//               aria-disabled="true"
//               // disabled=""
//               title="Color Pink (Out of Stock)"
//               className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800  relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
//             >
//               Pink
//             </button>
//           </dd>
//         </dl> */}
//           {attributeList.map(({ name, values }) => (
//             <dl key={name} className="mb-8">
//               <dt className="mb-4 text-sm uppercase tracking-wide">{name}</dt>
//               <dd className="flex flex-wrap gap-3">
//                 {values.map((value) => {
//                   const isAlwaysOutOfStock = isAttributeValueAlwaysOutOfStock(
//                     name,
//                     value,
//                     attributeList,
//                     outOfStockAttributeList,
//                   );
//                   const outOfStockAttributes = getOutOfStockAttributes(
//                     selectedAttributes,
//                     attributeList,
//                     outOfStockAttributeList,
//                   );
//                   const isOutOfStock =
//                     isAlwaysOutOfStock || outOfStockAttributes.includes(value);
//                   const isSelected = selectedAttributes[name] === value;
//
//                   return (
//                     <button
//                       key={value}
//                       aria-disabled={isOutOfStock}
//                       title={`${name} ${value}${isOutOfStock ? " (Out of Stock)" : ""}`}
//                       className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm ${
//                         isOutOfStock
//                           ? "dark:border-neutral-800 relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
//                           : isSelected
//                             ? "cursor-default ring-2 ring-blue-600"
//                             : "ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
//                       }`}
//                       onClick={() =>
//                         !isOutOfStock && handleAttributeClick(name, value)
//                       }
//                     >
//                       {value}
//                     </button>
//                   );
//                 })}
//               </dd>
//             </dl>
//           ))}
//
//           <div className="mb-8">
//             <InputQuantity
//               quantity={selectedQuantity_ForAddToCart}
//               setQuantity={setSelectedQuantity_ForAddToCart}
//             />
//           </div>
//           <button
//             aria-label="Add to cart"
//             aria-disabled="false"
//             className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
//             onClick={handleAddToCart}
//           >
//             <div className="absolute left-0 ml-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 aria-hidden="true"
//                 data-slot="icon"
//                 className="h-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 4.5v15m7.5-7.5h-15"
//                 ></path>
//               </svg>
//             </div>
//             Add To Cart
//           </button>
//           <p aria-live="polite" className="sr-only" role="status"></p>
//         </div>
//       </div>
//       <ToastContainer />
//       {/* info and description of product */}
//     </div>
//   );
// };
