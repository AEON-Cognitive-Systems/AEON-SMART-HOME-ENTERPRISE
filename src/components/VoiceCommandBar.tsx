import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Radio, Terminal, Sparkles, Volume2 } from 'lucide-react';

interface VoiceCommandBarProps {
  onExecuteCommand: (command: string) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  lastCommand: string;
}

export const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({
  onExecuteCommand,
  isListening,
  setIsListening,
  lastCommand
}) => {
  const [speechSupported, setSpeechSupported] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [interimText, setInterimText] = useState('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: simulate voice input
      onExecuteCommand("AEON, give me an estate status briefing");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('Listening for vocal directive...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInterimText(transcript);

        if (event.results[0].isFinal) {
          onExecuteCommand(transcript);
          setIsListening(false);
          setInterimText('');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecuteCommand(inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto">
      <div className="glass-panel-elevated rounded-2xl p-3 border border-cyan-500/30 shadow-2xl flex flex-col gap-2">
        {/* Active Speech Waveform Banner if listening */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span>AEON ACOUSTIC SENSORS ACTIVE:</span>
              <span className="text-white italic">{interimText || 'Speak now...'}</span>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 14}px`,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input & Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Microphone button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Click to speak voice directive to AEON"}
            className={`p-3 rounded-xl border transition-all flex items-center justify-center flex-shrink-0 relative group ${
              isListening
                ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-lg shadow-rose-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="sr-only">Voice Command</span>
          </button>

          {/* Text Command Form */}
          <form onSubmit={handleManualSubmit} className="flex-1 flex items-center relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Vocal directive or query: 'Status report', 'Dim atrium lights', 'Lockdown', 'Night watch'..."
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 text-xs font-mono text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm"
            >
              <span>EXEC</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {/* Last command readout */}
          {lastCommand && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 max-w-xs truncate">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">Prev: <strong className="text-slate-200">{lastCommand}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
