import { useSelector, useDispatch } from 'react-redux';

import yoldiSlice from '@/lib/frontend/store/slices/yoldi';
import usersApi from '@/lib/frontend/store/apis/users';

const {
  setIsUserAuthenticated,
  switchCurrentAuthPage
} = yoldiSlice.actions;

export function useYoldiAuthPage() {
  const dispatch = useDispatch();

  const state: string = useSelector((state: any) => state.yoldi.currentAuthPage);

  const action = () => {
    dispatch(switchCurrentAuthPage());
  };

  return {
    currentAuthPage: state,
    switchCurrentAuthPage: action
  };
};

export function useYoldiAuthState() {
  const dispatch = useDispatch();

  const state: boolean = useSelector((state: any) => state.yoldi.isUserAuthenticated);

  const action = (v: boolean) => {
    dispatch(setIsUserAuthenticated({ isUserAuthenticated: v }));
  };

  return {
    isUserAuthenticated: state,
    setIsUserAuthenticated: action
  };
};

// export function useChangeAccountData() {
//   const dispatch = useDispatch();

//   const updateData = (id: string, email: string, token: string) => {
//     dispatch(updateAccountData({ id, email, token }));
//   };

//   const removeData = () => {
//     dispatch(removeAccountData());
//   };

//   return {
//     update: updateData,
//     remove: removeData
//   };
// };

export const {
  useGetProfileQuery,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation
} = usersApi;

// export const {
//   useFetchArticlesQuery,
//   useSaveArticleMutation,
//   useDeleteArticleMutation,
// } = articlesApi;


