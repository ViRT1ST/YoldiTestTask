import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api`;

function getHeaders(headers: Headers, getState: any) {
  // const token = getState().account.token;

  // headers.set('Content-Type', 'application/json');
  // token && headers.set('Authorization', `Bearer ${token}`);  
  
  return headers;
}

const usersApi = createApi({
  reducerPath: 'rtkq_users',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      return getHeaders(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      loginUser: builder.mutation<object, object>({
        query: (data) => {
          return {
            method: 'POST',
            url: '/users/login',
            body: data
          };
        }
      }),
      createUser: builder.mutation<object, object>({
        query: (data) => {
          return {
            method: 'POST',
            url: '/users',
            body: data
          };
        }
      }),
      logoutUser: builder.mutation<void, void>({
        query: () => {
          return {
            method: 'POST',
            url: '/users/logout',
          };
        }
      }),
      getProfile: builder.query<object, void>({
        query: () => {
          return {
            method: 'GET',
            url: '/users/me',
          };
        }
      }),
      updateUser: builder.mutation<object, object>({
        query: (data) => {
          return {
            method: 'PATCH',
            url: '/users/me',
            body: data
          };
        }
      }),
    };
  }
});

export default usersApi;
