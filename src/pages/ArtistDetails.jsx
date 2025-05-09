import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, SongCard } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { spotifyApi } from "../redux/services/spotifyApi";

const ArtistDetails = () => {
  const dispatch = useDispatch();
  const { id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const [artistData, setArtistData] = useState(null);
  const [isFetchingArtistDetails, setIsFetchingArtistDetails] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setIsFetchingArtistDetails(true);
      const response = await spotifyApi.getArtistDetails(artistId);
      console.log("Artist ID:", artistId);
      console.log("API Response:", response);
      if (response.error) {
        setError(response.error);
      } else {
        setArtistData(response.data);
      }
      setIsFetchingArtistDetails(false);
    };
    fetchArtistDetails();
  }, [artistId]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    console.log("Playing song:", song);
    dispatch(setActiveSong({ song, data: artistData?.top_songs || [], i }));
    dispatch(playPause(true));
  };

  if (isFetchingArtistDetails)
    return <Loader title="Đang tải chi tiết nghệ sĩ..." />;
  if (error)
    return (
      <Error message={error.data?.detail || "Tải chi tiết nghệ sĩ thất bại"} />
    );
  if (!artistData)
    return <div className="text-white p-6">Không tìm thấy nghệ sĩ.</div>;

  return (
    <div className="flex flex-col bg-spotify-black p-6">
      <DetailsHeader artistData={artistData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Bài Hát Hàng Đầu:</h2>
        <div className="mt-5 flex flex-wrap sm:justify-start justify-center gap-8">
          {artistData.top_songs && artistData.top_songs.length > 0 ? (
            artistData.top_songs.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                activeSong={activeSong}
                data={artistData.top_songs}
                i={i}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, i)}
              />
            ))
          ) : (
            <p className="text-spotify-light-gray text-base">
              Không có bài hát nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
