import { Calendar, User, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { formatDate, isTaskOverdue, getStatusClass, getInitials, getAvatarColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Completed'];

const TaskCard = ({ task, onDelete, onEdit, onStatusChange }) => {
  const { user } = useAuth();
  const overdue = isTaskOverdue(task);
  const badgeClass = getStatusClass(task.status, overdue);

  const canEdit   = user?.role === 'Admin';
  const canDelete = user?.role === 'Admin';
  const canChangeStatus =
    user?.role === 'Admin' ||
    (user?.role === 'Member' && task.assignedTo?._id === user?._id);

  return (
    <div className={`glass p-4 flex flex-col gap-3 card-hover animate-slide-up
      ${overdue ? 'border-rose-500/30' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={badgeClass}>{task.status}</span>
            {overdue && (
              <span className="badge badge-overdue flex items-center gap-1">
                <AlertCircle size={10} /> Overdue
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-2">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
            >
              <Edit2 size={13} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span className={overdue ? 'text-rose-400' : ''}>{formatDate(task.dueDate)}</span>
        </div>

        {task.assignedTo ? (
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full ${getAvatarColor(task.assignedTo.name)} flex items-center justify-center text-white text-[9px] font-bold`}>
              {getInitials(task.assignedTo.name)}
            </div>
            <span className="max-w-[80px] truncate">{task.assignedTo.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-600">
            <User size={12} />
            <span>Unassigned</span>
          </div>
        )}
      </div>

      {/* Status quick-change */}
      {canChangeStatus && (
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="input !py-1.5 text-xs"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TaskCard;
