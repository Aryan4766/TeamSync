import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import { isTaskOverdue, getStatusClass, formatDate, getInitials, getAvatarColor } from '../utils/helpers';
import {
  LayoutDashboard, CheckCircle2, Clock, AlertTriangle, ListTodo,
  FolderKanban, ArrowRight, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Todo', 'In Progress', 'Completed'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]           = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [filter, setFilter]         = useState('All');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/dashboard/stats');
        setStats(data.data.stats);
        setRecentTasks(data.data.recentTasks);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filtered = filter === 'All'
    ? recentTasks
    : recentTasks.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard size={24} className="text-primary-400" />
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Welcome back, <span className="text-white font-medium">{user?.name}</span> 👋
          </p>
        </div>
        <span className={`badge ${user?.role === 'Admin' ? 'badge-admin' : 'badge-member'}`}>
          {user?.role}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Tasks"   value={stats?.total}     icon={ListTodo}      color="indigo"  />
        <StatsCard label="Completed"     value={stats?.completed} icon={CheckCircle2}  color="emerald" subLabel="Done" />
        <StatsCard label="In Progress"   value={stats?.inProgress}icon={Clock}         color="amber"   />
        <StatsCard label="Overdue"       value={stats?.overdue}   icon={AlertTriangle} color="rose"    subLabel="Needs attention" />
      </div>

      {/* Recent tasks */}
      <div className="glass p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-400" />
            Recent Tasks
          </h2>
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-800 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <ListTodo size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(task => {
              const overdue = isTaskOverdue(task);
              const badgeClass = getStatusClass(task.status, overdue);
              return (
                <div
                  key={task._id}
                  onClick={() => task.projectId?._id && navigate(`/projects/${task.projectId._id}`)}
                  className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg
                    bg-surface-800/60 hover:bg-surface-800 border border-transparent
                    ${overdue ? 'border-rose-500/20 bg-rose-500/5' : ''}
                    cursor-pointer transition-all group`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`${badgeClass} shrink-0`}>{task.status}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${overdue ? 'text-rose-300' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {task.projectId?.title || 'Unknown project'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs ${overdue ? 'text-rose-400' : 'text-slate-500'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                    {task.assignedTo && (
                      <div className={`w-6 h-6 rounded-full ${getAvatarColor(task.assignedTo.name)} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {getInitials(task.assignedTo.name)}
                      </div>
                    )}
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-primary-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick action */}
      <div
        onClick={() => navigate('/projects')}
        className="glass p-5 flex items-center justify-between cursor-pointer card-hover border-primary-500/20 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
            <FolderKanban size={20} className="text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">View All Projects</p>
            <p className="text-xs text-slate-500">Browse and manage your projects</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-slate-500 group-hover:text-primary-400 transition-colors" />
      </div>
    </div>
  );
};

export default Dashboard;
