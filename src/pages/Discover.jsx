import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { selectAlbumListId } from '../redux/features/playerSlice';
import { useGetSongsByGenreQuery, useGetAlbumsQuery } from '../redux/services/spotifyApi';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { albumListId } = useSelector((state) => state.player);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: songsData, isFetching: isFetchingSongs, error: songsError } = useGetSongsByGenreQuery(albumListId || 'all');
  const { data: albumsData, isFetching: isFetchingAlbums, error: albumsError } = useGetAlbumsQuery();

  if (isFetchingSongs || isFetchingAlbums) return <Loader title="Loading songs..." />;

  if (songsError || albumsError) return <Error />;

  const albumTitle = albumsData?.find((album) => album.id === albumListId)?.name || 'All Albums';

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Discover</h1>
        <button
          onClick={() => navigate('/create-album')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Album
        </button>
      </div>
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover {albumTitle}</h2>

        <select
          onChange={(e) => dispatch(selectAlbumListId(e.target.value))}
          value={albumListId || 'all'}
          className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
        >
          <option value="all">All Albums</option>
          {albumsData?.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songsData?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songsData}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;