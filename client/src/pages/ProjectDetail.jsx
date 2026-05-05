import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberModal from '../components/MemberModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getInitials, getAvatarColor } from '../utils/helpers';
import {
  ArrowLeft, Plus, UserPlus, UserMinus, FolderKanban, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = ['Todo', 'In Progress', 'Completed'];

const columnStyles = {
  'Todo':        { header: 'bg-slate-700/40 text-slate-300',   dot: 'bg-slate-400' },
  'In Progress': { header: 'bg-amber-500/20 text-amber-400',    dot: 'bg-amber-400' },
  'Completed':   { header: 'bg-emerald-500/20 text-emerald-400',dot: 'bg-emerald-400' },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]           = useState(null);
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [removeMemberId, setRemoveMemberId] = useState(null);
  const [saving, setSaving]             = useState(false);

  const isCreator = project?.createdBy?._id === user?._id ||
                    project?.createdBy === user?._id;

  // ── Fetch project + tasks ──────────────────────────────────────
  const fetchAll = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/${id}`),
      ]);
      setProject(projRes.data.data.project);
      setTasks(taskRes.data.data.tasks);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  // ── Task CRUD ─────────────────────────────────────────────────
  const handleTaskSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, formData);
        setTasks(prev => prev.map(t => t._id === editingTask._id ? data.data.task : t));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', { ...formData, projectId: id });
        setTasks(prev => [data.data.task, ...prev]);
        toast.success('Task created');
      }
      setTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    setSaving(true);
    try {
      await api.delete(`/tasks/${deleteTaskId}`);
      setTasks(prev => prev.filter(t => t._id !== deleteTaskId));
      setDeleteTaskId(null);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? data.data.task : t));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  // ── Member management ─────────────────────────────────────────
  const handleAddMember = async (email) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/projects/${id}/add-member`, { email });
      setProject(data.data.project);
      setMemberModalOpen(false);
      toast.success('Member added');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async () => {
    setSaving(true);
    try {
      await api.put(`/projects/${id}/remove-member`, { userId: removeMemberId });
      setProject(prev => ({
        ...prev,
        members: prev.members.filter(m => m._id !== removeMemberId),
      }));
      setRemoveMemberId(null);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project header */}
      <div className="glass p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center shrink-0">
              <FolderKanban size={22} className="text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{project.title}</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {project.description || 'No description'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Created by <span className="text-slate-400">{project.createdBy?.name}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {user?.role === 'Admin' && isCreator && (
              <>
                <button onClick={() => setMemberModalOpen(true)} className="btn-secondary">
                  <UserPlus size={15} /> Add Member
                </button>
                <button onClick={() => { setEditingTask(null); setTaskModalOpen(true); }} className="btn-primary">
                  <Plus size={15} /> Add Task
                </button>
              </>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="mt-5 pt-4 border-t border-slate-700/40">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Members ({project.members?.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.members?.map(member => (
              <div key={member._id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-slate-700/30 group"
              >
                <div className={`w-6 h-6 rounded-full ${getAvatarColor(member.name)} flex items-center justify-center text-white text-[9px] font-bold`}>
                  {getInitials(member.name)}
                </div>
                <span className="text-xs text-slate-300">{member.name}</span>
                <span className={`badge text-[10px] ${member.role === 'Admin' ? 'badge-admin' : 'badge-member'}`}>
                  {member.role}
                </span>
                {user?.role === 'Admin' && isCreator && member._id !== user._id && (
                  <button
                    onClick={() => setRemoveMemberId(member._id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                    title="Remove member"
                  >
                    <UserMinus size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task board — Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(status => {
          const columnTasks = tasksByStatus(status);
          const style = columnStyles[status];
          return (
            <div key={status} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${style.header}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-xs font-semibold uppercase tracking-wide">{status}</span>
                </div>
                <span className="text-xs font-bold opacity-70">{columnTasks.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 min-h-[120px]">
                {columnTasks.length === 0 ? (
                  <div className="flex-1 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center py-8">
                    <p className="text-xs text-slate-700">No tasks</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={(t) => { setEditingTask(t); setTaskModalOpen(true); }}
                      onDelete={setDeleteTaskId}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        members={project.members}
        loading={saving}
      />

      <MemberModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSubmit={handleAddMember}
        loading={saving}
      />

      <ConfirmDialog
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleDeleteTask}
        loading={saving}
        title="Delete Task"
        message="This will permanently delete the task. This action cannot be undone."
      />

      <ConfirmDialog
        isOpen={!!removeMemberId}
        onClose={() => setRemoveMemberId(null)}
        onConfirm={handleRemoveMember}
        loading={saving}
        title="Remove Member"
        message="This will remove the member from the project and unassign their tasks."
        confirmLabel="Remove"
      />
    </div>
  );
};

export default ProjectDetail;
