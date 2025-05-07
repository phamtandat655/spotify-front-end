import axios from 'axios';

// Tạo instance Axios cơ bản
const axiosBase = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm lấy token từ localStorage
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Hàm lưu token vào localStorage
const setTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem('access_token', access_token);
  if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
};

// Hàm xóa token khi đăng xuất
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Request interceptor: Thêm access_token vào header
axiosBase.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Xử lý lỗi 401 và làm mới token
axiosBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await axios.post('http://127.0.0.1:8000/api/user/token/refresh/', {
          refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        setTokens({ access_token: newAccessToken });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosBase(originalRequest);
      } catch (refreshError) {
        clearTokens();
        // Chuyển hướng đến trang login (bỏ comment nếu cần)
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Định nghĩa các hàm API
const spotifyApi = {
  getTopCharts: async () => {
    try {
      const response = await axiosBase.get('music/topcharts/');
      return { data: { tracks: { items: response.data.topCharts.tracks.items } } };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { tracks: { items: [] } } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  playTrack: async (trackId) => {
    try {
      const response = await axiosBase.patch(`music/tracks/${trackId}/play/`);
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'Track not found' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongsByGenre: async (genreName) => {
    try {
      const url = genreName === 'all' ? 'music/tracks/search?search_name=' : `music/tracks/genre/${genreName}/`;
      const response = await axiosBase.get(url, { params: genreName === 'all' ? {} : undefined });
      return { data: response.data.songsByGenre || response.data.songsBySearch?.tracks || [] };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getAllSongs: async () => {
    try {
      const response = await axiosBase.get('music/tracks/search', { params: {search_name : ""} });
      return { data: { tracks: response.data.songsBySearch?.tracks || [] } };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { tracks: [] } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongsBySearch: async (searchTerm) => {
    try {
      const response = await axiosBase.get('music/tracks/search', {
        params: searchTerm ? { search_name: searchTerm } : {search_name: ""},
      });
      return { data: { tracks: response.data.songsBySearch?.tracks || [] } };
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        return { data: { tracks: [] } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getArtistDetails: async (artistName) => {
    try {
      const response = await axiosBase.get(`music/tracks/artist/${artistName}/`);
      return { data: response.data.artistDetails || {} };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: {} };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongDetails: async (trackId) => {
    try {
      const response = await axiosBase.get(`music/tracks/tracksdetail/${trackId}/`);
      return { data: response.data.songDetails || {} };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: {} };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongRelated: async (trackId) => {
    try {
      const response = await axiosBase.get(`music/tracks/related-song/${trackId}/`);
      return { data: { tracks: response.data.songRelated?.tracks || [] } };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { tracks: [] } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getAlbums: async () => {
    try {
      const response = await axiosBase.get('music/tracks/albums/');
      return { data: response.data.albums || [] };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getUsers: async () => {
    try {
      const response = await axiosBase.get('user/');
      return { data: response.data.users || [] };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axiosBase.get('user/me/');
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        return { data: {} };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  registerUser: async ({ name, email, username, password }) => {
    try {
      const response = await axiosBase.post('user/register/', {
        name,
        email,
        username,
        password,
        password2: password,
      });
      return { data: response.data };
    } catch (error) {
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  loginUser: async ({ username, password }) => {
    try {
      const response = await axiosBase.post('user/login/', { username, password });
      setTokens({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      });
      return { data: response.data };
    } catch (error) {
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  logoutUser: async () => {
    try {
      const response = await axiosBase.post('user/logout/');
      clearTokens();
      return { data: response.data };
    } catch (error) {
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosBase.post('user/token/refresh/', { refresh: getRefreshToken() });
      setTokens({ access_token: response.data.access });
      return { data: response.data };
    } catch (error) {
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  createAlbum: async ({ userId, album }) => {
    try {
      const response = await axiosBase.post(`user/${userId}/albums/create/`, { name: album.name });
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'User not found' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  addTracksToAlbum: async ({ userId, albumId, trackIds }) => {
    try {
      const response = await axiosBase.post(`user/${userId}/albums/${albumId}/add-tracks/`, {
        track_ids: trackIds,
      });
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { message: 'Album or user not found', added_track_ids: [] } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  renameAlbum: async ({ albumId, name }) => {
    try {
      const response = await axiosBase.put(`user/albums/${albumId}/rename/`, { name });
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'Album not found' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  deleteAlbum: async ({ albumId }) => {
    try {
      const response = await axiosBase.delete(`user/albums/${albumId}/delete/`);
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'Album not found' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getUserAlbums: async (userId) => {
    try {
      const response = await axiosBase.get(`user/${userId}/albums/`);
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  addFavoriteTrack: async ({ userId, trackId }) => {
    try {
      const response = await axiosBase.post(`user/${userId}/favourites/`, { track_id: trackId });
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'User or track not found' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  removeFavoriteTrack: async ({ userId, trackId }) => {
    try {
      const response = await axiosBase.delete(`user/${userId}/favourites/${trackId}/`);
      return { data: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { detail: 'Track not in favorites' } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getFavoriteTracks: async (userId) => {
    try {
      const response = await axiosBase.get(`user/${userId}/favourites/list/`);
      return { data: response.data.map((item) => item.track) || [] };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },
  getGenres: async () => {
    try {
      const response = await axiosBase.get('music/genre/');
      return { data: response.data.genres || [] };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: [] };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },
  getArtistDetails: async (artistName) => {
    try {
      const response = await axiosBase.get(`music/artist/details/${artistName}/`);
      return { data: response.data.artistDetails || {} };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: {} };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongDetails: async (trackId) => {
    try {
      const response = await axiosBase.get(`music/tracks/tracksdetail/${trackId}/`);
      return { data: response.data.songDetails || {} };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: {} };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

  getSongRelated: async (trackId) => {
    try {
      const response = await axiosBase.get(`music/tracks/related-song/${trackId}/`);
      return { data: { tracks: response.data.songRelated?.tracks || [] } };
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { tracks: [] } };
      }
      return { error: { status: error.response?.status, data: error.response?.data || error.message } };
    }
  },

};

// Xuất spotifyApi để sử dụng trực tiếp trong các component
export { spotifyApi };

// Xuất các hàm với tên tương ứng (giữ nguyên để tương thích với code cũ nếu cần)
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
  useRefreshTokenMutation,
  useCreateAlbumMutation,
  useAddTracksToAlbumMutation,
  useRenameAlbumMutation,
  useDeleteAlbumMutation,
  useGetUserAlbumsQuery,
  useAddFavoriteTrackMutation,
  useRemoveFavoriteTrackMutation,
  useGetFavoriteTracksQuery,
} = spotifyApi;