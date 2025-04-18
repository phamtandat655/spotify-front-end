import React from 'react';
import { Link } from 'react-router-dom';

const DetailsHeader = ({ artistData, songData }) => {
  if (artistData) {
    return (
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />
    
        <div className="absolute inset-0 flex items-center">
          <img
            alt="album cover"
            src={artistData?.image || 'https://via.placeholder.com/150'}
            className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
          />
    
          <div className="ml-5">
            <p className="text-base text-gray-400 mt-2">{artistData?.name || 'Unknown Artist'}</p>
            <p className="text-base text-gray-400 mt-2">{artistData?.genres?.toString() || 'Unknown Genre'}</p>
          </div>
        </div>
    
        <div className="w-full sm:h-44 h-24" />
      </div>
    )
  }

  return (
    <div className="relative w-full flex flex-col">
      <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />
  
      <div className="absolute inset-0 flex items-center">
        <img
          alt="album cover"
          src={songData?.album?.image || 'https://via.placeholder.com/150'}
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />
  
        <div className="ml-5">
          <p className="font-bold sm:text-3xl text-xl text-white">{songData?.name || 'Unknown Song'}</p>
          <Link to={songData?.artist?.id ? `/artists/${songData.artist.id}` : '/top-artists'}>
            <p className="text-base text-gray-400 mt-2">{songData?.artist?.name || 'Unknown Artist'}</p>
          </Link>
          <p className="text-base text-gray-400 mt-2">{songData?.album?.name || 'Unknown Genre'}</p>
        </div>
      </div>
  
      <div className="w-full sm:h-44 h-24" />
    </div>
  );
}

export default DetailsHeader;