import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} VoiceBox. All rights reserved.</p>
        <p className="text-sm mt-2">Built with ❤️ by a MERN PhD.</p>
      </div>
    </footer>
  );
};

export default Footer;