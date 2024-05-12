import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./addJobApi";
export const sampleApi = createApi({
    reducerPath: "sampleApi",
    baseQuery: fetchBaseQuery({baseUrl}),
    tagTypes: ["Sample"],
    endpoints:(builder) =>({
        getSamples: builder.query({
            query: () => ({
                url: `/sample`,
                method: "GET",
            }),
            providesTags: ["Sample"],
            // Enable caching for getSamples endpoint
            keepUnusedDataFor: 5 * 60 * 1000, // Cache data for 5 minutes
        }),
    })
})

export const  {useGetSamplesQuery} = sampleApi