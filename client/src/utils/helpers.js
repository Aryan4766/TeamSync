// Format date to readable string
export const formatDate = (date) => {
  if (!date) return 'No due date';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

// Check if a task is overdue
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === 'Completed') return false;
  return new Date(task.dueDate) < new Date();
};

// Get status badge class
export const getStatusClass = (status, overdue = false) => {
  if (overdue && status !== 'Completed') return 'badge-overdue';
  switch (status) {
    case 'Completed':   return 'badge-completed';
    case 'In Progress': return 'badge-progress';
    default:            return 'badge-todo';
  }
};

// Get initials from name
export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Get background color for avatar from name
export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-violet-600', 'bg-indigo-600', 'bg-blue-600',
    'bg-emerald-600', 'bg-amber-600', 'bg-rose-600',
    'bg-pink-600',  'bg-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Extract error message from axios error
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};
