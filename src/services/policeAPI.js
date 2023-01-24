import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const policeApi = createApi({
  reducerPath: 'PoliceAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://data.police.uk/api',
  }),
  endpoints: (builder) => ({
    getForces: builder.query({
      query: () => '/forces',
    }),
    getAvailability: builder.query({
      query: () => '/crimes-street-dates',
    }),
    getByForce: builder.query({
      query: (searchParam) => '/stops-force?' + searchParam,
    }),
  }),
});

export const { useGetForcesQuery, useGetAvailabilityQuery, useGetByForceQuery } = policeApi;
