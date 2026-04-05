import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black py-12 px-6 border-t border-[#1f1f1f] font-light">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Brand Section */}
        <div className="flex-1">
          <h2 className="text-2xl mb-3 text-white tracking-tight">
            <span className="text-green-400">Kareer</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Find your next opportunity with confidence. Simplifying job search using AI-powered matching.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1">
          <h3 className="text-lg mb-4 text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-green-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-green-400 transition">
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-green-400 transition">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex-1">
          <h3 className="text-lg mb-4 text-white">
            Support
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a
                href="mailto:akashchandra6280@gmail.com"
                className="hover:text-green-400 transition"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="/policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500 border-t border-[#1f1f1f] pt-6">
        © {new Date().getFullYear()} Kareer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;