import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery, useGetSongRelatedQuery } from '../redux/services/spotifyApi';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songData, isFetching: isFetchingSong, error: songError } = useGetSongDetailsQuery(songid);
  const { data: relatedSongsData, isFetching: isFetchingRelated, error: relatedError } = useGetSongRelatedQuery(songid);

  const relatedSongs = relatedSongsData?.tracks || [];

  useEffect(() => {
    if (songError || relatedError) {
      console.error('Error:', songError || relatedError);
    }
  }, [songError, relatedError]);

  if (isFetchingSong) return <Loader title="Đang tải chi tiết bài hát..." />;
  if (songError) return <Error message={songError.data?.detail || 'Không tìm thấy bài hát'} />;
  if (!songData) return <Error message="Không tìm thấy bài hát" />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedSongs, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <DetailsHeader songData={songData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lời Bài Hát:</h2>
        <div className="mt-5">
          <p className="text-spotify-light-gray text-base my-1">Xin lỗi, hiện không có lời bài hát!</p>
        </div>
      </div>

      {isFetchingRelated ? (
        <Loader title="Đang tải bài hát liên quan..." />
      ) : relatedError ? (
        <Error message={relatedError.data?.detail || 'Không tải được bài hát liên quan'} />
      ) : (
        <RelatedSongs
          data={relatedSongs}
          artistId={songData?.artist?.id || null}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
      )}
    </div>
  );
};

export default SongDetails;