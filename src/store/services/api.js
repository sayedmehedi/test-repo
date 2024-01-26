import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://dummy.restapiexample.com/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    headers.set('Accept', 'application/json');
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Employee'],
  endpoints: build => ({
    login: build.mutation({
      queryFn: credentials => {
        if (!!credentials.username && !!credentials.password) {
          return {
            data: {
              message: 'Login successful',
            },
          };
        }

        return {
          error: {
            message: 'Login failed',
            status: 401,
          },
        };
      },
    }),
    getEmployeeList: build.query({
      query: () => ({
        url: '/employees',
      }),
      providesTags: [{ type: 'Employee', id: 'LIST' }],
    }),
    getEmployeeDetails: build.query({
      query: (empId) => ({
        url: `/employee/${empId}`,
      }),
      providesTags: (_result, _err, empId) => [{ type: 'Employee', id: empId }],
    }),
    updateEmployee: build.mutation({
      query: employeeData => ({
        url: `/update/${employeeData.id}`,
        method: 'PUT',
        body: employeeData,
      }),
      // invalidatesTags: ['Employee'],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: { data: updatedEmployee } } = await queryFulfilled

          dispatch(
            api.util.updateQueryData('getEmployeeList', undefined, drafts => {
              const employeeDataToUpdate = drafts.data.find(emp => emp.id === id)
              if (employeeDataToUpdate) {
                Object.assign(employeeDataToUpdate, updatedEmployee)
              }
            })
          )

          dispatch(
            api.util.upsertQueryData('getEmployeeDetails', updatedEmployee.id, updatedEmployee)
          )

        } catch { }
      },
    }),
    createEmployee: build.mutation({
      query: employeeData => ({
        url: `/create`,
        method: 'POST',
        body: employeeData,
      }),
      // invalidatesTags: [{ type: 'Employee', id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: { data: createdEmployee } } = await queryFulfilled

          dispatch(
            api.util.updateQueryData('getEmployeeList', undefined, drafts => {
              drafts.data.unshift(createdEmployee)
            })
          )

          dispatch(
            api.util.upsertQueryData('getEmployeeDetails', createdEmployee.id, createdEmployee)
          )

        } catch { }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEmployeeListQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeDetailsQuery,
  useLazyGetEmployeeDetailsQuery
} = api;
