import { useState } from "react";

const product = {
  id: 1,
  name: "Áo thun Acme",
  price: 20,
  images: [
    "https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7",
    "https://down-vn.img.susercontent.com/file/abcd1234efgh5678ijkl9012mnop3456",
    "https://down-vn.img.susercontent.com/file/qrst7890uvwx1234yzab5678cdef9012",
    "https://down-vn.img.susercontent.com/file/qrst7890uvwx1234yzab5678cdef9012",
    "https://down-vn.img.susercontent.com/file/qrst7890uvwx1234yzab5678cdef9012",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp4x04de52zfbc",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp4x04de52zfbc",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp4x04de52zfbc",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp4x04de52zfbc",
  ],
  colors: ["Black", "Blue", "Pink", "White"],
};

export const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePrevImage = () => {
    setSelectedImage((prevIndex: number) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex: number) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 w-full">
      <div className="h-full w-1/2 basis-full lg:basis-4/6">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          <img
            alt="Acme T-Shirt - t-shirt-color-black"
            fetchPriority="high"
            decoding="async"
            data-nimg="fill"
            className="h-full w-full object-contain"
            sizes="(min-width: 1024px) 66vw, 100vw"
            // src="https://down-vn.img.susercontent.com/file/1234b2a2d4ccbcdc4357c818cf58a1f7"
            src={product.images[selectedImage]}
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
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  ></path>
                </svg>
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                aria-label="Next product image"
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
                // href="/product/acme-t-shirt?size=M&amp;color=Black&amp;image=1"
                onClick={handleNextImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
          {product.images.map((image, index) => (
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
                    alt={`${product.name} - ${product.colors[0]}`}
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
          <h1 className="mb-2 text-5xl font-medium">Ten sp</h1>
          <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
            <p>
              $20.00<span className="ml-1 inline">VND</span>
            </p>
          </div>
        </div>
        <dl className="mb-8">
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
              disabled=""
              title="Color Pink (Out of Stock)"
              className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800  relative z-10 cursor-not-allowed overflow-hidden text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform"
            >
              Pink
            </button>
            <button
              aria-disabled="false"
              title="Color White"
              className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600"
            >
              White
            </button>
          </dd>
        </dl>
        <form action="">
          <button
            aria-label="Add to cart"
            aria-disabled="false"
            className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
          >
            <div className="absolute left-0 ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                ></path>
              </svg>
            </div>
            Add To Cart
          </button>
          <p aria-live="polite" className="sr-only" role="status"></p>
        </form>
      </div>
    </div>
  );
};
