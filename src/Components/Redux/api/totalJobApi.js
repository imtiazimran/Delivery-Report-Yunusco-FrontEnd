import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./addJobApi";

export const totalJobApi = createApi({
  reducerPath: "totalJobApi",
  baseQuery: fetchBaseQuery({
    baseUrl
  }),
  endpoints: (builder) => ({
    getLimitedJobs: builder.query({
      query: ({ searchTerm = "apex", page = 1, limit = 100 }) => ({
        url: `/delivered`,
        method: "GET",
        params: { searchTerm, page, limit }
      }),
      // Enable caching for getLimitedJobs endpoint
      keepUnusedDataFor: 5 * 60 * 1000, // Cache data for 5 minutes
    }),
    getAllJobs: builder.query({
      query: ()=>({
        url: `/getAllDelivered`,
        method: "GET",
      }),
      // Enable caching for getAllJobs endpoint
      keepUnusedDataFor: 5 * 60 * 1000, // Cache data for 5 minutes
    })
  })
});


export const {  useGetLimitedJobsQuery, useGetAllJobsQuery } = totalJobApi;