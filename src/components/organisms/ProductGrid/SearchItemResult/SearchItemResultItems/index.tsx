import { useContext } from "react";
import { FilterContext } from "../../FilterContext";
import { CardItem } from "./CardItem";

const fakeProducts = [
  {
    id: 1,
    name: "Áo thun nam",
    shop: "Shop A",
    price: 15.99,
    rating: 4.2,
    reviews: 150,
    images: [
      "https://martina.vn/wp-content/uploads/2020/04/hinh-anh-ao-doi-dep-nhat-04.jpg",
      "https://example.com/product1-img2.jpg",
      "https://example.com/product1-img3.jpg",
      "https://example.com/product1-img1.jpg",
      "https://example.com/product1-img2.jpg",
    ],
  },
  {
    id: 2,
    name: "Váy nữ",
    shop: "Shop B",
    price: 25.5,
    rating: 4.5,
    reviews: 200,
    images: [
      "https://example.com/product2-img1.jpg",
      "https://example.com/product2-img2.jpg",
      "https://example.com/product2-img3.jpg",
    ],
  },
  {
    id: 3,
    name: "Giày thể thao",
    shop: "Shop C",
    price: 45.99,
    rating: 4.8,
    reviews: 300,
    images: [
      "https://example.com/product3-img1.jpg",
      "https://example.com/product3-img2.jpg",
      "https://example.com/product3-img3.jpg",
    ],
  },
  {
    id: 4,
    name: "Đồng hồ thông minh",
    shop: "Shop D",
    price: 199.99,
    rating: 4.6,
    reviews: 120,
    images: [
      "https://example.com/product4-img1.jpg",
      "https://example.com/product4-img2.jpg",
      "https://example.com/product4-img3.jpg",
    ],
  },
  {
    id: 5,
    name: "Túi xách nữ",
    shop: "Shop E",
    price: 35.99,
    rating: 4.3,
    reviews: 180,
    images: [
      "https://example.com/product5-img1.jpg",
      "https://example.com/product5-img2.jpg",
      "https://example.com/product5-img3.jpg",
    ],
  },
  {
    id: 6,
    name: "Máy ảnh DSLR",
    shop: "Shop F",
    price: 599.99,
    rating: 4.9,
    reviews: 80,
    images: [
      "https://example.com/product6-img1.jpg",
      "https://example.com/product6-img2.jpg",
      "https://example.com/product6-img3.jpg",
    ],
  },
  {
    id: 7,
    name: "Balo laptop",
    shop: "Shop G",
    price: 29.99,
    rating: 4.1,
    reviews: 220,
    images: [
      "https://example.com/product7-img1.jpg",
      "https://example.com/product7-img2.jpg",
      "https://example.com/product7-img3.jpg",
    ],
  },
  {
    id: 8,
    name: "Nước hoa nam",
    shop: "Shop H",
    price: 49.99,
    rating: 4.7,
    reviews: 100,
    images: [
      "https://example.com/product8-img1.jpg",
      "https://example.com/product8-img2.jpg",
      "https://example.com/product8-img3.jpg",
    ],
  },
  {
    id: 9,
    name: "Đèn bàn trang trí",
    shop: "Shop I",
    price: 19.99,
    rating: 4.4,
    reviews: 250,
    images: [
      "https://example.com/product9-img1.jpg",
      "https://example.com/product9-img2.jpg",
      "https://example.com/product9-img3.jpg",
    ],
  },
  {
    id: 10,
    name: "Tai nghe không dây",
    shop: "Shop J",
    price: 79.99,
    rating: 4.6,
    reviews: 180,
    images: [
      "https://example.com/product10-img1.jpg",
      "https://example.com/product10-img2.jpg",
      "https://example.com/product10-img3.jpg",
    ],
  },
  {
    id: 11,
    name: "Áo khoác nam",
    shop: "Shop K",
    price: 39.99,
    rating: 4.3,
    reviews: 200,
    images: [
      "https://example.com/product11-img1.jpg",
      "https://example.com/product11-img2.jpg",
      "https://example.com/product11-img3.jpg",
    ],
  },
  {
    id: 12,
    name: "Đồng hồ nữ",
    shop: "Shop L",
    price: 89.99,
    rating: 4.8,
    reviews: 120,
    images: [
      "https://example.com/product12-img1.jpg",
      "https://example.com/product12-img2.jpg",
      "https://example.com/product12-img3.jpg",
    ],
  },
  {
    id: 13,
    name: "Máy tính bảng",
    shop: "Shop M",
    price: 299.99,
    rating: 4.5,
    reviews: 150,
    images: [
      "https://example.com/product13-img1.jpg",
      "https://example.com/product13-img2.jpg",
      "https://example.com/product13-img3.jpg",
    ],
  },
  {
    id: 14,
    name: "Giày cao gót",
    shop: "Shop N",
    price: 59.99,
    rating: 4.2,
    reviews: 180,
    images: [
      "https://example.com/product14-img1.jpg",
      "https://example.com/product14-img2.jpg",
      "https://example.com/product14-img3.jpg",
    ],
  },
  {
    id: 15,
    name: "Áo len nữ",
    shop: "Shop O",
    price: 29.99,
    rating: 4.4,
    reviews: 220,
    images: [
      "https://example.com/product15-img1.jpg",
      "https://example.com/product15-img2.jpg",
      "https://example.com/product15-img3.jpg",
    ],
  },
  {
    id: 16,
    name: "Máy chơi game",
    shop: "Shop P",
    price: 399.99,
    rating: 4.9,
    reviews: 100,
    images: [
      "https://example.com/product16-img1.jpg",
      "https://example.com/product16-img2.jpg",
      "https://example.com/product16-img3.jpg",
    ],
  },
  {
    id: 17,
    name: "Đồng hồ thể thao",
    shop: "Shop Q",
    price: 69.99,
    rating: 4.6,
    reviews: 150,
    images: [
      "https://example.com/product17-img1.jpg",
      "https://example.com/product17-img2.jpg",
      "https://example.com/product17-img3.jpg",
    ],
  },
  {
    id: 18,
    name: "Áo sơ mi nam",
    shop: "Shop R",
    price: 19.99,
    rating: 4.3,
    reviews: 200,
    images: [
      "https://example.com/product18-img1.jpg",
      "https://example.com/product18-img2.jpg",
      "https://example.com/product18-img3.jpg",
    ],
  },
  {
    id: 19,
    name: "Quần jean nữ",
    shop: "Shop S",
    price: 39.99,
    rating: 4.8,
    reviews: 120,
    images: [
      "https://example.com/product19-img1.jpg",
      "https://example.com/product19-img2.jpg",
      "https://example.com/product19-img3.jpg",
    ],
  },
  {
    id: 20,
    name: "Giày thể thao nam",
    shop: "Shop T",
    price: 49.99,
    rating: 4.5,
    reviews: 180,
    images: [
      "https://example.com/product20-img1.jpg",
      "https://example.com/product20-img2.jpg",
      "https://example.com/product20-img3.jpg",
    ],
  },
];

export const SearchItemResultItems = () => {
  const { filters } = useContext(FilterContext);
  const { rating, minPrice, maxPrice, location } = filters;
  console.log(rating, minPrice, maxPrice, location);

  const filteredProducts = fakeProducts.filter(
    (product) =>
      (rating.length === 0 || rating.some((r) => product.rating >= r)) &&
      product.price >= 0 &&
      product.price <= Infinity
  );

  return (
    <div
      className="
  grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
  "
    >
      {filteredProducts.map((product) => (
        <CardItem key={product.id} product={product} />
      ))}
    </div>
  );
};
