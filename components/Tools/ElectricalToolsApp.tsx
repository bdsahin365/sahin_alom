"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Activity, BatteryCharging, AlertTriangle, Settings, ArrowLeft, Cpu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
type ToolId = 'ampacity' | 'vdrop' | 'transformer' | 'pfc' | null;

export default function ElectricalToolsApp() {
  const [activeTool, setActiveTool] = useState<ToolId>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTool]);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] font-sans pt-24 md:pt-32 pb-24 border-t border-[var(--card-border)] relative min-h-screen">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10 min-h-[80vh]">
            <AnimatePresence mode="wait">
            {!activeTool ? (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3 }}
                >
                    <DashboardHub onSelectTool={(id: ToolId) => setActiveTool(id)} />
                </motion.div>
            ) : (
                <motion.div
                    key="calculator"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <button
                        onClick={() => setActiveTool(null)}
                        className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-amber-500 font-medium mb-8 transition-colors"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Toolkit
                    </button>

                    {activeTool === 'ampacity' && <AmpacityCalculator />}
                    {activeTool === 'vdrop' && <VoltageDropCalculator />}
                    {activeTool === 'transformer' && <TransformerCalculator />}
                    {activeTool === 'pfc' && <PFCCalculator />}
                </motion.div>
            )}
            </AnimatePresence>
        </main>
    </div>
  );
}

// --- DASHBOARD HUB --- //

function DashboardHub({ onSelectTool }: { onSelectTool: (id: ToolId) => void }) {
    const toolsContext = [
        {
            id: 'ampacity' as ToolId,
            title: '3-Phase Ampacity Load',
            description: 'Calculate line currents across stable 3-phase heavy industrial loads.',
            icon: <Activity size={28} />,
            color: 'text-amber-400'
        },
        {
            id: 'vdrop' as ToolId,
            title: 'Voltage Drop Analysis',
            description: 'Evaluate cable lengths against BNBC 4% voltage drop compliance limits.',
            icon: <AlertTriangle size={28} />,
            color: 'text-orange-500'
        },
        {
            id: 'transformer' as ToolId,
            title: 'Substation Transformer',
            description: 'Size commercial transformer capacities using safe BNBC diversity and safety margins.',
            icon: <BatteryCharging size={28} />,
            color: 'text-amber-500'
        },
        {
            id: 'pfc' as ToolId,
            title: 'Capacitor Bank PFC',
            description: 'Resolve reactive power issues and calculate exact kVAR requirements for correction.',
            icon: <Settings size={28} />,
            color: 'text-yellow-500'
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-16 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 font-medium text-xs tracking-widest uppercase mb-6">
                    <Zap size={14} className="fill-amber-500" />
                    Industrial Engineering
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] leading-tight mb-6 tracking-tight">
                    Electrical Pro <br /><span className="text-[var(--text-secondary)] font-light">Toolkit</span>
                </h1>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                    A suite of professional calculators specifically tuned for BNBC compliance, garments engineering, and high-voltage industrial applications. Select a tool below to begin.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {toolsContext.map((tool, i) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                        <button
                            onClick={() => tool.id && onSelectTool(tool.id)}
                            className="group block w-full text-left bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--card-border)] hover:border-amber-500/40 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden shadow-[var(--card-shadow)]"
                        >
                            {/* Decorative background icon */}
                            <div className="absolute -right-6 -bottom-6 opacity-[0.04] text-[var(--foreground)] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-500">
                                {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 160 })}
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className={`p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] shadow-inner ${tool.color} mb-6`}>
                                    {tool.icon}
                                </div>
                                <div className="p-2 rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[var(--text-secondary)] group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 tracking-tight group-hover:text-amber-500 transition-colors relative z-10">{tool.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-[90%] relative z-10">{tool.description}</p>
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}


// --- LAYOUT WRAPPERS FOR CALCULATORS --- //

function CalculatorLayout({ title, icon, subtitle, inputs, results }: any) {
    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] flex items-center gap-4 mb-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        {icon}
                    </div>
                    {title}
                </h1>
                {subtitle && <p className="text-[var(--text-secondary)] max-w-2xl text-lg">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative items-start">
                {/* Inputs Column */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                    {inputs}
                </div>

                {/* Sticky Results Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-28 w-full">
                    {results}
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT TOOL: AMPACITY --- //

function AmpacityCalculator() {
  const [kw, setKw] = useState('');
  const [volts, setVolts] = useState('400');
  const [pf, setPf] = useState('0.85');
  const [amps, setAmps] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(kw);
    const v = parseFloat(volts);
    const pF = parseFloat(pf);
    if (p > 0 && v > 0 && pF > 0) {
      const current = (p * 1000) / (1.732 * v * pF);
      setAmps(current);
    } else {
      setAmps(null);
    }
  }, [kw, volts, pf]);

  return (
    <CalculatorLayout
        title="3-Phase Ampacity Load"
        icon={<Activity size={28} />}
        subtitle="Precisely calculate line currents for balanced heavy industrial multi-phase loads."
        inputs={
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 space-y-8 shadow-[var(--card-shadow)]">
                <FormSection title="Load Parameters">
                    <InputField label="Total Active Power (kW)" value={kw} onChange={setKw} placeholder="e.g. 150" autoFocus />
                </FormSection>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent my-4" />
                <FormSection title="System Variables">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Line Voltage (V)" value={volts} onChange={setVolts} />
                        <InputField label="Power Factor (cos θ)" value={pf} onChange={setPf} step="0.01" max="1" />
                    </div>
                </FormSection>
            </div>
        }
        results={
            <LiveResultSidebar
                title="Current Draw"
                value={amps !== null ? `${amps.toFixed(2)}` : '--'}
                unit="Amps (A)"
                formula="I = P / (√3 × V × cosθ)"
                isReady={amps !== null}
            />
        }
    />
  );
}

// --- COMPONENT TOOL: VOLTAGE DROP --- //

function VoltageDropCalculator() {
  const [amps, setAmps] = useState('');
  const [length, setLength] = useState('');
  const [r, setR] = useState('0.387');
  const [x, setX] = useState('0.071');
  const [pf, setPf] = useState('0.85');
  const [volts, setVolts] = useState('400');

  const [dropV, setDropV] = useState<number | null>(null);
  const [dropPct, setDropPct] = useState<number | null>(null);

  useEffect(() => {
    const I = parseFloat(amps);
    const L = parseFloat(length);
    const R = parseFloat(r);
    const X = parseFloat(x);
    const pF = parseFloat(pf);
    const V = parseFloat(volts);

    if (I > 0 && L > 0 && R >= 0 && X >= 0 && pF > 0 && V > 0) {
      const sinTheta = Math.sin(Math.acos(pF));
      const vd = (1.732 * I * L * ((R * pF) + (X * sinTheta))) / 1000;
      const pct = (vd / V) * 100;
      setDropV(vd);
      setDropPct(pct);
    } else {
      setDropV(null);
      setDropPct(null);
    }
  }, [amps, length, r, x, pf, volts]);

  const isCompliant = dropPct !== null && dropPct <= 4.0;

  return (
    <CalculatorLayout
        title="Voltage Drop Analysis"
        icon={<AlertTriangle size={28} />}
        subtitle="Verify transmission cable length limitations against the rigorous 4% BNBC limits."
        inputs={
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 space-y-8 shadow-[var(--card-shadow)]">
                <FormSection title="Load Target">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Max Current (A)" value={amps} onChange={setAmps} placeholder="e.g. 100" />
                        <InputField label="Cable Length (m)" value={length} onChange={setLength} placeholder="e.g. 50" />
                    </div>
                </FormSection>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent my-4" />
                <FormSection title="Cable Characteristics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Resistance R (Ω/km)" value={r} onChange={setR} helpText="Typ: 0.387 for 50mm² Cu" />
                        <InputField label="Reactance X (Ω/km)" value={x} onChange={setX} helpText="Typ: 0.071" />
                    </div>
                </FormSection>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent my-4" />
                <FormSection title="Grid Specs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Power Factor" value={pf} onChange={setPf} />
                        <InputField label="Voltage (V)" value={volts} onChange={setVolts} />
                    </div>
                </FormSection>
            </div>
        }
        results={
            <div className="flex flex-col gap-6">
                <LiveResultSidebar
                    title="Voltage Loss Offset"
                    value={dropPct !== null ? `${dropPct.toFixed(2)}` : '--'}
                    unit="% Drop"
                    formula="Vd = (√3 × I × L × (Rcosθ + Xsinθ)) / 1000"
                    isReady={dropPct !== null}
                    customColorClass={dropPct === null ? '' : isCompliant ? 'text-emerald-500' : 'text-red-500'}
                    customBgClass={dropPct === null ? '' : isCompliant ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/20' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-500/20'}
                >
                    {dropPct !== null && (
                        <div className="mt-8">
                            <div className={`p-4 rounded-2xl flex items-start gap-4 border ${isCompliant ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'}`}>
                                <Cpu size={24} className="shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm tracking-wide uppercase mb-1">{isCompliant ? 'BNBC Approved' : 'BNBC Violation'}</h4>
                                    <p className="text-sm opacity-80 leading-relaxed">
                                        {isCompliant ?
                                            `Loss is ${dropV?.toFixed(2)}V, securely within the mandated ≤4.0% limits for electrical integrity.` :
                                            `Loss is excessive (${dropV?.toFixed(2)}V). Must upsize cables or decrease span distance to fall within ≤4.0%.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </LiveResultSidebar>
            </div>
        }
    />
  );
}

// --- COMPONENT TOOL: TRANSFORMER --- //

function TransformerCalculator() {
  const [connectedLoad, setConnectedLoad] = useState('');
  const [demandFactor, setDemandFactor] = useState('0.7');
  const safetyFactor = 0.8;
  const assumedPf = 0.8;
  const [kva, setKva] = useState<number | null>(null);

  useEffect(() => {
    const load = parseFloat(connectedLoad);
    const df = parseFloat(demandFactor);
    if (load > 0 && df > 0) {
      const requiredKva = (load * df) / (assumedPf * safetyFactor);
      setKva(requiredKva);
    } else {
      setKva(null);
    }
  }, [connectedLoad, demandFactor]);

  return (
    <CalculatorLayout
        title="Substation Sizing"
        icon={<BatteryCharging size={28} />}
        subtitle="Estimate the required kVA commercial rating incorporating structural demand and safety caps."
        inputs={
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 space-y-8 shadow-[var(--card-shadow)]">
                <FormSection title="Site Demand Profile">
                    <InputField label="Total Connected Load (kW)" value={connectedLoad} onChange={setConnectedLoad} placeholder="Total connected machinery" autoFocus />
                    <div className="mt-6">
                        <InputField label="Diversity / Demand Factor" value={demandFactor} onChange={setDemandFactor} helpText="Garments standard is usually ~0.6 to 0.8 based on machine continuity." />
                    </div>
                </FormSection>

                <div className="p-6 bg-[var(--surface)] rounded-2xl border border-[var(--card-border)] space-y-4">
                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Settings size={16} /> Hardcoded Constants
                    </h4>
                    <div className="flex justify-between items-center bg-[var(--background)] p-4 rounded-xl border border-[var(--card-border)]">
                        <span className="text-[var(--text-secondary)]">BNBC Safety Ceiling:</span>
                        <strong className="text-[var(--foreground)] font-mono text-lg">0.8 (80%)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--background)] p-4 rounded-xl border border-[var(--card-border)]">
                        <span className="text-[var(--text-secondary)]">Assumed Grid P.F.:</span>
                        <strong className="text-[var(--foreground)] font-mono text-lg">0.8</strong>
                    </div>
                </div>
            </div>
        }
        results={
            <div>
                <LiveResultSidebar
                    title="Required Capacity"
                    value={kva !== null ? `${Math.ceil(kva)}` : '--'}
                    unit="kVA Rating"
                    formula="kVA = (kW × DF) / (PF × 0.8)"
                    isReady={kva !== null}
                />

                {kva !== null && (
                    <div className="mt-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                        <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-200/80 leading-relaxed">
                            Recommendation: Procure the immediate next <strong>highest standard market size</strong>. For example, if calculated 830 kVA, secure a 1000 kVA Substation.
                        </p>
                    </div>
                )}
            </div>
        }
    />
  );
}

// --- COMPONENT TOOL: PFC --- //

function PFCCalculator() {
  const [kw, setKw] = useState('');
  const [currentPf, setCurrentPf] = useState('');
  const [targetPf, setTargetPf] = useState('0.98');
  const [kvar, setKvar] = useState<number | null>(null);

  useEffect(() => {
    const P = parseFloat(kw);
    const pf1 = parseFloat(currentPf);
    const pf2 = parseFloat(targetPf);

    if (P > 0 && pf1 > 0 && pf2 >= 0 && pf1 < 1 && pf2 <= 1) {
      if (pf1 >= pf2) {
        setKvar(0);
        return;
      }
      const tanTheta1 = Math.tan(Math.acos(pf1));
      const tanTheta2 = Math.tan(Math.acos(pf2));
      const requiredKvar = P * (tanTheta1 - tanTheta2);
      setKvar(requiredKvar > 0 ? requiredKvar : 0);
    } else {
      setKvar(null);
    }
  }, [kw, currentPf, targetPf]);

  return (
    <CalculatorLayout
        title="Capacitor Bank Sizing (PFC)"
        icon={<Settings size={28} />}
        subtitle="Precisely model necessary corrective reactive loads to mitigate utility fines."
        inputs={
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 space-y-8 shadow-[var(--card-shadow)]">
                <FormSection title="Real Power Consumption">
                    <InputField label="Existing Load (kW)" value={kw} onChange={setKw} placeholder="e.g. 500" autoFocus />
                </FormSection>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--divider)] to-transparent my-4" />
                <FormSection title="Phasor Adjustments">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Current P.F." value={currentPf} onChange={setCurrentPf} placeholder="e.g. 0.75" />
                        <InputField label="Target P.F." value={targetPf} onChange={setTargetPf} />
                    </div>
                </FormSection>
            </div>
        }
        results={
            <LiveResultSidebar
                title="Capacitor Injection"
                value={kvar !== null ? `${kvar.toFixed(2)}` : '--'}
                unit="kVAR"
                formula="kVAR = kW × (tanθ₁ - tanθ₂)"
                isReady={kvar !== null}
            />
        }
    />
  );
}

// --- MICRO UTILITIES --- //

function FormSection({ title, children }: any) {
    return (
        <div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]" />
                {title}
            </h3>
            {children}
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, type = "number", step = "any", max, autoFocus, helpText }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        max={max}
        autoFocus={autoFocus}
        className="w-full p-4 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono text-xl shadow-inner appearance-none"
      />
      {helpText && <p className="text-xs text-[var(--text-secondary)] mt-3 font-mono">{helpText}</p>}
    </div>
  );
}

function LiveResultSidebar({ title, value, unit, formula, isReady, customBgClass, customColorClass, children }: any) {
    const bgClass = customBgClass || (isReady ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[var(--card-bg)] border-[var(--card-border)]');
    const colorClass = customColorClass || (isReady ? 'text-amber-500' : 'text-[var(--text-muted,var(--text-secondary))]');

    return (
        <div className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden shadow-[var(--card-shadow)] ${bgClass}`}>
            {isReady && !customBgClass && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32" />
            )}

            <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 relative z-10">{title}</div>

            <div className="mb-6 relative z-10">
                <div className={`text-6xl md:text-7xl font-black font-mono tracking-tighter ${colorClass} transition-colors duration-500 drop-shadow-md`}>
                    {value}
                </div>
                <div className={`text-lg font-semibold mt-2 tracking-widest uppercase ${isReady && !customColorClass ? 'text-amber-500/80' : 'text-[var(--text-secondary)]'}`}>{unit}</div>
            </div>

            <div className="w-full h-px bg-[var(--divider)] my-6 relative z-10" />

            <div className="relative z-10">
                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-3">Formula Base</div>
                <div className="text-sm text-[var(--text-secondary)] font-mono bg-[var(--surface)] p-4 rounded-xl border border-[var(--card-border)] overflow-x-auto whitespace-nowrap">
                    {formula}
                </div>
            </div>

            {children && (
                <div className="relative z-10">
                    {children}
                </div>
            )}
        </div>
    );
}
