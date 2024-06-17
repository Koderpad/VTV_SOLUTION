import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { Star } from "@/components/atoms/Icon/Star";

const CarouselItemProductList = ({ products }: { products: ProductDTO[] }) => {
  return (
    <Carousel>
      <CarouselPrevious />
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.productId} className="basis-1/5">
            <div className="group rounded-2xl bg-white p-2">
              <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
                <a
                  href={`/product/${product.productId}`}
                  className="relative block h-full w-full"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} IMG`}
                    className="absolute h-full w-full duration-700 opacity-100"
                    decoding="async"
                  />
                </a>
              </div>
              <div className="mb-1 mt-2 space-y-4 px-1">
                <div>
                  <h2 className="text-base font-medium">{product.name}</h2>
                  <h3 className="text-xs font-normal capitalize text-neutral-400">
                    {product.categoryId}
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-black">
                    ${product.minPrice.toFixed(2)} - $
                    {product.maxPrice.toFixed(2)}
                  </h3>
                  <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
                    <Star typeStar="filled" />
                    <h4>
                      {product.rating} ({product.sold} sold)
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselItemProductList;
