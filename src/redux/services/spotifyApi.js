import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import mockData from '../../data/mockData.json';

export const mockApi = createApi({
  reducerPath: 'mockApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      queryFn: () => ({
        data: mockData.topCharts,
      }),
    }),
    getSongsByGenre: builder.query({
      queryFn: (albumId) => {
        if (!albumId || albumId === 'all') {
          return { data: mockData.songsByGenre };
        }
        const album = mockData.albums.find((a) => a.id === albumId);
        return { data: album ? album.tracks : [] };
      },
    }),
    getSongsByCountry: builder.query({
      queryFn: () => ({
        data: mockData.songsByCountry,
      }),
    }),
    getSongsBySearch: builder.query({
      queryFn: (searchTerm) => {
        const filteredTracks = mockData.songsBySearch.tracks.filter((song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { data: { tracks: filteredTracks } };
      },
    }),
    getArtistDetails: builder.query({
      queryFn: (artistId) => ({
        data: mockData.artistDetails.find((artist) => artist.id === artistId) || mockData.artistDetails[0],
      }),
    }),
    getSongDetails: builder.query({
      queryFn: ({ songid }) => ({
        data: mockData.songDetails.find((song) => song.id === songid) || mockData.songDetails[0],
      }),
    }),
    getSongRelated: builder.query({
      queryFn: ({ songid }) => ({
        data: mockData.songRelated,
      }),
    }),
    getAlbums: builder.query({
      queryFn: () => ({
        data: mockData.albums,
      }),
    }),
    getAllSongs: builder.query({
      queryFn: () => {
        const allSongs = [
          ...mockData.topCharts.tracks.items,
          ...mockData.songsByGenre,
          ...mockData.songsByCountry,
          ...mockData.songsBySearch.tracks,
          ...mockData.songDetails,
          ...mockData.songRelated.tracks,
          ...mockData.albums.flatMap((album) => album.tracks),
        ];

        // Remove duplicates by song ID
        const uniqueSongs = Array.from(
          new Map(allSongs.map((song) => [song.id, song])).values()
        );

        return { data: { tracks: uniqueSongs } };
      },
    }),
    getAlbumsByUserId: builder.query({
      queryFn: (userId) => {
        if (!userId) {
          return [];
        }
        const user = mockData.users.find((u) => u.id === userId);
        if (!user) {
          return { error: { status: 404, data: 'User not found' } };
        }
        return { data: user.albums || [] };
      },
    }),
    getUserProfile: builder.query({
      queryFn: (userId) => {
        const user = mockData.users.find((u) => u.id === userId);
        if (!user) {
          return { error: { status: 'NOT_FOUND', data: 'User not found' } };
        }
        return { data: user };
      },
    }),
    updateUserProfile: builder.mutation({
      queryFn: ({ userId, name, email }) => {
        const user = mockData.users.find((u) => u.id === userId);
        if (!user) {
          return { error: { status: 'NOT_FOUND', data: 'User not found' } };
        }
        // Simulate updating user data (in a real app, this would update the backend)
        user.name = name;
        user.email = email;
        return { data: user };
      },
    }),
    registerUser: builder.mutation({
      queryFn: ({ name, email, password }) => {
        const existingUser = mockData.users.find((u) => u.email === email);
        if (existingUser) {
          return { error: { status: 'CONFLICT', data: 'Email already exists' } };
        }
        const newUser = {
          id: `user${mockData.users.length + 1}`,
          name,
          email,
          password, // In a real app, hash the password
          albums: [],
        };
        mockData.users.push(newUser);
        return { data: newUser };
      },
    }),
    loginUser: builder.mutation({
      queryFn: ({ email, password }) => {
        const user = mockData.users.find(
          (u) => u.email === email && u.password === password
        );
        if (!user) {
          return { error: { status: 'UNAUTHORIZED', data: 'Invalid email or password' } };
        }
        return { data: { id: user.id, name: user.name, email: user.email } };
      },
    }),
  }),
});


export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetAlbumsQuery,
  useGetAllSongsQuery,
  useGetAlbumsByUserIdQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
} = mockApi;