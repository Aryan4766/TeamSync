import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { FolderKanban, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [creating, setCreating]         = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState({ title: '', description: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data.projects);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/projects', form);
      setProjects(prev => [data.data.project, ...prev]);
      setForm({ title: '', description: '' });
      setShowForm(false);
      toast.success('Project created!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget}`);
      setProjects(prev => prev.filter(p => p._id !== deleteTarget));
      setDeleteTarget(null);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban size={24} className="text-primary-400" />
            Projects
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary shrink-0">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {showForm && user?.role === 'Admin' && (
        <div className="glass p-5 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4">New Project</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="label">Title *</label>
              <input className="input" placeholder="Project title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input resize-none h-16" placeholder="Optional description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9" placeholder="Search projects..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass p-12 text-center">
          <FolderKanban size={40} className="mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 font-medium">No projects found</p>
          <p className="text-slate-600 text-sm mt-1">
            {user?.role === 'Admin' ? 'Create your first project above' : 'Ask an Admin to add you to a project'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project._id} project={project} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Project"
        message="This will permanently delete the project and all its tasks. This cannot be undone."
      />
    </div>
  );
};

export default Projects;
