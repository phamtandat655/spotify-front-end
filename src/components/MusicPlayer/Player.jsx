import React, { useEffect, useRef } from 'react';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded }) => {
  const videoRef = useRef(null);

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

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
          console.error('Error playing video:', error);
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