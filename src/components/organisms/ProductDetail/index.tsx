import {
  ProductDTO,
  ProductResponse,
} from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { useState } from "react";
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
  attributeList: { name: string; values: string[] }[];
  outOfStockAttributeList: string[][];
}
//region
export const isAttributeValueAlwaysOutOfStock = (
  attributeName: string,
  value: string,
  attributeList: { name: string; values: string[] }[],
  outOfStockAttributeList: string[][]
): boolean => {
  const otherAttributes = attributeList.filter(
    (attr) => attr.name !== attributeName
  );

  if (otherAttributes.length === 0) {
    return outOfStockAttributeList.some(
      (combination) => combination[0] === value
    );
  }

  const allCombinations = otherAttributes.reduce<string[][]>(
    (combinations, attr) => {
      const newCombinations = attr.values.flatMap((val) =>
        combinations.map((combo) => [...combo, val])
      );
      return newCombinations;
    },
    [[]]
  );

  return allCombinations.every((combination: string[]) =>
    outOfStockAttributeList.some(
      (outOfStockCombination: string[]) =>
        outOfStockCombination[0] === value &&
        combination.every(
          (val: string, index: number) =>
            val === outOfStockCombination[index + 1]
        )
    )
  );
};

export const getOutOfStockAttributes = (
  selectedAttributes: {
    [key: string]: string;
  },
  attributeList: { name: string; values: string[] }[],
  outOfStockAttributeList: string[][]
) => {
  const outOfStockAttributes: string[] = [];

  attributeList.forEach(({ name, values }) => {
    values.forEach((value) => {
      const combination = attributeList.map(({ name: attrName }) => {
        if (attrName === name) {
          return value;
        }
        return selectedAttributes[attrName];
      });

      if (
        isAttributeCombinationOutOfStock(combination, outOfStockAttributeList)
      ) {
        outOfStockAttributes.push(value);
      }
    });
  });

  return outOfStockAttributes;
};

const isAttributeCombinationOutOfStock = (
  attributeCombination: string[],
  outOfStockAttributeList: string[][]
) => {
  return outOfStockAttributeList.some((outOfStockCombination) =>
    outOfStockCombination.every(
      (value, index) => value === attributeCombination[index]
    )
  );
};

const getAllImageFromProduct = (product: ProductDTO): string[] => {
  const images: string[] = [];

  // Thêm hình ảnh chính của sản phẩm
  if (product.image) {
    images.push(product.image);
  }

  // Lấy hình ảnh từ các biến thể sản phẩm
  if (product.productVariantDTOs) {
    product.productVariantDTOs.forEach((variant) => {
      if (variant.image) {
        images.push(variant.image);
      }
    });
  }

  // Loại bỏ các hình ảnh trùng lặp
  const uniqueImages = [...new Set(images)];

  return uniqueImages;
};

// Hàm mới để lấy productVariantId dựa trên selectedAttributes
export const getProductVariantId = (
  selectedAttributes: { [key: string]: string },
  data: ProductResponse
): string | null => {
  const { productVariantDTOs } = data.productDTO;

  for (const variant of productVariantDTOs) {
    const { attributeDTOs } = variant;
    console.log("Selected Attribute: ", selectedAttributes);
    console.log("Attribute DTOs: ", attributeDTOs);
    const isMatchingVariant = attributeDTOs.every((attribute) => {
      console.log("Attribute: ", attribute);
      let count = 0;
      let trueCount = 0;
      while (count < attributeDTOs.length) {
        count++;
        if (attribute.value === selectedAttributes[attribute.name]) {
          trueCount++;
        }
      }
      return trueCount === attributeDTOs.length;
    });

    if (isMatchingVariant) {
      console.log("Matching Variant: ", variant);
      return variant.productVariantId.toString();
    }
  }

  return null;
};

//end region

export const ProductDetail = ({ ...props }: ProductDetailProps) => {
  console.log("Data: ", props.data);
  console.log("Attribute List: ", props.attributeList);
  console.log("Out of Stock Attribute List: ", props.outOfStockAttributeList);
  const { data, attributeList, outOfStockAttributeList } = props;

  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});

  const [selectedQuantity_ForAddToCart, setSelectedQuantity_ForAddToCart] =
    useState(0);

  const navigate = useNavigate();

  const [addNewCart] = useAddNewCartMutation();

  const isAuth: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dataImage = getAllImageFromProduct(data.productDTO);

  const handleAttributeClick = (attributeName: string, value: string) => {
    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [attributeName]: value,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePrevImage = () => {
    setSelectedImage((prevIndex: number) =>
      prevIndex === 0 ? dataImage.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex: number) =>
      prevIndex === dataImage.length - 1 ? 0 : prevIndex + 1
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

    const productVariantId = getProductVariantId(selectedAttributes, data);

    try {
      const response = await addNewCart({
        productVariantId,
        quantity: selectedQuantity_ForAddToCart,
      });

      if (response && "data" in response) {
        const responseData = response.data;

        if (responseData.status === "success") {
          // Assuming success is a boolean indicating whether the operation was successful
          toast.success(responseData.message || "Added to cart successfully!");
        } else {
          toast.error(
            responseData.message || "Failed to add to cart. Please try again."
          );
        }
      } else {
        // Handle unexpected response structure
        toast.error("Failed to add to cart. Please try again.");
      }
      if (!response) {
        toast.error("Failed to add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
      <h1 className="text-2xl font-semibold">Product Detail</h1>
      <div className="flex flex-row lg:gap-8 w-full">
        <div className="h-full w-1/2 basis-full lg:basis-4/6">
          <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
            <img
              alt="Acme T-Shirt - t-shirt-color-black"
              //omit error of eslint
              fetchPriority="high"
              decoding="async"
              data-nimg="fill"
              className="h-full w-full object-contain"
              sizes="(min-width: 1024px) 66vw, 100vw"
              // src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
              src={dataImage[selectedImage]}
              style={{
                // position: "absolute",
                height: "100%",
                width: "100%",
                inset: "0px",
                color: "transparent",
              }}
            />
            <div className="absolute bottom-[15%] flex w-full justify-center">
              <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                <button
                  aria-label="Previous product image"
                  className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
                  // href="/product/acme-t-shirt?size=M&amp;color=Black&amp;image=4"
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
          {/* <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto py-1 lg:mb-0 max-w-full"> */}
          {/* <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto py-1 lg:mb-0 max-w-full relative"> */}
          <ul className="my-12 flex flex-nowrap items-center justify-center gap-2 overflow-x-scroll py-1 lg:mb-0 max-w-full">
            <li className="h-20 w-40 flex-shrink-0"></li>
            {dataImage.map((image, index) => (
              <li
                key={index}
                // className="h-20 w-20 flex-shrink-0 "
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
                      alt={`${data.productDTO.name} - ${dataImage[0]}`}
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
        <div className="mx-1 h-full w-px bg-neutral-200"></div>
        <div className="basis-full  lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b pb-6">
            <h1 className="mb-2 text-3xl font-medium">
              {data.productDTO.name}
            </h1>
            <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
              <p>
                ${data.productDTO.minPrice} - ${data.productDTO.maxPrice}
                <span className="ml-1 inline">VND</span>
              </p>
            </div>
          </div>
          {/* <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">Color</dt>
          <dd className="flex flex-wrap gap-3">
            <button
              aria-disabled="false"
              title="Color Black"
              className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm  cursor-default ring-2 ring-blue-600"
            >
              Black
            </button>
            <button
              aria-disabled="false"
              title="Color Blue"
              className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
            >
              Blue
            </button>

            <button
              aria-disabled="true"
              // disabled=""
              title="Color Pink (Out of Stock)"
              className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800  relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
            >
              Pink
            </button>
          </dd>
        </dl> */}
          {attributeList.map(({ name, values }) => (
            <dl key={name} className="mb-8">
              <dt className="mb-4 text-sm uppercase tracking-wide">{name}</dt>
              <dd className="flex flex-wrap gap-3">
                {values.map((value) => {
                  const isAlwaysOutOfStock = isAttributeValueAlwaysOutOfStock(
                    name,
                    value,
                    attributeList,
                    outOfStockAttributeList
                  );
                  const outOfStockAttributes = getOutOfStockAttributes(
                    selectedAttributes,
                    attributeList,
                    outOfStockAttributeList
                  );
                  const isOutOfStock =
                    isAlwaysOutOfStock || outOfStockAttributes.includes(value);
                  const isSelected = selectedAttributes[name] === value;

                  return (
                    <button
                      key={value}
                      aria-disabled={isOutOfStock}
                      title={`${name} ${value}${isOutOfStock ? " (Out of Stock)" : ""}`}
                      className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm ${
                        isOutOfStock
                          ? "dark:border-neutral-800 relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
                          : isSelected
                            ? "cursor-default ring-2 ring-blue-600"
                            : "ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
                      }`}
                      onClick={() =>
                        !isOutOfStock && handleAttributeClick(name, value)
                      }
                    >
                      {value}
                    </button>
                  );
                })}
              </dd>
            </dl>
          ))}

          <div className="mb-8">
            <InputQuantity
              quantity={selectedQuantity_ForAddToCart}
              setQuantity={setSelectedQuantity_ForAddToCart}
            />
          </div>
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
            Add To Cart
          </button>
          <p aria-live="polite" className="sr-only" role="status"></p>
        </div>
      </div>
      <ToastContainer />
      {/* info and description of product */}
    </div>
  );
};
