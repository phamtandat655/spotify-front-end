import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { spotifyApi } from '../redux/services/spotifyApi';

const YourAlbum = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [albums, setAlbums] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchAlbums();
    }
  }, [userId, navigate]);

  useEffect(() => {
    // Clean up image preview URL on component unmount
    return () => {
      if (editImagePreview) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [editImagePreview]);

  const fetchAlbums = async () => {
    setIsFetching(true);
    const response = await spotifyApi.getUserAlbums(userId);
    if (response.error) {
      setError(response.error);
      setAlbums([]);
    } else {
      setAlbums(response.data || []);
    }
    setIsFetching(false);
  };

  const handleEditClick = (album) => {
    setEditModal(album.album_id);
    setEditName(album.name);
    setEditImage(null);
    setEditImagePreview(album.image);
    setEditErrors({});
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setEditErrors((prev) => ({
        ...prev,
        image: 'Chỉ hỗ trợ file JPEG hoặc PNG',
      }));
      setEditImage(null);
      setEditImagePreview(null);
    } else {
      setEditErrors((prev) => ({ ...prev, image: null }));
      setEditImage(file);
      if (file) {
        if (editImagePreview) {
          URL.revokeObjectURL(editImagePreview);
        }
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setEditImagePreview(null);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!editName.trim()) {
      newErrors.name = 'Tên album là bắt buộc';
    }

    setEditErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await spotifyApi.editAlbum({
          albumId: editModal,
          album: { name: editName, image: editImage },
        });
        if (response.error) {
          throw response.error;
        }
        setEditModal(null);
        fetchAlbums(); // Refresh album list
      } catch (err) {
        setEditErrors({
          submit: err.data?.detail || err.data?.message || 'Chỉnh sửa album thất bại',
        });
      }
    }
  };

  const handleDeleteClick = async (albumId, albumName) => {
    if (window.confirm(`Bạn có chắc muốn xóa album "${albumName}"?`)) {
      try {
        const response = await spotifyApi.deleteAlbum(albumId);
        if (response.error) {
          throw response.error;
        }
        fetchAlbums(); // Refresh album list
      } catch (err) {
        setError({ data: { detail: err.data?.detail || 'Xóa album thất bại' } });
      }
    }
  };

  if (isFetching) return <Loader title="Đang tải album của bạn..." />;

  if (error) return <Error message={error.data?.detail || 'Tải album thất bại'} />;

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <h1 className="font-bold text-3xl text-white text-left mb-10">Album Của Bạn</h1>
      {albums.length === 0 ? (
        <div>
          <h2 className="font-bold text-2xl text-white text-left mb-3">Chưa có album nào</h2>
          <p className="text-white text-spotify-light-gray text-lg">
            Vui lòng tạo một album bằng nút "Tạo Album" trên trang Khám Phá.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-spotify-green text-white rounded-lg bg-green-600 hover:bg-green-700"
          >
            Đi đến trang Khám Phá
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {albums.map((album) => (
            <div
              key={album.album_id}
              className="bg-[#121212] text-white bg-spotify-dark-gray rounded-lg p-6 shadow-lg mb-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-16 h-16 object-cover rounded-lg mr-5"
                  />
                  <div>
                    <h2 className="font-bold text-2xl text-white">
                      {album.name || 'Album không xác định'}
                    </h2>
                    <p className="text-spotify-light-gray text-lg">
                      Có: {album?.tracks?.length} bài hát
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(album)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(album.album_id, album.name)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {album.tracks && album.tracks.length > 0 ? (
                  album.tracks.map((track, i) => (
                    <SongCard
                      key={track.id}
                      song={track}
                      isPlaying={isPlaying}
                      activeSong={activeSong}
                      data={album.tracks}
                      i={i}
                    />
                  ))
                ) : (
                  <p className="text-spotify-light-gray text-lg">
                    Không có bài hát nào trong album này
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Chỉnh Sửa Album</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label htmlFor="editName" className="text-white block text-sm font-medium mb-1 text-spotify-light-gray">
                  Tên Album
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-spotify-green"
                  placeholder="Nhập tên album"
                />
                {editErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="editImage" className="text-white block text-sm font-medium mb-1 text-spotify-light-gray">
                  Ảnh Album (JPEG hoặc PNG)
                </label>
                <input
                  type="file"
                  id="editImage"
                  accept="image/jpeg,image/png"
                  onChange={handleEditImageChange}
                  className="w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg text-black"
                />
                {editImagePreview && (
                  <div className="mt-2">
                    <img
                      src={editImagePreview}
                      alt="Album preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                    />
                  </div>
                )}
                {editErrors.image && (
                  <p className="text-red-500 text-sm mt-1">{editErrors.image}</p>
                )}
              </div>
              {editErrors.submit && (
                <p className="text-red-500 text-sm">{editErrors.submit}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-spotify-green text-white rounded-lg bg-green-600 hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourAlbum;