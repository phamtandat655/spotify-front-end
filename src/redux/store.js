import { configureStore } from '@reduxjs/toolkit';
import { mockApi } from './services/spotifyApi'; 
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    [mockApi.reducerPath]: mockApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mockApi.middleware),
});