import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/',
    credentials: 'include', // Include cookies for session-based authentication
    prepareHeaders: (headers) => {
      // Add CSRF token for POST/PUT/DELETE requests
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1];
      if (csrfToken) {
        headers.set('X-CSRFToken', csrfToken);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Music-related endpoints
    getTopCharts: builder.query({
      query: () => 'music/topcharts/',
      transformResponse: (response) => ({
        tracks: { items: response.topCharts.tracks.items },
      }),
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { tracks: { items: [] } };
        }
        return response;
      },
    }),
    playTrack: builder.mutation({
      query: (trackId) => ({
        url: `music/tracks/${trackId}/play/`,
        method: 'PATCH',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'Track not found' };
        }
        return response;
      },
    }),
    getSongsByGenre: builder.query({
      query: (genreName) => {
        if (genreName === 'all') {
          return {
            url: 'music/tracks/search/',
            params: {},
          };
        }
        return `music/tracks/genre/${genreName}/`;
      },
      transformResponse: (response) => {
        return response.songsByGenre || response.songsBySearch?.tracks || [];
      },
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return [];
        }
        return response;
      },
    }),
    getAllSongs: builder.query({
      query: () => ({
        url: 'music/tracks/search/',
        params: {},
      }),
      transformResponse: (response) => ({
        tracks: response.songsBySearch?.tracks || [],
      }),
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { tracks: [] };
        }
        return response;
      },
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => ({
        url: 'music/tracks/search',
        params: searchTerm ? { search_name: searchTerm } : {},
      }),
      transformResponse: (response) => ({
        tracks: response.songsBySearch?.tracks || [],
      }),
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { tracks: [] };
        }
        return response;
      },
    }),
    getArtistDetails: builder.query({
      query: (artistName) => `music/tracks/artist/${artistName}/`,
      transformResponse: (response) => response.artistDetails || {},
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return {};
        }
        return response;
      },
    }),
    getSongDetails: builder.query({
      query: (trackId) => `music/tracks/tracksdetail/${trackId}/`,
      transformResponse: (response) => response.songDetails || {},
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return {};
        }
        return response;
      },
    }),
    getSongRelated: builder.query({
      query: (trackId) => `music/tracks/related-song/${trackId}/`,
      transformResponse: (response) => ({
        tracks: response.songRelated?.tracks || [],
      }),
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { tracks: [] };
        }
        return response;
      },
    }),
    getAlbums: builder.query({
      query: () => 'music/tracks/albums/',
      transformResponse: (response) => response.albums || [],
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return [];
        }
        return response;
      },
    }),
    // User-related endpoints
    getUsers: builder.query({
      query: () => 'user/',
      transformResponse: (response) => response.users || [],
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return [];
        }
        return response;
      },
    }),
    getUserProfile: builder.query({
      query: () => 'user/me/',
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404 || response.status === 401) {
          return {};
        }
        return response;
      },
    }),
    registerUser: builder.mutation({
      query: ({ name, email, username, password }) => ({
        url: 'user/register/',
        method: 'POST',
        body: { name, email, username, password, password2: password },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
    loginUser: builder.mutation({
      query: ({ username, password }) => ({
        url: 'user/login/',
        method: 'POST',
        body: { username, password },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: 'user/logout/',
        method: 'POST',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
    createAlbum: builder.mutation({
      query: ({ userId, album }) => ({
        url: `user/${userId}/albums/create/`,
        method: 'POST',
        body: { name: album.name },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'User not found' };
        }
        return response;
      },
    }),
    addTracksToAlbum: builder.mutation({
      query: ({ userId, albumId, trackIds }) => ({
        url: `user/${userId}/albums/${albumId}/add-tracks/`,
        method: 'POST',
        body: { track_ids: trackIds },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { message: 'Album or user not found', added_track_ids: [] };
        }
        return response;
      },
    }),
    renameAlbum: builder.mutation({
      query: ({ albumId, name }) => ({
        url: `user/albums/${albumId}/rename/`,
        method: 'PUT',
        body: { name },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'Album not found' };
        }
        return response;
      },
    }),
    deleteAlbum: builder.mutation({
      query: ({ albumId }) => ({
        url: `user/albums/${albumId}/delete/`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'Album not found' };
        }
        return response;
      },
    }),
    getUserAlbums: builder.query({
      query: (userId) => `user/${userId}/albums/`,
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return [];
        }
        return response;
      },
    }),
    addFavoriteTrack: builder.mutation({
      query: ({ userId, trackId }) => ({
        url: `user/${userId}/favourites/`,
        method: 'POST',
        body: { track_id: trackId },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'User or track not found' };
        }
        return response;
      },
    }),
    removeFavoriteTrack: builder.mutation({
      query: ({ userId, trackId }) => ({
        url: `user/${userId}/favourites/${trackId}/`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { detail: 'Track not in favorites' };
        }
        return response;
      },
    }),
    getFavoriteTracks: builder.query({
      query: (userId) => `user/${userId}/favourites/list/`,
      transformResponse: (response) =>
        response.map((item) => item.track) || [],
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return [];
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  usePlayTrackMutation,
  useGetSongsByGenreQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetAlbumsQuery,
  useGetAllSongsQuery,
  useGetUsersQuery,
  useGetUserProfileQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCreateAlbumMutation,
  useAddTracksToAlbumMutation,
  useRenameAlbumMutation,
  useDeleteAlbumMutation,
  useGetUserAlbumsQuery,
  useAddFavoriteTrackMutation,
  useRemoveFavoriteTrackMutation,
  useGetFavoriteTracksQuery,
} = spotifyApi;