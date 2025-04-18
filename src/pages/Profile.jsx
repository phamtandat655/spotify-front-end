import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../redux/services/spotifyApi';
import { Loader, Error } from '../components';

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage
  const { data: user, isFetching, error } = useGetUserProfileQuery(userId);
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
      if (!userId) {
        navigate('/login');
      }
    }, [userId])

  // Initialize form fields when user data is fetched
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        await updateUserProfile({ userId, name, email }).unwrap();
        setEditMode(false);
      } catch (err) {
        setFormErrors({ submit: err.data || 'Failed to update profile' });
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleClickAlbum = () => {
    navigate('/your-album');
  }

  if (isFetching) return <Loader title="Loading profile..." />;
  if (error) return <Error message={error.data || 'Failed to load profile'} />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* User Information */}
      <div className="mb-8">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            {formErrors.submit && (
              <p className="text-red-500 text-sm">{formErrors.submit}</p>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* User Albums */}
      <div className='cursor-pointer' onClick={handleClickAlbum}>
        <h2 className="text-xl font-bold mb-4">Your Albums</h2>
        {user.albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user.albums.map((album) => (
              <div
                key={album.id}
                className="p-4 bg-gray-700 rounded-lg flex items-center space-x-4"
              >
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{album.name}</h3>
                  <p className="text-gray-400">{album.artist.name}</p>
                  <p className="text-sm text-gray-400">
                    {album.tracks.length} song{album.tracks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have no albums yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;