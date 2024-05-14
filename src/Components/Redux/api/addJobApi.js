import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const baseUrl = "https://delivery-report-yunusco-back-end.vercel.app"
// export const baseUrl = "http://localhost:8570"

export const addJobApi = createApi({
    reducerPath: "addJobApi",
    baseQuery: fetchBaseQuery({
        baseUrl
    }),
    tagTypes: ["jobOnProcess"],
    endpoints: (builder) => ({

        addJob: builder.mutation({
            query: (data) => ({
                url: "/addToProcess",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["jobOnProcess"],
            onQueryStarted: (arg, { dispatch }) => {
                dispatch(addJobApi.util.invalidateTags(["jobOnProcess"]));
            },
        }),
        getProcessingJobs: builder.query({
            query: () => ({
                url: "/delivery",
                method: "GET"
            }),
            providesTags: ["jobOnProcess"],
        }),
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `/deleteJob/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["jobOnProcess"],
            onQueryStarted: (arg, { dispatch }) => {
                dispatch(addJobApi.util.invalidateTags(["jobOnProcess"]));
            },
        })
    })
})

export const { useAddJobMutation, useGetProcessingJobsQuery, useDeleteJobMutation } = addJobApi;