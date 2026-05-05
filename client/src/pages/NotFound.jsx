import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} className="text-rose-400" />
      </div>
      <h1 className="text-7xl font-black text-gradient mb-4">404</h1>
      <p className="text-xl font-semibold text-white mb-2">Page Not Found</p>
      <p className="text-slate-400 text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        <Home size={16} /> Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
