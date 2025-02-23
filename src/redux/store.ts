import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useDispatchBase, useSelector as useSelectorBase } from 'react-redux';
import snackbarSlice from '../slices/snackbarSlice/snackbar.slice';
import syncSlice from '../slices/syncSlice/sync.slice';
import serviceOrderSlice from '../slices/serviceOrderSlice/serviceOrder.slice';
import topBarSearchSlice from '../slices/topbarSearcSlice/topbarSearch.slice';
import soStatusSlice from '../slices/soStatusSlice/soStatus.slice';
import kvStatusSlice from '../slices/kvStatusSlice/kvStatus.slice';



export const store = configureStore({
  reducer: {
    snackbar: snackbarSlice.reducer,
    sync: syncSlice.reducer,
    serviceOrder: serviceOrderSlice.reducer,
    topBarSearch: topBarSearchSlice.reducer,
    soStatus: soStatusSlice.reducer,
    kvStatus: kvStatusSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Since we use typescript, lets utilize `useDispatch`
export const useDispatch = () => useDispatchBase<AppDispatch>();

// And utilize `useSelector`
export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
