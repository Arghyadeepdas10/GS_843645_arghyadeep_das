import { createSlice } from "@reduxjs/toolkit";

interface Sku {
    id: number;
    name: string;
    price: number;
    cost: number;
}

interface SkuState {
    skus: Sku[];
}

const initialState: SkuState = {
    skus: [],
};

export const skuSlice = createSlice({
    name: "sku",
    initialState,
    reducers: {
        addSku: (state, action) => {
            state.skus.push(action.payload);
        },
        removeSku: (state, action) => {
            state.skus = state.skus.filter((sku) => sku.id !== action.payload);
        },
        updateSku: (state, action) => {
            const index = state.skus.findIndex((sku) => sku.id === action.payload.id);
            if (index !== -1) {
                state.skus[index] = action.payload;
            }
        }
}
})

export const { addSku, removeSku, updateSku } = skuSlice.actions;
export default skuSlice.reducer;