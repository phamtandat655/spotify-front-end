import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery, useGetAllSongsQuery } from '../redux/services/spotifyApi';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Use getAllSongsQuery when searchTerm is empty, otherwise use getSongsBySearchQuery
  const {
    data: searchData,
    isFetching: isFetchingSearch,
    error: searchError,
  } = useGetSongsBySearchQuery(searchTerm);

  const songs = searchData?.tracks || [];
  const isFetching = isFetchingSearch;
  const error = searchError;

  if (isFetching) return <Loader title={searchTerm ? `Searching ${searchTerm}...` : 'Loading all songs...'} />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        {searchTerm ? (
          <>
            Showing results for <span className="font-black">{searchTerm}</span>
          </>
        ) : (
          'All Songs'
        )}
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={searchData}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;