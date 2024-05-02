import { Provider } from "react-redux";
import { Meta, StoryObj } from "@storybook/react";

import { ShopSection } from ".";
import { store } from "@/redux/store";

const meta: Meta<typeof ShopSection> = {
  title: "Organisms/Cart/ShopSection",
  component: ShopSection,
  parameters: {
    layout: "centered",
  },
  decorators: [],
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ShopSectionStory: Story = {
  args: {
    data: {
      shopId: 1,
      shopName: "Test Shop",
      avatar: "https://example.com/avatar.jpg",
      countCartInShop: 2, // Update the countCartInShop to 2
      carts: [
        {
          cartId: "1",
          quantity: 2,
          productId: 1,
          productName: "Test Product",
          productImage: "https://example.com/product.jpg",
          updateAt: "2022-01-01T00:00:00.000Z",
          productVariantDTO: {
            productVariantId: 1,
            sku: "SKU001",
            image: "https://example.com/variant.jpg",
            originalPrice: 100000,
            price: 90000,
            quantity: 10,
            status: "active",
            productId: 1,
            productName: "Test Product",
            productImage: "https://example.com/product.jpg",
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
        {
          cartId: "2", // Add a new cart with cartId 2
          quantity: 1, // Set the quantity for the new cart
          productId: 2, // Set the productId for the new cart
          productName: "Test Product 2", // Set the productName for the new cart
          productImage: "https://example.com/product2.jpg", // Set the productImage for the new cart
          updateAt: "2022-01-02T00:00:00.000Z", // Set the updateAt for the new cart
          productVariantDTO: {
            productVariantId: 2, // Set the productVariantId for the new cart
            sku: "SKU002", // Set the sku for the new cart
            image: "https://example.com/variant2.jpg", // Set the image for the new cart
            originalPrice: 200000, // Set the originalPrice for the new cart
            price: 180000, // Set the price for the new cart
            quantity: 5, // Set the quantity for the new cart
            status: "active", // Set the status for the new cart
            productId: 2, // Set the productId for the new cart
            productName: "Test Product 2", // Set the productName for the new cart
            productImage: "https://example.com/product2.jpg", // Set the productImage for the new cart
            discountPercent: "20%", // Set the discountPercent for the new cart
            countAttribute: 2, // Set the countAttribute for the new cart
            attributeDTOs: [
              {
                attributeId: 3, // Set the attributeId for the new cart
                name: "Test Attribute 3", // Set the name for the new cart
                value: "Test Value 3", // Set the value for the new cart
                active: true, // Set the active for the new cart
              },
              {
                attributeId: 4, // Set the attributeId for the new cart
                name: "Test Attribute 4", // Set the name for the new cart
                value: "Test Value 4", // Set the value for the new cart
                active: true, // Set the active for the new cart
              },
            ],
          },
        },
      ],
    },
  },

  render: (args) => (
    <Provider store={store}>
      <ShopSection {...args} />
    </Provider>
  ),
};
