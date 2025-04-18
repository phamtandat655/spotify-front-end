import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetAlbumsByUserIdQuery } from '../redux/services/spotifyApi';
import { useNavigate } from 'react-router-dom';

const CountryTracks = () => {
  const [loading, setLoading] = useState(false);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const userId = localStorage.getItem('userId');
  const { data : albums, isFetching, error } = useGetAlbumsByUserIdQuery(userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId])

  console.log(12)

  useEffect(() => {
    setLoading(false);
  }, []);

  if (isFetching || loading) return <Loader title="Loading Songs around you..." />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      {
        albums.length === 0 ? 
          <h2 className="font-bold text-3xl text-white text-left mt-10 mb-3">There are no albums yet. Please create an album using the "Create album" button on the Discover page.</h2>
        : albums?.map((album) => {
          return (
            <div key={album.id}>
              <h2 className="font-bold text-3xl text-white text-left mt-10 mb-3">{album?.name || "Unknown album"}</h2>
              <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {album?.tracks?.map((song, i) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isPlaying={isPlaying}
                    activeSong={activeSong}
                    data={song}
                    i={i}
                  />))
                }
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default CountryTracks;