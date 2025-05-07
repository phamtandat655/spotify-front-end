import React from 'react';
import { Link } from 'react-router-dom';

const DetailsHeader = ({ artistData, songData }) => {
  if (artistData) {
    return (
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />

        <div className="absolute inset-0 flex items-center">
          <img
            alt="artist cover"
            src={artistData?.image || 'https://via.placeholder.com/150'}
            className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
          />

          <div className="ml-5">
            <p className="font-bold sm:text-3xl text-xl text-white">{artistData?.name || 'Không rõ nghệ sĩ'}</p>
            <p className="text-base text-gray-400 mt-2">
              {artistData?.genres?.join(', ') || 'Không rõ thể loại'}
            </p>
          </div>
        </div>

        <div className="w-full sm:h-44 h-24" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col">
      <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />

      <div className="absolute inset-0 flex items-center">
        <img
          alt="song cover"
          src={songData?.preview_url || 'https://via.placeholder.com/150'}
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />

        <div className="ml-5">
          <p className="font-bold sm:text-3xl text-xl text-white">{songData?.name || 'Không rõ bài hát'}</p>
          <Link to={songData?.artist?.id ? `/artist/${songData.artist.id}` : '/'}>
            <p className="text-base text-gray-400 mt-2">{songData?.artist?.name || 'Không rõ nghệ sĩ'}</p>
          </Link>
          <p className="text-base text-gray-400 mt-2">Nằm trong album : {songData?.album?.name || 'Không rõ'}</p>
        </div>
      </div>

      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};

export default DetailsHeader;