import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Service } from "../../modules/types";

interface ServicesState {
    serviceName: string;
    filteredServices: T_Service[];
    isMock: boolean;
}

const initialState: ServicesState = {
    serviceName: "",
    filteredServices: [],
    isMock: false,
};

const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServiceName(state, action: PayloadAction<string>) {
            state.serviceName = action.payload;
        },
        setFilteredServices(state, action: PayloadAction<T_Service[]>) {
            state.filteredServices = action.payload;
        },
    },
});

export const { setServiceName, setFilteredServices } = serviceSlice.actions;

export default serviceSlice.reducer;
