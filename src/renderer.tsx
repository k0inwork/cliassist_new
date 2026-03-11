import './index.css';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal as TerminalIcon, Cpu, Shield, BookOpen, MessageSquare } from 'lucide-react';
import 'xterm/css/xterm.css';

const App = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const [state, setState] = useState<any>({
    activeWorldId: 'ubuntu_22.04_server',
    tensorPositions: {},
    skills: {},
    npcs: [
        { npc: 'Prophet', text: '🎯 Waiting for your first command...', priority: 1 }
    ]
  });
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#1e1e1e',
      },
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    term.onData((data) => {
      (window as any).electronAPI.sendTerminalInput(data);
    });

    (window as any).electronAPI.onTerminalData((data: string) => {
      term.write(data);
    });

    (window as any).electronAPI.onCommandCaptured((event: any) => {
        // In a real app, the engine would process this and send back updated state
        // For demo, we'll just update the last command
        console.log('Command captured:', event);
    });

    window.addEventListener('resize', () => {
      fitAddon.fit();
      (window as any).electronAPI.resizeTerminal(term.cols, term.rows);
    });

    // Hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'h') {
            setShowOverlay(!showOverlay);
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      term.dispose();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '10px' }} ref={terminalRef} />
      </div>

      {showOverlay && (
        <div style={{ width: '300px', backgroundColor: '#252526', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007acc', marginBottom: '4px' }}>
                <TerminalIcon size={18} />
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>HYBRID ENGINE v5.2</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>WORLD: {state.activeWorldId}</div>
          </div>

          {/* Tensor Space */}
          <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '10px' }}>
                <Cpu size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>TENSOR SPACE</span>
            </div>
            <div style={{ fontSize: '0.8rem', backgroundColor: '#333', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#4ec9b0', fontWeight: 'bold' }}>I2_clean_disk × H1_fs [82%]</div>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>vec:[0.34, -0.21, 0.78...]</div>
            </div>
          </div>

          {/* Skills */}
          <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '10px' }}>
                <Shield size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ACTIVE SKILLS</span>
            </div>
            <div style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>nginx_log_cleaner</span>
                    <span style={{ color: '#ce9178' }}>52 XP</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#333', borderRadius: '2px' }}>
                    <div style={{ width: '52%', height: '100%', backgroundColor: '#007acc', borderRadius: '2px' }} />
                </div>
            </div>
          </div>

          {/* NPC Council */}
          <div style={{ padding: '15px', flex: 1, overflowY: 'auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '10px' }}>
                <MessageSquare size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>NPC COUNCIL</span>
            </div>
            {state.npcs.map((npc: any, i: number) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#569cd6' }}>{npc.npc.toUpperCase()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic', marginTop: '2px' }}>{npc.text}</div>
                </div>
            ))}
          </div>

          {/* Footer / Hotkeys */}
          <div style={{ padding: '10px', fontSize: '0.65rem', color: '#666', borderTop: '1px solid #333', textAlign: 'center' }}>
            ? = explain | W = world | N = next | Ctrl+H = toggle
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
