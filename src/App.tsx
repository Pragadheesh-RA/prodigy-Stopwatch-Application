import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, Square, Clock, Trophy, Zap, Mail, Phone, Globe, ChevronDown, ChevronUp, Settings, Info } from 'lucide-react';

interface LapTime {
  id: number;
  time: number;
  timestamp: Date;
}

function App() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showDeveloperInfo, setShowDeveloperInfo] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lapCounter = useRef<number>(1);

  const formatTime = useCallback((milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);

  const startStopwatch = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
      setIsRunning(true);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    }
  }, [isRunning, time]);

  const resetStopwatch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setIsRunning(false);
    setLapTimes([]);
    lapCounter.current = 1;
  }, []);

  const recordLap = useCallback(() => {
    if (isRunning && time > 0) {
      const newLap: LapTime = {
        id: lapCounter.current++,
        time: time,
        timestamp: new Date(),
      };
      setLapTimes(prev => [newLap, ...prev]);
    }
  }, [isRunning, time]);

  const getBestWorstLaps = useCallback(() => {
    if (lapTimes.length === 0) return { best: null, worst: null };
    
    const times = lapTimes.map(lap => lap.time);
    const bestTime = Math.min(...times);
    const worstTime = Math.max(...times);
    
    return {
      best: lapTimes.find(lap => lap.time === bestTime),
      worst: lapTimes.find(lap => lap.time === worstTime)
    };
  }, [lapTimes]);

  const { best, worst } = getBestWorstLaps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Professional Stopwatch</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-4 py-4">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2">Time Format</label>
                <select className="w-full bg-slate-600 rounded px-3 py-2 text-sm">
                  <option>MM:SS.MS</option>
                  <option>HH:MM:SS</option>
                  <option>Seconds Only</option>
                </select>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2">Sound</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Enable lap sound</span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select className="w-full bg-slate-600 rounded px-3 py-2 text-sm">
                  <option>Dark Blue</option>
                  <option>Dark Purple</option>
                  <option>Classic Dark</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Info Dropdown */}
      {showDeveloperInfo && (
        <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-4 py-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center">
              <div className="bg-slate-700/50 rounded-xl p-6 max-w-md w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">RA</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-lg">Pragadheesh RA</h4>
                      <p className="text-slate-400">Rafinity</p>
                      <p className="text-slate-500 text-sm">Full-Stack Developer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <a 
                      href="mailto:contact@rafinity.dev" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-600/50 hover:bg-slate-600 transition-colors group text-sm"
                    >
                      <Mail className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span>pragadheesharumugam@gmail.com</span>
                    </a>
                    
                    <a 
                      href="tel:+1234567890" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-600/50 hover:bg-slate-600 transition-colors group text-sm"
                    >
                      <Phone className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                      <span>+91 9360219797</span>
                    </a>
                    
                    <a 
                      href="https://rafinity.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-600/50 hover:bg-slate-600 transition-colors group text-sm"
                    >
                      <Globe className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                      <span>rafinity.dev</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Professional Stopwatch
          </h1>
          <p className="text-slate-400">Precision timing for professionals</p>
        </header>

        {/* Main Stopwatch Display */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-mono font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {formatTime(time)}
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={startStopwatch}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                  isRunning
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25'
                }`}
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              
              <button
                onClick={resetStopwatch}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Square className="w-6 h-6" />
                Reset
              </button>
              
              <button
                onClick={recordLap}
                disabled={!isRunning}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                  isRunning
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-6 h-6" />
                Lap
              </button>
            </div>
          </div>
        </div>

        {/* Lap Times */}
        {lapTimes.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Lap Times ({lapTimes.length})
            </h2>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lapTimes.map((lap) => {
                const isBest = best && lap.id === best.id;
                const isWorst = worst && lap.id === worst.id && lapTimes.length > 1;
                
                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                      isBest
                        ? 'bg-green-500/20 border border-green-500/30'
                        : isWorst
                        ? 'bg-red-500/20 border border-red-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-slate-400">
                        #{lap.id}
                      </span>
                      {isBest && <Trophy className="w-5 h-5 text-green-400" />}
                      {isWorst && <Zap className="w-5 h-5 text-red-400" />}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold">
                        {formatTime(lap.time)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {lap.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 px-4 py-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RA</span>
              </div>
              <div>
                <p className="text-sm font-medium">Developed by RA - Rafinity</p>
                <p className="text-xs text-slate-400">© 2025 Rafinity. Crafted with precision.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-sm"
            >
              <span>Contact</span>
              {showDeveloperInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;