import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, SongCard } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { spotifyApi } from '../redux/services/spotifyApi';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [songData, setSongData] = useState(null);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [isFetchingSong, setIsFetchingSong] = useState(true);
  const [songError, setSongError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingSong(true);
      const songResponse = await spotifyApi.getSongDetails(songid);
      if (songResponse.error) {
        setSongError(songResponse.error);
        setSongData(null);
        setRelatedSongs([]);
      } else {
        setSongData(songResponse.data);
        setRelatedSongs(songResponse.data.relatedSongs || []);
      }
      setIsFetchingSong(false);
    };
    fetchData();
  }, [songid]);

  useEffect(() => {
    if (songError) {
      console.error('Error:', songError);
    }
  }, [songError]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedSongs, i }));
    dispatch(playPause(true));
  };

  if (isFetchingSong) return <Loader title="Đang tải chi tiết bài hát..." />;
  if (songError) return <Error message={songError.data?.detail || 'Không tìm thấy bài hát'} />;
  if (!songData) return <Error message="Không tìm thấy bài hát" />;

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <DetailsHeader songData={songData} />

      {/* <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lời Bài Hát:</h2>
        <div className="mt-5">
          <p className="text-spotify-light-gray text-base my-1">Xin lỗi, hiện không có lời bài hát!</p>
        </div>
      </div> */}

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Bài Hát Liên Quan:</h2>
        <div className="mt-5 flex flex-wrap sm:justify-start justify-center gap-8">
          {relatedSongs.length > 0 ? (
            relatedSongs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={relatedSongs}
                i={i}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, i)}
              />
            ))
          ) : (
            <p className="text-spotify-light-gray text-base">Không có bài hát liên quan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;