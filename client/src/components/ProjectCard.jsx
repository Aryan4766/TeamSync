import { useNavigate } from 'react-router-dom';
import { Trash2, Users, CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isCreator = project.createdBy?._id === user?._id ||
                    project.createdBy === user?._id;

  const progress = project.taskCount > 0
    ? Math.round((project.completedCount / project.taskCount) * 100)
    : 0;

  return (
    <div className="glass card-hover p-5 flex flex-col gap-4 cursor-pointer group"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
            {project.description || 'No description provided'}
          </p>
        </div>

        {user?.role === 'Admin' && isCreator && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
            className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete project"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{project.completedCount || 0} / {project.taskCount || 0} tasks</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Users size={13} />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1 text-primary-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
