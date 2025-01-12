import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ServicesSlice {
    serviceName: string;
}

const initialState: ServicesSlice = {
    serviceName: "",
};

const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        updateServiceName: (state, action) => {
            state.serviceName = action.payload;
        },
    },
});

export const useServiceName = () => useSelector((state: RootState) => state.services.serviceName);

export const { updateServiceName } = servicesSlice.actions;

export default servicesSlice.reducer;
