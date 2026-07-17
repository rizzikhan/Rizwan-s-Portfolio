"use client";
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import portfolioData from "@/data/portfolio.json";
import { type WindowId } from "./desktop";



interface TaskbarProps {
  openWindows: WindowId[];
  activeWindow: WindowId | null;
  onWindowClick: (id: WindowId) => void;
  onStartClick: () => void;
  onShowDesktop?: () => void;
  brightness: number;
  setBrightness: (v: number) => void;
  nightLight: boolean;
  setNightLight: (v: boolean) => void;
  highlightStartButton?: boolean;
}

export const Taskbar = memo(function Taskbar({
  openWindows,
  activeWindow,
  onWindowClick,
  onStartClick,
  onShowDesktop,
  brightness,
  setBrightness,
  nightLight,
  setNightLight,
  highlightStartButton = false
}: TaskbarProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [showSystemPanel, setShowSystemPanel] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<"wifi" | "bluetooth" | null>(null);
  const [volume, setVolume] = useState(75);
  const [viewDate, setViewDate] = useState(new Date());
  
  const systemPanelRef = useRef<HTMLDivElement>(null);
  const systemPanelButtonRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (showCalendar) {
      setViewDate(new Date());
    }
  }, [showCalendar]);



  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const calendarDays = Array.from({ length: getDaysInMonth(viewDate) }, (_, i) => i + 1);
  const offsetDays = Array.from({ length: getFirstDayOfMonth(viewDate) }, (_, i) => i);
  const isCurrentMonth = viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();

  const [systemStates, setSystemStates] = useState({
    wifi: true,
    bluetooth: true,
    airplane: false,
    battery: false,
    accessibility: false
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-50">
      {/* Taskbar Background - Windows 11 style with blur */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: "var(--os-taskbar)",
          borderTop: "1px solid var(--os-taskbar-border)",
        }}
      />

      {/* Taskbar Content */}
      <div className="relative h-full px-2 flex items-center">
        {/* Left Section - Empty */}
        <div className="flex-1" />

        {/* Center Section - Taskbar Icons */}
        <div className="flex-none flex items-center gap-1 px-2">
          {/* Start Button */}
          <motion.button
            onClick={onStartClick}
            className={`relative w-10 h-10 rounded-md flex items-center justify-center hover:bg-foreground/10 hover-scale-108 active-scale-92 transition-all duration-120 ${
              highlightStartButton ? "bg-foreground/5" : ""
            }`}
            title="Start"
            animate={highlightStartButton ? {
              y: [0, -2, 0],
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 0 0 rgba(56, 189, 248, 0)",
                "0 8px 24px rgba(56, 189, 248, 0.2)",
                "0 0 0 rgba(56, 189, 248, 0)"
              ]
            } : {
              y: 0,
              scale: 1,
              boxShadow: "0 0 0 rgba(56, 189, 248, 0)"
            }}
            transition={highlightStartButton ? {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              duration: 0.2
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="windowsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <rect x="3" y="3" width="8" height="8" rx="1" fill="url(#windowsGrad)" />
              <rect x="13" y="3" width="8" height="8" rx="1" fill="url(#windowsGrad)" />
              <rect x="3" y="13" width="8" height="8" rx="1" fill="url(#windowsGrad)" />
              <rect x="13" y="13" width="8" height="8" rx="1" fill="url(#windowsGrad)" />
            </svg>
            {highlightStartButton && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-md bg-sky-400/10"
                  animate={{ opacity: [0.08, 0.22, 0.08] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute inset-1 rounded-md border border-sky-400/40"
                  animate={{ opacity: [0.35, 0.85, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="absolute -top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b border-sky-400/40 bg-sky-400/10"
                  animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -3, 0], scale: [0.9, 1, 0.9] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </motion.button>

          {/* Search Button - Desktop only */}
          <button
            onClick={onStartClick}
            className="hidden md:flex w-10 h-10 rounded-md items-center justify-center hover:bg-foreground/10 hover-scale-108 active-scale-92 transition-all duration-120 group"
          >
            <svg className="w-5 h-5 text-os-text-primary opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Separator */}
          {openWindows.length > 0 && (
            <div className="w-px h-6 bg-foreground/10 mx-1" />
          )}

          {/* Open Windows */}
          {openWindows.map((windowId) => (
            <button
              key={windowId}
              onClick={() => onWindowClick(windowId)}
              className={`relative w-10 h-10 rounded-md flex items-center justify-center transition-all duration-120 ${
                activeWindow === windowId
                  ? "bg-foreground/15"
                  : "hover:bg-foreground/10 hover-scale-108 active-scale-92"
              }`}
              title={WINDOW_LABELS[windowId]}
            >
              <TaskbarIcon name={windowId} />
              {/* Active indicator */}
              {activeWindow === windowId && (
                <div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#38bdf8]"
                />
              )}
              {/* Open but not active indicator */}
              {activeWindow !== windowId && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full bg-foreground/30" />
              )}
            </button>
          ))}
        </div>

        {/* Right Section - System Tray */}
        <div className="flex-1 flex items-center justify-end gap-1">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* System icons - Desktop only */}
          <div 
            onClick={() => { setShowSystemPanel(!showSystemPanel); setShowCalendar(false); }}
            className={`hidden md:flex items-center gap-0.5 px-2 py-1 rounded-md transition-colors group cursor-pointer ${showSystemPanel ? 'bg-foreground/15' : 'hover:bg-foreground/10'}`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-os-text-primary opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              <svg className="w-3.5 h-3.5 text-os-text-primary opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
          </div>

          {/* Date/Time */}
          <button 
            onClick={() => { setShowCalendar(!showCalendar); setShowSystemPanel(false); }}
            className={`px-2 py-1 rounded-md transition-colors text-right flex flex-col items-end justify-center min-w-[80px] ${showCalendar ? 'bg-foreground/15' : 'hover:bg-foreground/10'}`}
          >
            <div className="text-[10px] md:text-xs text-os-text-primary font-medium leading-tight">{time}</div>
            <div className="text-[9px] md:text-[10px] text-os-text-secondary hidden md:block leading-tight">{date}</div>
          </button>

          {/* Show Desktop Spacer */}
          <div 
            onClick={onShowDesktop}
            className="hidden md:block w-1.5 h-8 border-l border-foreground/10 ml-1 hover:bg-foreground/5 transition-colors cursor-pointer" 
            title="Show desktop" 
          />
        </div>
      </div>

      <AnimatePresence>
        {showSystemPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-14 right-2 left-2 md:left-auto md:w-80 bg-os-popover-bg border border-black/10 dark:border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl z-50 text-os-text-primary transition-colors duration-300"
          >
            <div className="flex flex-col gap-4">
              {activeSubMenu ? (
                <div className="flex flex-col gap-3 min-h-[200px]">
                  <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2 mb-1">
                    <button 
                      onClick={() => setActiveSubMenu(null)}
                      className="p-1 hover:bg-foreground/10 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm font-semibold capitalize">{activeSubMenu === 'wifi' ? 'Wi-Fi' : 'Bluetooth'}</span>
                  </div>
                  <div className="space-y-1">
                    {activeSubMenu === 'wifi' ? (
                      ['Crymzee_5G', 'Private_Network', 'CoffeeShop_Free', 'Guest_Access'].map(net => (
                        <button key={net} className="w-full text-left px-3 py-2 rounded-lg hover:bg-foreground/10 flex items-center justify-between group transition-colors">
                          <span className="text-xs">{net}</span>
                          <svg className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                      ))
                    ) : (
                      ['Sony WH-1000XM4', 'Logitech MX Master 3', 'Keychron K2', 'AirPods Pro'].map(dev => (
                        <button key={dev} className="w-full text-left px-3 py-2 rounded-lg hover:bg-foreground/10 flex items-center justify-between group transition-colors">
                          <span className="text-xs">{dev}</span>
                          <span className="text-[10px] text-os-text-secondary opacity-0 group-hover:opacity-100">Connected</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'wifi', icon: "wifi", label: "Hashlogics_5G", hasSub: true },
                      { id: 'bluetooth', icon: "bluetooth", label: "Bluetooth", hasSub: true },
                      { id: 'airplane', icon: "airplane", label: "Airplane mode" },
                      { id: 'battery', icon: "battery", label: "Battery saver" },
                      { id: 'night', icon: "moon", label: "Night light", isNight: true },
                      { id: 'accessibility', icon: "accessibility", label: "Accessibility" },
                    ].map((item) => {
                      const isActive = item.isNight ? nightLight : (systemStates as any)[item.id];
                      return (
                        <div key={item.id} className="flex flex-col items-center gap-1 group">
                          <div className="w-full flex">
                            <button 
                              className={`flex-1 aspect-square rounded-l-md flex items-center justify-center transition-colors ${isActive ? 'bg-[#38bdf8] text-white' : 'bg-foreground/10 text-os-text-primary opacity-70 hover:opacity-100 hover:bg-foreground/20'} ${!item.hasSub && 'rounded-r-md'}`}
                              onClick={() => {
                                if (item.isNight) setNightLight(!nightLight);
                                else setSystemStates(prev => ({ ...prev, [item.id]: !isActive }));
                              }}
                            >
                              <SystemIcon name={item.icon} />
                            </button>
                            {item.hasSub && (
                              <button 
                                onClick={() => setActiveSubMenu(item.id as any)}
                                className={`w-8 aspect-square rounded-r-md flex items-center justify-center border-l border-white/10 transition-colors ${isActive ? 'bg-[#38bdf8] text-white' : 'bg-foreground/10 text-os-text-primary opacity-70 hover:opacity-100 hover:bg-foreground/20'}`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] text-os-text-secondary group-hover:text-os-text-primary transition-colors text-center truncate w-full">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setVolume(v => v === 0 ? 75 : 0)}>
                        <SystemIcon name={volume === 0 ? "volume-mute" : "volume"} />
                      </button>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={volume} 
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="flex-1 h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-[#38bdf8]" 
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <SystemIcon name="sun" />
                      <input 
                        type="range" 
                        min="20" max="120" 
                        value={brightness} 
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="flex-1 h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-[#38bdf8]" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-14 right-2 left-2 md:left-auto md:w-80 bg-os-popover-bg border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden transition-colors duration-300"
          >
            <div className="p-3 md:p-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between text-os-text-primary font-medium text-sm md:text-base">
                <span>{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <div className="flex gap-1 md:gap-2 text-os-text-primary">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 md:p-1 hover:bg-foreground/10 rounded transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 md:p-1 hover:bg-foreground/10 rounded transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3 md:p-4 grid grid-cols-7 gap-0.5 md:gap-1 text-center text-os-text-primary">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <span key={day} className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase mb-1 md:mb-2">{day}</span>
              ))}
              {offsetDays.map(i => (
                <div key={`offset-${i}`} className="aspect-square" />
              ))}
              {calendarDays.map(day => (
                <button
                  key={day}
                  className={`aspect-square flex items-center justify-center text-[10px] md:text-xs rounded-full transition-colors ${isCurrentMonth && day === new Date().getDate() ? 'bg-[#38bdf8] text-white font-bold' : 'hover:bg-foreground/10'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function TaskbarIcon({ name }: { name: string }) {
  const iconClasses = "w-5 h-5";

  const icons: Record<string, React.ReactNode> = {
    about: (
      <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <svg className={iconClasses} fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    ),
    projects: (
      <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
        <svg className={iconClasses} fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
    ),
    experience: (
      <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
        <svg className={iconClasses} fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    contact: (
      <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
        <svg className={iconClasses} fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
  };

  return <>{icons[name] || null}</>;
}

function SystemIcon({ name }: { name: string }) {
  const iconClasses = "w-4 h-4";
  
  const icons: Record<string, React.ReactNode> = {
    wifi: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    bluetooth: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l10 10-5 5V2l5 5L7 17" />
      </svg>
    ),
    airplane: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    battery: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zM21 10h1M5 10v4" />
      </svg>
    ),
    moon: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    accessibility: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    volume: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    "volume-mute": (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    sun: (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4-12H3m15.364 6.364l-.707.707M6.343 6.343l-.707.707m12.728 12.728l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

// Static window labels - outside component
const WINDOW_LABELS: Record<string, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  contact: "Contact",
};
