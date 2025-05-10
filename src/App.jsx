import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { Searchbar, Sidebar, MusicPlayer } from "./components";
import {
  ArtistDetails,
  YourAlbum,
  Discover,
  Search,
  SongDetails,
} from "./pages";
import CreateAlbum from "./pages/CreateAlbum";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTrack from "./pages/CreateTrack";

const App = () => {
  const { activeSong } = useSelector((state) => state.player);

  return (
    <div className="relative flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#1DB954]">
        <Searchbar />

        <div className="mt-5 px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/your-album" element={<YourAlbum />} />
              <Route path="/artist/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/create-album" element={<CreateAlbum />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-track" element={<CreateTrack />} />
            </Routes>
          </div>
        </div>
      </div>

      {activeSong && activeSong.name && (
        <div className="absolute h-auto bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-black to-[#1DB954] backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
