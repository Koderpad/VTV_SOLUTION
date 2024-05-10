import type { Meta, StoryObj } from "@storybook/react";

import { OrdersFromAShop } from ".";

const meta: Meta<typeof OrdersFromAShop> = {
  title: "Organisms/Order/OrdersFromAShop",
  component: OrdersFromAShop,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const OrderDetailsStory: Story = {
  args: {
    orderItemDTOs: [
      {
        orderItemId: "item1",
        orderId: "order1",
        cartId: "cart1",
        quantity: 2,
        price: 150.0,
        totalPrice: 300.0,
        productVariantDTO: {
          productVariantId: 101,
          sku: "SKU101",
          image: "image-url-101.jpg",
          originalPrice: 200.0,
          price: 150.0,
          quantity: 50,
          status: "available",
          productId: 1001,
          productName: "Product Name 101",
          productImage: "product-image-url-101.jpg",
          discountPercent: "25%",
          countAttribute: 2,
          attributeDTOs: [
            {
              attributeId: 201,
              name: "Color",
              value: "Red",
              active: true,
            },
            {
              attributeId: 202,
              name: "Size",
              value: "M",
              active: true,
            },
          ],
        },
      },
      {
        orderItemId: "item2",
        orderId: "order2",
        cartId: "cart2",
        quantity: 1,
        price: 100.0,
        totalPrice: 100.0,
        productVariantDTO: {
          productVariantId: 102,
          sku: "SKU102",
          image: "image-url-102.jpg",
          originalPrice: 100.0,
          price: 100.0,
          quantity: 30,
          status: "available",
          productId: 1002,
          productName: "Product Name 102",
          productImage: "product-image-url-102.jpg",
          discountPercent: "0%",
          countAttribute: 1,
          attributeDTOs: [
            {
              attributeId: 203,
              name: "Color",
              value: "Blue",
              active: true,
            },
          ],
        },
      },
    ],
    shopFromVoucher: [
      {
        voucherId: 101,
        status: "active",
        code: "DISC25",
        name: "25% Off",
        description: "Get 25% off on your next purchase",
        discount: 25,
        quantity: 100,
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        quantityUsed: 0,
        type: "percentage",
      },
      {
        voucherId: 102,
        status: "active",
        code: "DISC50",
        name: "50% Off",
        description: "Get 50% off on your next purchase",
        discount: 50,
        quantity: 50,
        startDate: "2023-01-01",
        endDate: "2023-06-30",
        quantityUsed: 0,
        type: "percentage",
      },
    ],
    formatPrice: (price: number) => price.toString(),
  },
  render: (args) => <OrdersFromAShop {...args} />,
};