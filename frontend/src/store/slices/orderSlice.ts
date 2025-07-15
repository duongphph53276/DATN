import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllOrderClient, updateOrderStatus } from "../../services/api/OrderApi";
import {
  OrderState,
  stateOrder,
  orderUpdateStatusData,
  GetOrderParams,
} from "../../interfaces/orderApi";

const initialState: OrderState = {
  client: [],
  admin: {
    orders: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_orders: 0,
      per_page: 10,
      has_next: false,
      has_prev: false,
    },
  },
  status: "idle",
};

export const getOrder = createAsyncThunk(
  "order/fetch",
  async (params?: GetOrderParams) => {
    // await waitFor(3000);
    return await getAllOrderClient(params!);
  }
);

export const updateOrder = createAsyncThunk(
  "order/update",
  async (data: orderUpdateStatusData): Promise<stateOrder> => {
    return await updateOrderStatus(data);
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        const { orders, pagination } = action.payload.data;
        state.client = orders;
        state.admin.orders = orders;
        state.admin.pagination = pagination;
        state.status = "idle";
      })
      .addCase(getOrder.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updated = action.payload;

        const updateInList = (list: stateOrder[]) => {
          const index = list.findIndex((item) => item._id === updated._id);
          if (index !== -1) list[index] = updated;
        };

        updateInList(state.client);
        updateInList(state.admin.orders);
        state.status = "idle";
      })
      .addCase(updateOrder.rejected, (state) => {
        state.status = "failed";
      }),
});

export default orderSlice.reducer;
