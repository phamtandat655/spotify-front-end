import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyApi } from '../redux/services/spotifyApi';
import { Loader, Error } from '../components';

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingAlbums, setIsFetchingAlbums] = useState(true);
  const [error, setError] = useState(null);
  const [albumsError, setAlbumsError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      const fetchData = async () => {
        setIsFetching(true);
        const userProfile = await spotifyApi.getUserProfile();
        if (userProfile.error) {
          setError(userProfile.error);
        } else {
          setUser(userProfile.data);
          setName(userProfile.data.name || '');
          setEmail(userProfile.data.email || '');
        }
        setIsFetching(false);

        setIsFetchingAlbums(true);
        const albumsData = await spotifyApi.getUserAlbums(userId);
        if (albumsData.error) {
          setAlbumsError(albumsData.error);
        } else {
          setAlbums(albumsData.data || []);
        }
        setIsFetchingAlbums(false);
      };
      fetchData();
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!name.trim()) errors.name = 'Tên là bắt buộc';
    if (!email.trim()) errors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Định dạng email không hợp lệ';

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Tạm thời hiển thị thông báo vì endpoint PUT /user/me/ chưa tồn tại
      alert('Tính năng cập nhật hồ sơ hiện chưa khả dụng. Vui lòng liên hệ quản trị viên.');
      setEditMode(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const resp = await spotifyApi.logoutUser();
      if (resp.error) {
        throw resp.error;
      }
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      alert(err.data?.message || 'Đăng xuất thất bại');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleClickAlbum = (albumId) => {
    // Tạm thời hiển thị thông báo vì route /album/:albumId chưa tồn tại
    alert(`Tính năng xem chi tiết album ${albumId} hiện chưa khả dụng.`);
    // Nếu thêm route trong App.jsx, có thể sử dụng:
    // navigate(`/album/${albumId}`);
  };

  if (isFetching) return <Loader title="Đang tải hồ sơ..." />;
  if (error) return <Error message={error.data?.detail || 'Tải hồ sơ thất bại'} />;

  return (
    <div className="max-w-4xl mx-auto p-6 bgFen-spotify-black rounded-lg shadow-lg bg-[#121212] text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hồ Sơ Người Dùng</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300"
        >
          Đăng Xuất
        </button>
      </div>

      <div className="mb-8">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-spotify-light-gray">
                Tên
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-[#121212] w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green text-white"
                placeholder="Nhập tên của bạn"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-spotify-light-gray">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-[#121212] w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green text-white"
                placeholder="Nhập email của bạn"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            {formErrors.submit && (
              <p className="text-red-500 text-sm">{formErrors.submit}</p>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-spotify-green text-white rounded-lg bg-green-600 hover:bg-green-700"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>Tên:</strong> {user?.name || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-spotify-green text-white rounded-lg bg-green-600 hover:bg-green-700"
            >
              Chỉnh Sửa Hồ Sơ
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Album Của Bạn</h2>
        {isFetchingAlbums ? (
          <Loader title="Đang tải album..." />
        ) : albumsError ? (
          <Error message={albumsError.data?.detail || 'Tải album thất bại'} />
        ) : albums?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {albums.map((album) => (
              <div
                key={album.album_id}
                onClick={() => handleClickAlbum(album.album_id)}
                className="p-4 bg-spotify-dark-gray rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-600"
              >
                <img
                  src="https://picsum.photos/50"
                  alt={album.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{album.name}</h3>
                  <p className="text-sm text-spotify-light-gray">
                    Có: {album?.tracks?.length} bài hát
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-spotify-light-gray">Bạn chưa có album nào.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;