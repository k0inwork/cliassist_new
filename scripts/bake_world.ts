import { VectorEngine } from '../src/engine/VectorEngine';
import { LogLearner } from '../src/engine/LogLearner';
import * as fs from 'fs';
import * as path from 'path';

async function bake() {
  const engine = new VectorEngine();
  await engine.initialize();

  const learner = new LogLearner();
  const corpusPath = path.join(__dirname, '../src/data/ubuntu_training_corpus.log');
  const commands = learner.parseCorpus(corpusPath);
  console.log(`Parsed ${commands.length} commands from corpus`);

  const worldPath = path.join(__dirname, '../src/worlds/ubuntu_22.04_server.json');
  const world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));

  const initialTensors = [
    {
      id: "I3_install_app__H3_install__L1_deb_pkg",
      intention: "I3_install_app",
      hierarchy: "H3_install",
      level: 1,
      description: "installing debian packages using apt or apt-get",
      connects_to: []
    },
    {
      id: "I2_clean_disk__H1_filesystem__L3_varlog",
      intention: "I2_clean_disk",
      hierarchy: "H1_filesystem",
      level: 3,
      description: "cleaning up log files in /var/log to free up disk space",
      connects_to: []
    },
    {
        id: "I1_ls_files__H1_filesystem__L3_varlog",
        intention: "I1_ls_files",
        hierarchy: "H1_filesystem",
        level: 3,
        description: "listing files in /var/log directory",
        connects_to: ["I2_clean_disk__H1_filesystem__L3_varlog"]
    },
    {
        id: "I2_git_workflow__H5_config__L2_repo",
        intention: "I2_git_workflow",
        hierarchy: "H5_config",
        level: 2,
        description: "managing source code with git version control system",
        connects_to: []
    }
  ];

  // Update or add tensors
  for (const t of initialTensors) {
    const vector = await engine.embed(t.description);
    world.tensors[t.id] = {
      ...t,
      world: world.id,
      probability: 0,
      vector,
      rawScore: 0
    };
  }

  // Use corpus to identify "popular" commands and potentially boost tensors
  // (Simplified: if many 'git' commands found, boost git workflow prior)
  const gitCmds = commands.filter(c => c.commandLine.startsWith('git')).length;
  if (gitCmds > 0) {
      console.log(`Boosting git workflow prior based on ${gitCmds} corpus commands`);
      world.commonTensors["I2_git_workflow__H5_config__L2_repo"] = 0.9;
  }

  fs.writeFileSync(worldPath, JSON.stringify(world, null, 2));
  console.log('World baked successfully with corpus insights');
}

bake().catch(console.error);
