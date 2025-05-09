import React, { useEffect, useRef } from "react";
import axios from "axios";
const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded }) => {
  const videoRef = useRef(null);

  // Hàm để cập nhật lượt xem bài hát
  const updateTrackViews = async (trackId) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/music/tracks/${trackId}/play/`
      );
      console.log(response.data); // In ra dữ liệu trả về từ server (nếu có)
    } catch (error) {
      console.error("Error updating track views:", error);
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });

        if (activeSong?.id) {
          updateTrackViews(activeSong.id);
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeSong, updateTrackViews]);

  // Handle volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Handle seek time
  useEffect(() => {
    if (videoRef.current && seekTime) {
      videoRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Handle video change
  useEffect(() => {
    if (videoRef.current && activeSong?.video_url) {
      videoRef.current.src = activeSong.video_url;
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [activeSong, isPlaying]);

  return (
    <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
      {activeSong?.video_url ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onEnded={onEnded}
          controls
          muted={volume === 0}
        >
          <source src={activeSong.video_url} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <p className="text-gray-400 text-lg">Không có video được chọn</p>
        </div>
      )}
    </div>
  );
};

export default Player;
