

---

# Hybrid CLI Engine — Foundations & Logical Objects

---

## 1. Purpose

The CLI is not merely a sequence of text commands.

Users do not type commands; they **act intentionally** inside a world.
The system’s purpose is to **observe actions and infer the underlying intentions**, helping the user by reasoning at a higher level of abstraction.

This is the engine’s central philosophical principle:

> **Focus on intent and meaning, not raw text.**

---

## 2. Ontology & World

The world is structured along several independent axes:

1. **Intention layers**: metaquests → quests → subquests → atomic → resources
2. **Hierarchies**: filesystem, network, installation, process, configuration
3. **Granularity/Level**: file → directory → volume, thread → process → cluster
4. **World context**: Ubuntu, Arch, macOS, custom

Each axis describes **what exists**, not what the user is doing.

Commands are **effects in this structured world**, observable as changes in these axes.

---

## 3. Events & Trajectories

Commands themselves are **surface phenomena**.

* `apt install apache2`
* `git clone apache-repo`
* `rm -rf /var/log/nginx/*`

These are **observed events**, not the goal.

Meaning emerges from sequences of events:

* Trajectories = ordered state changes across layers over time
* Patterns = repeated or correlated changes in trajectories

The engine reasons about **trajectories**, not single commands.

---

## 4. Logical Objects (LO) — Core Concept

### 4.1 Definition

A **Logical Object (LO)** is a **temporally coherent, latent cause** that explains why multiple domain objects are changing together.

It is **not** a file, process, or directory.
It is **what the user is doing**, emergent from correlated changes.

---

### 4.2 Counter-intuitive points

1. **LO ≠ intersection**
   Many intuitively think LO is an intersection of ontology axes.
   Example:

   * `I3_install` ∩ `H3_install` ∩ `Ubuntu`
   * This “intersection” may be empty!
   * Yet the user is clearly doing **“Apache setup”**.

   **Truth:** LO is a **coherent bundle**, not a point. It spans multiple layers and hierarchies.

2. **LO emerges, does not pre-exist**

   * Predefined quests and tasks may exist.
   * LO arises dynamically from observed activity.
   * Even unknown tasks or scripts can generate LOs.

3. **LO can overlap**

   * Example: cleaning `/tmp` while installing Apache:

     * Disk cleanup LO
     * Apache deployment LO
   * Same files affected in different ways → two LOs coexist.

4. **LO is causal, not geometric**

   * Ontology = nouns (what exists)
   * Trajectories = verbs (what happens)
   * LO = hidden “why” behind actions

---

### 4.3 Examples

#### Example 1: Apache Deployment

Trajectory of events:

1. `apt install apache2` → H3_install
2. `systemctl start apache2` → H4_process
3. `rm -rf /var/log/apache2/*.log` → H1_filesystem

**LO inference: “Apache Deployment”**

* Spans multiple layers & hierarchies
* Explains correlated changes
* Emerges naturally, even if we didn’t predefine “Apache Deployment”

---

#### Example 2: Git Repo Setup

1. `git clone apache-repo` → H1_filesystem / repo
2. `cd apache-repo && make` → H3_install / build
3. `vim config.yaml` → H5_config

**LO: “Development Environment Setup”**

* Same repository affects filesystem, build system, configuration
* Not visible from intersection of layers
* LO emerges from **pattern of state changes**

---

#### Example 3: Simultaneous LOs

1. `apt install apache2`
2. `rm -rf /tmp/*`

* Two overlapping LOs:

  * **Apache Deployment**
  * **Disk Cleanup**

* The same file changes may belong to different LOs.

* The engine tracks coherence per LO over time, not per file.

---

### 4.4 Why LOs are central

Without LOs:

* The engine sees a jumble of events
* Tensors float, skills feel arbitrary
* NPCs cannot explain anything meaningfully

With LOs:

* Engine moves from **surface events → latent causes → skills / NPC explanations**
* Predictive power increases: next action = function of LO, not single tensor

---

## 5. Static vs Dynamic Activity

* **Static (scripted)**: entire command sequence known → LO inferred immediately
* **Dynamic (interactive)**: commands chosen step-by-step → LO emerges gradually

LO inference applies **both cases**.

* Static = reduces uncertainty quickly
* Dynamic = multiple trajectories explored probabilistically

---

## 6. Skills

* Skills = statistics over repeated LOs
* Accumulate knowledge of how user handles certain tasks
* Supports prediction, personalization, and user guidance

Example:

* LO: Apache Deployment
* Skill: `apache_setup_expert` → XP rises as the user repeats this LO successfully

---

## 7. NPCs

* NPCs are **narrative lenses on LOs and skills**

* Personas highlight different aspects: prediction, guidance, uncertainty, progress

* They **do not create new LOs**

* They **present existing LOs** in human-readable form

---

## 8. LO Extraction (Preview)

LOs are inferred from trajectories.

**Process:**

1. Observe state changes across multiple axes
2. Identify **coherent bundles of changes**
3. Estimate **temporal coherence** and **probability**
4. Cluster correlated tensors into candidate LOs
5. Track, update, merge, or split LOs dynamically

* Each LO has:

  * member tensors
  * activation probability
  * start/end timestamps
  * optional skill associations

LO extraction is the **mechanism that turns chaotic events into meaningful tasks**, forming the foundation for prediction, skill growth, and NPC explanations.

---

## 9. Summary Mental Model

1. **Ontology** = what exists (nouns)
2. **Events** = what happens (verbs)
3. **Trajectories** = sequences of events (stories)
4. **Logical Objects** = why it happens (latent causes)
5. **Skills** = learned competence over LOs
6. **NPCs/UI** = human-readable presentation

> LO sits at the center: bridging raw events to abstract meaning.

---

This document establishes the **philosophical foundation** and intuition for LOs, including counter-intuitive points and examples.

**Next step:** Part II — Mathematical Model & LO extraction algorithm, where these ideas become formalized with tensors, probabilities, and inference.

-=
