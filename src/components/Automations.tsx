import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Moon, 
  Wind, 
  Zap, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { AutomationRoutine } from '../types';

interface AutomationsProps {
  automations: AutomationRoutine[];
  onToggleAutomation: (id: string) => void;
  onExecuteAutomation: (id: string) => void;
  onCreateAutomation: (newRoutine: Omit<AutomationRoutine, 'id'>) => void;
}

export const Automations: React.FC<AutomationsProps> = ({
  automations,
  onToggleAutomation,
  onExecuteAutomation,
  onCreateAutomation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'security' | 'comfort' | 'energy' | 'emergency'>('security');
  const [trigger, setTrigger] = useState('');
  const [actionSummary, setActionSummary] = useState('');
  const [description, setDescription] = useState('');

  const filtered = selectedCategory === 'all'
    ? automations
    : automations.filter(a => a.category === selectedCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !trigger.trim() || !actionSummary.trim()) return;

    onCreateAutomation({
      name: name.trim(),
      description: description.trim() || 'Custom enterprise autonomous workflow.',
      category,
      trigger: trigger.trim(),
      actionSummary: actionSummary.trim(),
      active: true,
      icon: category === 'security' ? 'ShieldAlert' : category === 'energy' ? 'Zap' : 'Sparkles'
    });

    setName('');
    setTrigger('');
    setActionSummary('');
    setDescription('');
    setIsCreating(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-cyan-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
                Autonomous Routine Engine
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                EDGE HEURISTICS ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Deterministic & neural trigger response matrices executed with sub-millisecond local latency.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Routine</span>
        </button>
      </div>

      {/* New Routine Modal/Form Drawer */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
          <div className="text-xs font-mono font-semibold text-cyan-300 flex items-center justify-between">
            <span>CONFIGURE ENTERPRISE AUTOMATION RULE</span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VIP Protocol Charlie"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="security">Security</option>
                <option value="comfort">Comfort & Climate</option>
                <option value="energy">Energy & Grid</option>
                <option value="emergency">Emergency Response</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Trigger Condition</label>
              <input
                type="text"
                required
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g. Laser tripwire tripped OR Occupancy > 0"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Action Summary</label>
              <input
                type="text"
                required
                value={actionSummary}
                onChange={(e) => setActionSummary(e.target.value)}
                placeholder="e.g. Lock gates, activate high-CRI floods"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Detailed Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Secures all primary ingress corridors upon perimeter breach"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold"
            >
              Commit Rule to Enclave
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'security', 'comfort', 'energy', 'emergency'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((routine) => {
          return (
            <div
              key={routine.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                routine.active
                  ? 'bg-slate-900/60 border-slate-700/80 hover:border-cyan-500/40'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      {getIcon(routine.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 font-mono">
                        {routine.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                        {routine.category}
                      </span>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => onToggleAutomation(routine.id)}
                    title={routine.active ? "Pause Automation" : "Arm Automation"}
                    className="text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {routine.active ? (
                      <ToggleRight className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                  {routine.description}
                </p>

                {/* Trigger & Action Details */}
                <div className="space-y-1.5 text-xs font-mono p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <span className="text-amber-400 font-semibold flex-shrink-0">TRIG:</span>
                    <span className="text-slate-300 truncate">{routine.trigger}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <span className="text-cyan-400 font-semibold flex-shrink-0">ACT:</span>
                    <span className="text-slate-300 truncate">{routine.actionSummary}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Last Executed & Manual Fire Button */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs font-mono">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {routine.lastExecuted ? `Last: ${routine.lastExecuted}` : 'Armed on Standby'}
                </span>

                <button
                  onClick={() => onExecuteAutomation(routine.id)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all flex items-center gap-1 active:scale-95"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Execute Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
