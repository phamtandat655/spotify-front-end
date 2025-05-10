import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Error } from '../components';
import { spotifyApi } from '../redux/services/spotifyApi';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [songsList, setSongsList] = useState([]);
  const [isFetchingSongs, setIsFetchingSongs] = useState(true);
  const [error, setError] = useState(null);
  const [albumName, setAlbumName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({});
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [isAddingTracks, setIsAddingTracks] = useState(false);

  const filteredSongs = songsList.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      const fetchData = async () => {
        // Fetch songs
        setIsFetchingSongs(true);
        const songsResponse = await spotifyApi.getSongsBySearch('');
        if (songsResponse.error) {
          setError(songsResponse.error);
        } else {
          setSongsList(songsResponse.data.tracks || []);
        }
        setIsFetchingSongs(false);
      };
      fetchData();
    }
  }, [userId, navigate]);

  useEffect(() => {
    // Clean up image preview URL on component unmount
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSongSelection = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Chỉ hỗ trợ file JPEG hoặc PNG',
      }));
      setImage(null);
      setImagePreview(null);
    } else {
      setErrors((prev) => ({ ...prev, image: null }));
      setImage(file);
      if (file) {
        // Revoke previous preview URL to prevent memory leak
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        // Create new preview URL
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!albumName.trim()) {
      newErrors.albumName = 'Tên album là bắt buộc';
    }
    if (selectedSongs.length === 0) {
      newErrors.selectedSongs = 'Phải chọn ít nhất một bài hát';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsCreatingAlbum(true);
        const albumResponse = await spotifyApi.createAlbum({
          userId,
          album: { name: albumName, image },
        });
        if (albumResponse.error) {
          throw albumResponse.error;
        }
        const albumId = albumResponse.data.album_id;

        setIsAddingTracks(true);
        const tracksResponse = await spotifyApi.addTracksToAlbum({
          userId,
          albumId,
          trackIds: selectedSongs,
        });
        if (tracksResponse.error) {
          throw tracksResponse.error;
        }

        navigate('/profile');
      } catch (err) {
        setErrors({
          submit: err.data?.detail || err.data?.message || 'Tạo album thất bại',
        });
      } finally {
        setIsCreatingAlbum(false);
        setIsAddingTracks(false);
      }
    }
  };

  if (isFetchingSongs) return <Loader title="Đang tải dữ liệu..." />;
  if (error) return <Error message={error.data?.detail || 'Tải dữ liệu thất bại'} />;

  return (
    <div className="bg-[#121212] max-w-2xl mx-auto p-6 bg-spotify-black rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Tạo Album Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div>
          <label htmlFor="albumName" className="block text-sm font-medium mb-1 text-spotify-light-gray">
            Tên Album
          </label>
          <input
            type="text"
            id="albumName"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="text-[#121212] w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green text-white"
            placeholder="Nhập tên album"
          />
          {errors.albumName && (
            <p className="text-red-500 text-sm mt-1">{errors.albumName}</p>
          )}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1 text-spotify-light-gray">
            Ảnh Album (JPEG hoặc PNG)
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="text-[#121212] w-full p-2 bg-spotify-dark-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green text-white"
          />
          {imagePreview && (
            <div className="w-full flex justify-center mt-2">
              <img
                src={imagePreview}
                alt="Album preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-spotify-light-gray">Chọn Bài Hát</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài hát theo tên"
            className="text-[#121212] w-full p-2 mb-2 bg-spotify-dark-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-spotify-green text-white"
          />
          <div className="max-h-48 overflow-y-auto bg-spotify-dark-gray border border-gray-600 rounded-lg p-2">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <label
                  key={song.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSongSelection(song.id)}
                    className="text-[#121212] h-5 w-5 text-spotify-green rounded focus:ring-spotify-green"
                  />
                  <span>
                    {song.name} - {song.artist?.name || 'Không rõ nghệ sĩ'}
                  </span>
                </label>
              ))
            ) : (
              <p className="p-2 text-spotify-light-gray">Không tìm thấy bài hát nào</p>
            )}
          </div>
          {errors.selectedSongs && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedSongs}</p>
          )}
        </div>
        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}
        <div className="text-center">
          <button
            type="submit"
            disabled={isCreatingAlbum || isAddingTracks}
            className="bg-green-600 px-6 py-2 bg-spotify-green text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
          >
            Tạo Album
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlbum;