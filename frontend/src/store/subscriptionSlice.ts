// subscriptionSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  cost: number;
  customAmounts: Record<string, number>; // Record of email to custom amount
}

const initialState: SubscriptionState = {
  cost: 0,
  customAmounts: {},
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setCost: (state, action: PayloadAction<number>) => {
      state.cost = action.payload;
    },
    setCustomAmount: (state, action: PayloadAction<{ email: string; amount: number }>) => {
      const { email, amount } = action.payload;
      state.customAmounts[email] = amount;
    },
  },
});

export const { setCost, setCustomAmount } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
