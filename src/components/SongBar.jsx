/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';

const SongBar = ({ song, i, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div
    className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
      activeSong?.id === song?.id ? 'bg-[#4c426e]' : 'bg-transparent'
    } py-2 p-4 rounded-lg cursor-pointer mb-2`}
  >
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        className="w-20 h-20 rounded-lg"
        src={song?.image || 'https://via.placeholder.com/150'}
        alt={song?.name || 'Bài hát'}
      />
      <div className="flex-1 flex flex-col justify-center mx-3">
        {!artistId ? (
          <Link to={song?.id ? `/songs/${song.id}` : '#'}>
            <p className="text-xl font-bold text-white">{song?.name || 'Không rõ tiêu đề'}</p>
          </Link>
        ) : (
          <p className="text-xl font-bold text-white">{song?.name || 'Không rõ tiêu đề'}</p>
        )}
        <p className="text-base text-gray-300 mt-1">
          {artistId ? song?.artist?.name : song?.genre || 'Không rõ thể loại'}
        </p>
      </div>
    </div>
    {!artistId ? (
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    ) : null}
  </div>
);

export default SongBar;