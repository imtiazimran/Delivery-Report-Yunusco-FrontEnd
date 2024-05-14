import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./addJobApi";

export const totalJobApi = createApi({
  reducerPath: "totalJobApi",
  baseQuery: fetchBaseQuery({
    baseUrl
  }),
  tagTypes: ["Delivered"],
  endpoints: (builder) => ({
    getLimitedJobs: builder.query({
      query: ({ searchTerm = "apex", page = 1, limit = 100 }) => ({
        url: `/delivered`,
        method: "GET",
        params: { searchTerm, page, limit }
      }),
      providesTags: ["Delivered"],
      // Enable caching for getLimitedJobs endpoint
      keepUnusedDataFor: 5 * 60 * 1000, // Cache data for 5 minutes
    }),
    getAllJobs: builder.query({
      query: ()=>({
        url: `/getAllDelivered`,
        method: "GET",
      }),
      providesTags: ["Delivered"],
      // Enable caching for getAllJobs endpoint
      keepUnusedDataFor: 5 * 60 * 1000, // Cache data for 5 minutes
    }),
    addJobToDelivered: builder.mutation({
      query: (data) => ({
        url: "/addJobs",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Delivered"],
      // Refetch queries after mutation
      onQueryStarted: (arg, { dispatch }) => {
        dispatch(totalJobApi.util.invalidateTags(["Delivered"]));
      },
    }),
    addToPertial: builder.mutation({
      query: (data) => ({
        url: "/insertNewPartialDelivery",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Delivered"],
      // Refetch queries after mutation
      onQueryStarted: (arg, { dispatch }) => {
        dispatch(totalJobApi.util.invalidateTags(["Delivered"]));
      },
    }),
    deleteFromDelivered: builder.mutation({
      query: (id) => ({
        url: `/deleteDeliveredJob/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Delivered"],
      // Refetch queries after mutation
    })
  })
});




export const { useGetLimitedJobsQuery, useGetAllJobsQuery, useAddJobToDeliveredMutation, useAddToPertialMutation, useDeleteFromDeliveredMutation } = totalJobApi;