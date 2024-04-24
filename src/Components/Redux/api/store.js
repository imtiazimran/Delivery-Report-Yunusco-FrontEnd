import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { addJobApi } from "./addJobApi";


export const store = configureStore({
    reducer: {
        [addJobApi.reducerPath]: addJobApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(addJobApi.middleware),
})

setupListeners(store.dispatch)