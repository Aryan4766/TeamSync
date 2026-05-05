import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-surface-900/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left — hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Page title placeholder — filled by page */}
        <div className="hidden lg:block" />

        {/* Right — actions */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-3 pl-3 border-l border-slate-700/50">
            {/* User avatar */}
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full ${getAvatarColor(user?.name || '')} flex items-center justify-center text-white text-xs font-bold`}>
                {getInitials(user?.name || 'U')}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-200 leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
