export interface TensorPosition {
  id: string;                           // "I2_clean_disk__H1_filesystem__L3_varlog"
  intention: string;                    // "I2_clean_disk"
  hierarchy: string;                    // "H1_filesystem"
  level: number;                        // 3
  world: string;                        // "ubuntu_22.04_server"
  probability: number;                  // 0.82
  vector: number[];                     // [0.34, -0.21, 0.78, ...] 384-dim
  rawScore: number;                     // Pre-normalized score
  connects_to: string[];                // Propagation targets
}

export interface Skill {
  id: string;                           // "skill_nginx_log_cleaner"
  tensorPattern: string;                // "I2_clean*__H1_filesystem__L3_*"
  xp: number;                           // 52.3
  mastery: "none" | "basic" | "advanced" | "master";
  name: string;                         // LLM-generated: "Nginx log rotation expert"
  description: string;                  // "Efficiently manages nginx log rotation"
  world: string;                        // "ubuntu_22.04_server"
  lastUsed: number;                     // timestamp
}

export interface NPCMessage {
  npc: string;                          // "prophet", "critic", "sceptic"
  text: string;                         // Rendered scenario template
  priority: number;                     // 1-5 (sorting)
}

export interface CommandEvent {
  id: string;
  commandLine: string;                  // "rm -rf /var/log/nginx/*.log"
  argv: string[];                       // ["rm", "-rf", "/var/log/nginx/*.log"]
  cwd: string;                          // "/home/янис"
  stdout: string;
  stderr: string;
  exitCode: number;                     // 0 = success
  startedAt: number;                    // timestamp
  finishedAt: number;                   // timestamp
  duration: number;                     // seconds
}

export interface World {
  id: string;
  distro: string;
  packageManager: string;
  serviceManager: string;
  paths: Record<string, string[]>;
  commandPatterns: Record<string, string[]>;
  commonTensors: Record<string, number>;
  tensors: Record<string, TensorPosition>;
}

export interface EngineState {
  activeWorldId: string;
  tensorPositions: Record<string, TensorPosition>;
  skills: Record<string, Skill>;
  npcs: NPCMessage[];
  sessionHistory: CommandEvent[];
  lastUpdate: number;
}
