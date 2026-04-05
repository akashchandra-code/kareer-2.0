import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = null; // test state
  const navigate = useNavigate();

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 font-light tracking-wide ${
      isActive ? "text-green-400" : "text-gray-300"
    } hover:text-green-400`;

  return (
    <nav
      className="
        fixed top-0 w-full z-50 px-[0.8rem] lg:px-12 py-4 md:py-5
        backdrop-blur-xl bg-black/40
        border-b border-[#1f1f1f]
      "
    >
      <div className="flex items-center justify-between md:px-10 px-4 py-1">
        
        {/* LOGO */}
        <NavLink
          to="/"
          className="text-2xl tracking-tight text-white"
        >
          <span className="text-green-400">Kareer</span>
        </NavLink>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10 text-[13px] uppercase tracking-[0.15em]">
          
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="
                  ml-4 px-6 py-2.5 rounded-full
                  text-[12px] uppercase tracking-widest
                  bg-green-500 text-black
                  hover:bg-green-400 transition-all duration-300
                  shadow-[0_0_12px_rgba(34,197,94,0.4)]
                "
              >
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="
                  ml-4 px-5 py-2 rounded-full
                  text-[12px] uppercase tracking-widest
                  text-red-400 border border-red-500/20
                  hover:bg-red-500/10 transition-all duration-300
                "
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-gray-300 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-full
          bg-[#0a0a0a]/95 backdrop-blur-2xl
          transform transition-transform duration-500 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1f1f1f]">
          <h2 className="text-xl tracking-tight text-white">
            <span className="text-green-400">Kareer</span>
          </h2>

          <button onClick={() => setMenuOpen(false)} className="text-gray-300">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-8 px-10 py-12 text-lg tracking-wide text-gray-300">
          
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/jobs" onClick={() => setMenuOpen(false)}>
            Jobs
          </NavLink>

          <div className="pt-8 border-t border-[#1f1f1f]">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block mb-4"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block w-full py-4 rounded-xl text-center
                    bg-green-500 text-black font-normal
                  "
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block mb-4"
                >
                  Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="
                    w-full py-4 rounded-xl
                    text-red-400 border border-red-500/20 font-normal
                  "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;