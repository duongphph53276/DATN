import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createNewOrder, getAllOrderClient, getOrderByUserId, updateOrderStatus } from "../../services/api/OrderApi";
import {
  OrderState,
  stateOrder,
  orderUpdateStatusData,
  GetOrderParams,
  GetOrderPayload,
} from "../../interfaces/orderApi";
import { ToastError, ToastSucess } from "../../utils/toast";

const initialState: OrderState = {
  client: {
    orders: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_orders: 0,
      per_page: 10,
      has_next: false,
      has_prev: false,
    }
  },
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
    return await getAllOrderClient(params!);
  }
);

export const updateOrder = createAsyncThunk(
  "order/update",
  async (data: orderUpdateStatusData): Promise<stateOrder> => {
    return await updateOrderStatus(data);
  }
);

export const getOrderClient = createAsyncThunk(
  "order/getClient",
  async ({ id, params }: GetOrderPayload) => {
    return await getOrderByUserId(id, params!);
  }
);
export const createOrder = createAsyncThunk(
  "order/create",
  async (data: any, { rejectWithValue }) => {
    try {
      return await createNewOrder(data);
    } catch (error: any) {
      // Trả về thông báo lỗi từ server nếu có
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Lỗi khi đặt hàng. Vui lòng thử lại.');
    }
  }
)
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
        console.log(action.payload,'sss');

        const updateInList = (list: stateOrder[]) => {
          const index = list.findIndex((item) => item._id === updated._id);
          if (index !== -1) list[index] = updated;
        };

        updateInList(state.admin.orders);
        state.status = "idle";
      })
      .addCase(getOrderClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrderClient.fulfilled, (state, action) => {
        const { orders, pagination } = action.payload.data;
        state.client.orders = orders;
        state.client.pagination = pagination;
        state.status = "idle";
      })
      .addCase(getOrderClient.rejected, (state) => {
        state.status = "failed";
      }).addCase(createOrder.fulfilled, (state, action) => {
        const newOrder = action.payload;

        state.client.orders.unshift(newOrder);

        state.client.pagination.total_orders += 1;

        state.client.pagination.current_page = 1;

        state.status = "idle";
        ToastSucess('Bạn đã đặt hàng thành công');
      }).addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        const errorMessage = action.payload || action.error?.message || 'Lỗi khi đặt hàng';
        ToastError(errorMessage);
      })
      .addCase(updateOrder.rejected, (state) => {
        state.status = "failed";
      }),
});

export default orderSlice.reducer;
