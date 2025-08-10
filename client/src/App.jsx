import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from './atoms/authAtoms';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import CreatorDashboard from './pages/CreatorDashboard';
import UploadEditEpisode from './pages/UploadEditEpisode';
import EpisodeDetail from './pages/EpisodeDetail';
import MyWishlist from './pages/MyWishlist';
import PrivateRoute from './components/PrivateRoute';
import CreatorRoute from './components/CreatorRoute'; // New component for creator-only routes

function App() {
  const { user } = useRecoilValue(authState);

  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/episode/:id" element={<EpisodeDetail />} />

          <Route
            path="/my-wishlist"
            element={
              <PrivateRoute>
                <MyWishlist />
              </PrivateRoute>
            }
          />

          <Route
            path="/creator/dashboard"
            element={
              <CreatorRoute>
                <CreatorDashboard />
              </CreatorRoute>
            }
          />

          <Route
            path="/creator/upload"
            element={
              <CreatorRoute>
                <UploadEditEpisode />
              </CreatorRoute>
            }
          />

          <Route
            path="/creator/edit/:id"
            element={
              <CreatorRoute>
                <UploadEditEpisode />
              </CreatorRoute>
            }
          />
        </Routes>

      </main>
    </Router>
  );
}

export default App;
