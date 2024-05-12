import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { addJobApi } from "./addJobApi";
import { totalJobApi } from "./totalJobApi";
import { sampleApi } from "./sampleApi";


export const store = configureStore({
    reducer: {
        [addJobApi.reducerPath]: addJobApi.reducer,
        [totalJobApi.reducerPath]: totalJobApi.reducer,
        [sampleApi.reducerPath]: sampleApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(addJobApi.middleware, totalJobApi.middleware, sampleApi.middleware),
})

setupListeners(store.dispatch)