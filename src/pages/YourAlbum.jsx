import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Error, Loader } from '../components';
import { useGetUserAlbumsQuery } from '../redux/services/spotifyApi';

const YourAlbum = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: albums, isFetching, error } = useGetUserAlbumsQuery(userId, { skip: !userId });

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  if (isFetching) return <Loader title="Đang tải album của bạn..." />;

  if (error) return <Error message={error.data?.detail || 'Tải album thất bại'} />;

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <h1 className="font-bold text-3xl text-white text-left mb-10">Album Của Bạn</h1>
      {albums?.length === 0 ? (
        <div className="mt-10">
          <h2 className="font-bold text-2xl text-white text-left mb-3">Chưa có album nào</h2>
          <p className="text-spotify-light-gray text-lg">
            Vui lòng tạo một album bằng nút "Tạo Album" trên trang Khám Phá.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-spotify-green text-white rounded-lg hover:bg-green-600"
          >
            Đi đến trang Khám Phá
          </button>
        </div>
      ) : (
        albums?.map((album) => (
          <div key={album.album_id}>
            <h2 className="font-bold text-2xl text-white text-left mt-10 mb-3">
              {album.name || 'Album không xác định'}
            </h2>
            <p className="text-spotify-light-gray text-lg mb-4">
              Tạo ngày: {new Date(album.created_at).toLocaleDateString()}
            </p>
            <p className="text-spotify-light-gray text-lg">
              Danh sách bài hát trong album hiện chưa khả dụng.
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default YourAlbum;