import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState } from '../atoms/authAtoms';
import { wishlistState } from '../atoms/wishlistAtoms';
import authService from '../services/authService';

const Navbar = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const setWishlist = useSetRecoilState(wishlistState);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setAuth({ token: null, user: null });
    setWishlist([]);
    navigate('/auth');
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/61ba50ecd5220351b1c658e1/33923b59-28e3-4a31-9cc5-94968030264f/Voicebox+Logo.png" // Path to your logo in the public folder
            className="h-8 md:h-10 object-contain" // Adjust height as needed, object-contain to prevent stretching
          />
        </Link>
        <div className="space-x-4 flex items-center"> {/* Added flex items-center for better alignment */}
          <Link to="/" className="text-black hover:text-black transition duration-200">
            Home
          </Link>


          {auth.user && auth.user.role === 'Creator' && (
            <>
              <Link to="/creator/dashboard" className="text-black transition duration-200">
                Dashboard
              </Link>
            </>
          )}
         {auth.user && (
  <Link to="/my-wishlist" className="text-black transition duration-200 group" title="My Wishlist">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 group-hover:fill-red-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  </Link>
)}

          {auth.token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
            >
              {auth.user?.username}
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
