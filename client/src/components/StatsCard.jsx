import { TrendingUp } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, color, subLabel }) => {
  const colorMap = {
    indigo:  { bg: 'bg-primary-500/10',  icon: 'text-primary-400',  border: 'border-primary-500/20' },
    emerald: { bg: 'bg-emerald-500/10',  icon: 'text-emerald-400',  border: 'border-emerald-500/20' },
    amber:   { bg: 'bg-amber-500/10',    icon: 'text-amber-400',    border: 'border-amber-500/20'   },
    rose:    { bg: 'bg-rose-500/10',     icon: 'text-rose-400',     border: 'border-rose-500/20'    },
    slate:   { bg: 'bg-slate-500/10',    icon: 'text-slate-400',    border: 'border-slate-500/20'   },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass p-5 card-hover border ${c.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value ?? 0}</p>
          {subLabel && <p className="text-xs text-slate-500 mt-1">{subLabel}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center shrink-0`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
