import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { addJobApi } from "./addJobApi";
import { totalJobApi } from "./totalJobApi";


export const store = configureStore({
    reducer: {
        [addJobApi.reducerPath]: addJobApi.reducer,
        [totalJobApi.reducerPath]: totalJobApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(addJobApi.middleware, totalJobApi.middleware),
})

setupListeners(store.dispatch)