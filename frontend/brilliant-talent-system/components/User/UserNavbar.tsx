import { useState, useEffect } from "react";
import Link from "next/link";

interface UserNavbarProps {
  userName: string;
  userMajor: string;
}

const UserNavbar = ({ userName, userMajor }: UserNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md h-20" : "shadow-sm h-24"
      }`}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <i className="fas fa-graduation-cap text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              سیستم کارنامه دانشگاهی
            </h1>
            <p className="text-sm text-gray-500">
              دانشگاه صنعتی نوشیروانی بابل
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 space-x-reverse">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <i className="fas fa-home ml-2"></i> خانه
          </Link>
          <Link
            href="/transcript"
            className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
          >
            <i className="fas fa-file-alt ml-2"></i> کارنامه
          </Link>
        </div>

        {/* User Profile and Mobile Menu */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-blue-50 px-4 py-2 rounded-full">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10"></div>
            <div>
              <p className="font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userMajor}</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600"
            aria-label="Toggle menu"
          >
            <i
              className={`fas ${
                isMobileMenuOpen ? "fa-times" : "fa-bars"
              } text-2xl`}
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-home ml-2"></i> خانه
            </Link>
            <Link
              href="/transcript"
              className="text-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-file-alt ml-2"></i> کارنامه
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
