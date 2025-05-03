import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { useGetArtistDetailsQuery } from '../redux/services/spotifyApi';

const ArtistDetails = () => {
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: artistData, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery(artistId);

  if (isFetchingArtistDetails) return <Loader title="Đang tải chi tiết nghệ sĩ..." />;

  if (error) return <Error message={error.data?.detail || 'Tải chi tiết nghệ sĩ thất bại'} />;

  if (!artistData) return <div className="text-white p-6">Không tìm thấy nghệ sĩ.</div>;

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <DetailsHeader artistData={artistData.artist} />

      <RelatedSongs
        data={artistData.tracks}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetails;