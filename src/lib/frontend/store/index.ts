import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import usersApi from '@/lib/frontend/store/apis/users';
// import articlesApi from '@/lib/frontend/store/apis/articles';
// import accountSlice from '@/lib/frontend/store/slices/account';
import yoldiSlice from '@/lib/frontend/store/slices/yoldi';

const store = configureStore({
  reducer: {
    // [articlesApi.reducerPath]: articlesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    // [accountSlice.name]: accountSlice.reducer,
    [yoldiSlice.name]: yoldiSlice.reducer
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      // .concat(articlesApi.middleware)
      .concat(usersApi.middleware);
  }
});

setupListeners(store.dispatch);

export default store;
