import React, { useState, useEffect } from 'react';
import mockData from '../data/mockData.json'; // Adjust path based on your project structure

const CreateAlbum = () => {
  // State for form inputs
  const [albumName, setAlbumName] = useState('');
  const [albumImage, setAlbumImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songsList, setSongsList] = useState([]);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState({});

  // Aggregate unique songs from mockData.json
  useEffect(() => {
    const allSongs = [
      ...mockData.topCharts.tracks.items,
      ...mockData.songsByGenre,
      ...mockData.songsByCountry,
      ...mockData.songsBySearch.tracks,
      ...mockData.songDetails,
      ...mockData.songRelated.tracks,
      ...mockData.albums.flatMap((album) => album.tracks)
    ];

    // Remove duplicates by song ID
    const uniqueSongs = Array.from(
      new Map(allSongs.map((song) => [song.id, song])).values()
    );

    setSongsList(uniqueSongs);
  }, []);

  // Filter songs based on search query
  const filteredSongs = songsList.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, albumImage: 'Please upload an image file' }));
        setAlbumImage(null);
        setImagePreview(null);
        return;
      }
      setAlbumImage(file);
      setErrors((prev) => ({ ...prev, albumImage: '' }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle song selection
  const handleSongSelection = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  // Validate and submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!albumName.trim()) {
      newErrors.albumName = 'Album name is required';
    }
    if (!albumImage) {
      newErrors.albumImage = 'Album image is required';
    }
    if (selectedSongs.length === 0) {
      newErrors.selectedSongs = 'At least one song must be selected';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Prepare form data
      const formData = {
        albumName,
        albumImage: albumImage.name, // For now, just the file name; adjust for server upload
        selectedSongs: selectedSongs.map((songId) =>
          songsList.find((song) => song.id === songId)
        ),
      };
      console.log('Form submitted:', formData);
      // TODO: Integrate with API or Redux here
      // Example: dispatch(createAlbum(formData));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Album</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Album Name */}
        <div>
          <label htmlFor="albumName" className="block text-sm font-medium mb-1">
            Album Name
          </label>
          <input
            type="text"
            id="albumName"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter album name"
          />
          {errors.albumName && (
            <p className="text-red-500 text-sm mt-1">{errors.albumName}</p>
          )}
        </div>

        {/* Album Image */}
        <div>
          <label htmlFor="albumImage" className="block text-sm font-medium mb-1">
            Album Image
          </label>
          <input
            type="file"
            id="albumImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Album preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg"
            />
          )}
          {errors.albumImage && (
            <p className="text-red-500 text-sm mt-1">{errors.albumImage}</p>
          )}
        </div>

        {/* Song Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Songs</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs by name"
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="max-h-48 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg p-2">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <label
                  key={song.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSongSelection(song.id)}
                    className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <span>
                    {song.name} - {song.artist.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="p-2 text-gray-400">No songs match your search</p>
            )}
          </div>
          {errors.selectedSongs && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedSongs}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Album
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlbum;