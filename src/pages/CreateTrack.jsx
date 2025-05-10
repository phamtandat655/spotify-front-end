import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyApi } from '../redux/services/spotifyApi';

const CreateTrack = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    genreIds: [],
    artistId: '',
    image_url: null,
    video_url: null,
  });
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchGenre, setSearchGenre] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Check admin role
  const userRole = localStorage.getItem('userRole');
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/'); // Redirect to home if not admin
    }
  }, [userRole, navigate]);

  // Fetch genres and artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genresResponse = await spotifyApi.getGenres();
        const artistsResponse = await spotifyApi.getArtists();
        if (genresResponse.error) throw new Error('Failed to fetch genres');
        if (artistsResponse.error) throw new Error('Failed to fetch artists');
        setGenres(genresResponse.data || []);
        setArtists(artistsResponse.data.artists || []);
      } catch (err) {
        setErrors({ fetch: err.message });
      }
    };
    fetchData();
  }, []);

  const handleGenreSelection = (genreId) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchGenre.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Tên bài hát là bắt buộc';
    if (!formData.artistId) newErrors.artistId = 'Vui lòng chọn nghệ sĩ';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      formData.genreIds.forEach((gid) => data.append('genreIds', gid));
      data.append('artistId', formData.artistId);
      if (formData.image_url) data.append('image_url', formData.image_url);
      if (formData.video_url) data.append('video_url', formData.video_url);

      try {
        const response = await spotifyApi.createTrack(data);
        if (response.error) {
          throw new Error(response.error.data.errors || 'Failed to create track');
        }
        setSuccess('Bài hát đã được tạo thành công!');
        setFormData({
          name: '',
          genreIds: [],
          artistId: '',
          image_url: null,
          video_url: null,
        });
        setSearchGenre('');
        setErrors({});
        navigate('/');
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#121212] rounded-lg shadow-lg text-white mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Tạo Bài Hát Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Tên bài hát
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
            placeholder="Nhập tên bài hát"
          />
          {errors.name && <p className="text-[#ef4444] text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#b3b3b3]">Thể loại</label>
          <input
            type="text"
            value={searchGenre}
            onChange={(e) => setSearchGenre(e.target.value)}
            placeholder="Tìm kiếm thể loại"
            className="w-full p-2 mb-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white placeholder-[#b3b3b3]"
          />
          <div className="max-h-48 overflow-y-auto bg-[#242424] border border-[#3f3f3f] rounded-lg p-2">
            {filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex items-center space-x-2 p-2 hover:bg-[#3f3f3f] rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.genreIds.includes(genre.id)}
                    onChange={() => handleGenreSelection(genre.id)}
                    className="h-5 w-5 text-[#1db954] rounded focus:ring-[#1db954]"
                  />
                  <span>{genre.name}</span>
                </label>
              ))
            ) : (
              <p className="p-2 text-[#b3b3b3]">Không tìm thấy thể loại nào</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="artistId" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Nghệ sĩ
          </label>
          <select
            id="artistId"
            value={formData.artistId}
            onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] text-white"
          >
            <option value="">Chọn nghệ sĩ</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          {errors.artistId && <p className="text-[#ef4444] text-sm mt-1">{errors.artistId}</p>}
          {artists.length === 0 && (
            <p className="text-[#b3b3b3] text-sm mt-1">Không có nghệ sĩ nào</p>
          )}
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Ảnh bài hát (JPG, PNG)
          </label>
          <input
            type="file"
            id="image_url"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, 'image_url')}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg text-white"
          />
        </div>

        <div>
          <label htmlFor="video_url" className="block text-sm font-medium mb-1 text-[#b3b3b3]">
            Video bài hát (MP4)
          </label>
          <input
            type="file"
            id="video_url"
            accept="video/mp4"
            onChange={(e) => handleFileChange(e, 'video_url')}
            className="w-full p-2 bg-[#242424] border border-[#3f3f3f] rounded-lg text-white"
          />
        </div>

        {errors.fetch && <p className="text-[#ef4444] text-sm">{errors.fetch}</p>}
        {errors.submit && <p className="text-[#ef4444] text-sm">{errors.submit}</p>}
        {success && <p className="text-[#1db954] text-sm">{success}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#1db954] text-white rounded-lg hover:bg-[#1ed760] disabled:bg-[#a3a3a3] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Đang tạo...' : 'Tạo Bài Hát'}
        </button>
      </form>
    </div>
  );
};

export default CreateTrack;