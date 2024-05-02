import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Import your Redux store
import { CartItem } from ".";

const meta: Meta<typeof CartItem> = {
  title: "Organisms/Cart/ShopSection/CartItem",
  component: CartItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CartItemStory: Story = {
  args: {
    cart: {
      cartId: "1",
      quantity: 2,
      productId: 1,
      productName: "Test Product",
      productImage:
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-tatpejxnmujv23",
      updateAt: "2022-01-01T00:00:00.000Z",
      productVariantDTO: {
        productVariantId: 1,
        sku: "SKU001",
        image: "https://example.com/image.jpg",
        originalPrice: 100000,
        price: 90000,
        quantity: 10,
        status: "active",
        productId: 1,
        productName: "Test Product",
        productImage: "https://example.com/image.jpg",
        discountPercent: "10%",
        countAttribute: 1,
        attributeDTOs: [
          {
            attributeId: 1,
            name: "Test Attribute",
            value: "Test Value",
            active: true,
          },
          {
            attributeId: 2,
            name: "Test Attribute 2",
            value: "Test Value 2",
            active: true,
          },
        ],
      },
    },
  },
  render: (args) => <CartItem cart={args.cart} />,
};
