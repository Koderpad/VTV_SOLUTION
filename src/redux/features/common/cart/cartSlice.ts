import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ListCartResponse,
  ListCartByShopDTO,
} from "@/utils/DTOs/common/Cart/Response/ListCartResponse";

const initialState = {
  carts: [] as ListCartByShopDTO[],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCarts: (state, action: PayloadAction<ListCartByShopDTO[]>) => {
      state.carts = action.payload;
    },
  },
});

export const { setCarts } = cartSlice.actions;

export default cartSlice.reducer;
