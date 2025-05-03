import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery } from '../redux/services/spotifyApi';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: searchData, isFetching, error } = useGetSongsBySearchQuery(searchTerm || '');

  const songs = searchData?.tracks || [];

  if (isFetching) {
    return <Loader title={searchTerm ? `Đang tìm kiếm "${searchTerm}"...` : 'Đang tải tất cả bài hát...'} />;
  }

  if (error) {
    return <Error message={error.data?.detail || 'Tìm kiếm thất bại'} />;
  }

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        {searchTerm ? (
          <>
            Kết quả cho <span className="font-black">{searchTerm}</span>
          </>
        ) : (
          'Tất Cả Bài Hát'
        )}
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs.length > 0 ? (
          songs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={songs}
              i={i}
            />
          ))
        ) : (
          <p className="text-spotify-light-gray text-lg">
            {searchTerm ? `Không tìm thấy bài hát nào cho "${searchTerm}"` : 'Không có bài hát nào'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;