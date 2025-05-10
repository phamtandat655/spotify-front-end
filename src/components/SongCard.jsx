import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { spotifyApi } from '../redux/services/spotifyApi';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const [downloadError, setDownloadError] = useState(null);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    console.log('Playing song with video:', song.video_url);
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const handleDownloadClick = () => {
    const songTitle = song.name || 'Không rõ tiêu đề';
    if (window.confirm(`Bạn có muốn tải bài hát ${songTitle}?`)) {
      handleConfirmDownload();
    }
  };

  const handleConfirmDownload = async () => {
    try {
      const response = await spotifyApi.downloadTrack(song.id);
      if (response.error) {
        throw response.error;
      }

      // Extract filename from Content-Disposition header or use default
      let filename = `song-${song.id}.mp4`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadError(null);
    } catch (err) {
      const errorMessage = err.data?.detail || err.data?.message || 'Tải xuống thất bại';
      setDownloadError(errorMessage);
      alert(errorMessage);
    }
  };

  const songTitle = song.name || 'Không rõ tiêu đề';
  const songKey = song.id || `song-${i}`;
  const songSubtitle = song.artist?.name || 'Không rõ nghệ sĩ';
  const artistId = song.artist?.id || null;

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.id === song.id ? 'flex bg-black bg-opacity-70' : 'hidden'
          }`}
        >
          <PlayPause
            isPlaying={isPlaying && activeSong?.id === song.id}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img
          alt="song_img"
          src={song?.image_url || 'https://via.placeholder.com/150'}
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-lg text-white truncate flex-1">
            <Link to={`/songs/${songKey}`}>{songTitle}</Link>
          </p>
          <button
            onClick={handleDownloadClick}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Download song"
            title="Tải xuống bài hát"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm truncate text-gray-300 mt-1">
          {artistId ? (
            <Link to={`/artist/${artistId}`}>{songSubtitle}</Link>
          ) : (
            songSubtitle
          )}
        </p>
      </div>
    </div>
  );
};

export default SongCard;