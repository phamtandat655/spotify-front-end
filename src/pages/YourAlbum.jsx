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

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
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
      fetchAlbums();
    }
  }, [userId, navigate]);

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
              <div className='flex items-center mb-4'>
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
    </div>
  );
};

export default YourAlbum;