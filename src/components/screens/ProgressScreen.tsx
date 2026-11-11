import React, { useState } from 'react';
import { Flame, Clock, Trophy, ChevronRight, CheckCircle2, Feather, ArrowRight } from 'lucide-react';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { MainTab, MeditationSession } from '../../types';

interface ProgressScreenProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  streakDays: number;
  totalMinutes: number;
  recentSessions: MeditationSession[];
  onStartMeditation: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  currentTab,
  onTabChange,
  streakDays = 12,
  totalMinutes = 160,
  recentSessions,
  onStartMeditation,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>('Fri');

  // Days of week data for the bar chart
  const weekData = [
    { day: 'Mon', count: 2, height: '55%' },
    { day: 'Tue', count: 2, height: '65%' },
    { day: 'Wed', count: 1, height: '40%' },
    { day: 'Thu', count: 3, height: '85%' },
    { day: 'Fri', count: 4, height: '100%', isToday: true },
    { day: 'Sat', count: 3, height: '75%' },
    { day: 'Sun', count: 2, height: '50%' },
  ];

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Status Bar */}
      <TopStatusBar darkText={true} />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4 no-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🕊️</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Progress
          </h1>
        </div>

        {/* Top 2 Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Card 1: Streak */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center mb-1 text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {streakDays}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Day Streak
            </span>
          </div>

          {/* Card 2: Total Time */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-1 text-emerald-700 dark:text-emerald-400">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatHours(totalMinutes)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Total Time
            </span>
          </div>
        </div>

        {/* Verses Meditated Section */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-5">
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Verses Meditated
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">12</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                +1
              </span>
            </div>
          </div>

          {/* Vertical Bar Chart */}
          <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1 pb-1">
            {weekData.map((d) => {
              const isSelected = selectedDay === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDay(d.day)}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  title={`${d.day}: ${d.count} verses`}
                >
                  <div className="w-full flex justify-center items-end h-20">
                    <div
                      style={{ height: d.height }}
                      className={`w-3.5 sm:w-4 rounded-full transition-all duration-300 group-hover:scale-y-105 ${
                        isSelected
                          ? 'bg-emerald-600 shadow-sm shadow-emerald-500/40'
                          : 'bg-emerald-300/80 dark:bg-emerald-900/60'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] transition-colors ${
                      isSelected
                        ? 'font-bold text-emerald-800 dark:text-emerald-300'
                        : 'font-medium text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {d.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Recent Activity
            </span>
            <button
              onClick={onStartMeditation}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span>See all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Activity Item (Matching Psalm 46:10 in screenshot) */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-300">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Psalm 46:10
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Today • 10 min
                </p>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 text-lg shrink-0">
            🏆
          </div>
          <div className="text-xs font-medium text-emerald-900 dark:text-emerald-200 leading-snug">
            You’re growing in faith! Keep going <span className="text-emerald-600 dark:text-emerald-400">🌿</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  );
};
