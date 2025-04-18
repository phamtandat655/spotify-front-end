import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import mockData from '../data/mockData.json'; // Adjust path based on your project structure

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [songData, setSongData] = useState(null);
  const [artistId, setArtistId] = useState(null);

  // Find song details in mockData
  const findSong = (id) => {
    const allSongs = [
      ...mockData.songDetails,
      ...mockData.topCharts.tracks.items,
      ...mockData.songsByGenre,
      ...mockData.songsByCountry,
      ...mockData.songsBySearch.tracks,
      ...mockData.songRelated.tracks,
      ...mockData.albums.flatMap((album) => album.tracks),
      ...mockData.artistDetails.flatMap((artist) => artist.topSongs),
    ];
    return allSongs.find((song) => song.id === id);
  };

  useEffect(() => {
    const song = findSong(songid);
    setSongData(song);

    if (song != null) {
      setArtistId(song?.artists?.id);
    }
  }, [songid])
  
  const relatedSongs = mockData.songRelated.tracks;

  // Simulate loading state (optional, can be removed if instant)
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 500); // Simulate API delay
  }, []);

  // Handle errors
  if (isLoading) return <Loader title="Searching song details" />;
  if (!songData) return <Error message="Song not found" />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedSongs, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader songData={songData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          <p className="text-gray-400 text-base my-1">Sorry, no lyrics found!</p>
        </div>
      </div>

      <RelatedSongs
        data={relatedSongs}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;