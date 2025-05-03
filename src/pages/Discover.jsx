import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { selectGenre } from '../redux/features/playerSlice';
import { useGetSongsByGenreQuery } from '../redux/services/spotifyApi';

const Discover = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { genre } = useSelector((state) => state.player);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songsData, isFetching: isFetchingSongs, error: songsError } = useGetSongsByGenreQuery(genre || 'pop');

  if (isFetchingSongs) return <Loader title="Đang tải bài hát..." />;

  if (songsError) {
    return <Error message={songsError?.data?.detail || 'Tải dữ liệu thất bại'} />;
  }

  const genreTitle = genre === 'pop' ? 'Pop' : genre.charAt(0).toUpperCase() + genre.slice(1);

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
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hiphop">Hip-Hop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Cổ Điển</option>
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