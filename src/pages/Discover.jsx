import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { selectGenre } from '../redux/features/playerSlice';
import { spotifyApi } from '../redux/services/spotifyApi';

const Discover = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { genre } = useSelector((state) => state.player);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [songsData, setSongsData] = useState({ tracks: [] });
  const [isFetchingSongs, setIsFetchingSongs] = useState(true);
  const [songsError, setSongsError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isFetchingGenres, setIsFetchingGenres] = useState(true);
  const [genresError, setGenresError] = useState(null);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      setIsFetchingGenres(true);
      const response = await spotifyApi.getGenres();
      if (response.error) {
        setGenresError(response.error);
        // Fallback to default genres if API fails
        setGenres([
          { id: 1, name: 'Pop' },
          { id: 2, name: 'Rock' }
        ]);
      } else {
        setGenres(response.data);
      }
      setIsFetchingGenres(false);
    };
    fetchGenres();
  }, []);

  // Fetch songs by genre
  useEffect(() => {
    const fetchSongs = async () => {
      setIsFetchingSongs(true);
      const response = await spotifyApi.getSongsByGenre(genre || 'pop');
      if (response.error) {
        setSongsError(response.error);
      } else {
        setSongsData({ tracks: response.data || [] });
      }
      setIsFetchingSongs(false);
    };
    fetchSongs();
  }, [genre]);

  // Normalize genre name for display
  const normalizeGenreDisplay = (genreName) => {
    if (genreName.toLowerCase() === 'pop') return 'Pop';
    if (genreName.toLowerCase() === 'hip-hop') return 'Hip-Hop';
    if (genreName.toLowerCase() === 'r&b') return 'R&B';
    return genreName.charAt(0).toUpperCase() + genreName.slice(1);
  };

  // Normalize genre name for API
  const normalizeGenreValue = (genreName) => {
    if (genreName.toLowerCase() === 'hip-hop') return 'hiphop';
    if (genreName.toLowerCase() === 'r&b') return 'rnb';
    return genreName.toLowerCase();
  };

  if (isFetchingSongs || isFetchingGenres) return <Loader title="Đang tải dữ liệu..." />;

  if (songsError) {
    return <Error message={songsError?.data?.detail || 'Tải dữ liệu thất bại'} />;
  }

  if (genresError) {
    console.warn('Failed to load genres:', genresError.data?.detail || 'Unknown error');
  }

  const genreTitle = normalizeGenreDisplay(genre || 'pop');

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Khám Phá {genreTitle}</h2>
        
        <div className="flex justify-between items-center mb-4">
          <select
            onChange={(e) => dispatch(selectGenre(e.target.value))}
            value={genre || 'pop'}
            className="bg-spotify-dark-gray text-spotify-light-gray px-4 py-2 text-sm rounded-lg outline-none sm:mt-0 mt-5"
          >
            {genres.map((g) => (
              <option key={g.id} value={normalizeGenreValue(g.name)}>
                {normalizeGenreDisplay(g.name)}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate('/create-album')}
            className="px-4 py-2 ml-3 bg-spotify-green text-white bg-[#1DB954] rounded-lg hover:bg-[#20743d]"
          >
            Tạo Album
          </button>
        </div>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songsData?.tracks?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songsData.tracks}
            i={i}
          />
        )) || <p className="text-spotify-light-gray text-white text-3xl">Không có bài hát nào.</p>}
      </div>
    </div>
  );
};

export default Discover;