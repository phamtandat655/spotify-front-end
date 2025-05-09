import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Error } from '../components';
import { spotifyApi } from '../redux/services/spotifyApi';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [songsList, setSongsList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [albumName, setAlbumName] = useState('');
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
      const fetchSongs = async () => {
        setIsFetching(true);
        const response = await spotifyApi.getSongsBySearch('');
        if (response.error) {
          setError(response.error);
        } else {
          setSongsList(response.data.tracks || []);
        }
        setIsFetching(false);
      };
      fetchSongs();
    }
  }, [userId, navigate]);

  const handleSongSelection = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
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
        const albumResponse = await spotifyApi.createAlbum({ userId, album: { name: albumName } });
        if (albumResponse.error) {
          throw albumResponse.error;
        }
        const albumId = albumResponse.data.album_id;

        setIsAddingTracks(true);
        const tracksResponse = await spotifyApi.addTracksToAlbum({ userId, albumId, trackIds: selectedSongs });
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

  if (isFetching) return <Loader title="Đang tải bài hát..." />;
  if (error) return <Error message={error.data?.detail || 'Tải bài hát thất bại'} />;

  return (
    <div className="bg-[#121212] max-w-2xl mx-auto p-6 bg-spotify-black rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Tạo Album Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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