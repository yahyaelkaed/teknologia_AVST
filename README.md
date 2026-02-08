# VOICE‑TO‑SIGN (AVST)

## Bridging Communication Through Inclusive AI
#MaraTechEsprit2026-Teknologia
---

## 📌 Project Overview

**AVST is an inclusive AI-powered web application designed to **eliminate communication barriers between hearing people and deaf or hard‑of‑hearing individuals**.

The platform translates **spoken Tunisian Arabic (and other languages)** into **Tunisian Sign Language (LST)** using a **3D human avatar**, enabling real‑time, accessible, and dignified communication—especially in **medical, administrative, and emergency contexts**.

This project was developed during the **Maratech Hackathon (6–8 February 2026)** in collaboration with the **Association Voix du Sourd de Tunisie (AVST)**, which is committed to maintaining and using the solution beyond the hackathon.

---

## 🎯 Problem Statement

Communication between deaf/mute individuals and the hearing population remains a major challenge, particularly when:

* No human interpreter is available
* The situation is urgent (medical emergencies)
* The user is sick, stressed, or physically unable to communicate clearly

Existing solutions are often:

* Limited to static dictionaries
* Not adapted to Tunisian Sign Language
* Video‑based (non‑interactive)
* Not accessible to people with additional disabilities

---

## ✅ Our Solution

AVST acts as a **virtual sign language interpreter**, combining:

* **Speech recognition** (Tunisian Arabic)
* **Intelligent phrase matching (rule‑based + semantic logic)**
* **Real human motion capture**
* **A controllable 3D avatar** that signs accurately in LST

The result is a **fully reusable, scalable, and accessible communication system**, designed for real‑world use.

---

## 🧠 Key Features

### 🎤 Speech‑to‑Text (Input)

* Real‑time voice capture via microphone
* Tunisian Arabic speech recognition
* Text input fallback for silent or weak users

### 🔁 Intelligent Mapping Engine

* Rule‑based dictionary (validated LST phrases)
* Semantic matching for STT errors and variants
* Phrase‑level and word‑level fallback logic

### 🧍‍♂️ 3D Avatar Sign Language Output

* Photorealistic humanoid avatar
* Driven by **real human motion** using AI motion capture
* Sequential animation playback (sign chaining)
* Accurate arm, body, and hand articulation

### ♿ Accessibility‑First Design

* High‑contrast, color‑blind safe UI (blue‑based)
* Large text & simplified language modes
* Low‑energy / fatigue‑aware mode
* Touch‑based communication (icons instead of voice)

### 🚑 Health & Emergency Support

* Emergency phrase mode (pain, breathing, allergies, chronic illness)
* Symptom‑to‑communication mapper
* Caregiver / doctor dual‑view interface

### 🌍 Inclusive by Design

* Multi‑language input (Tunisian Arabic, French, English, Spanish)
* Output always in Tunisian Sign Language
* Designed for hospitals, public services, and daily life

---

## 🏗️ Technical Architecture

### Frontend

* **React.js**
* **Node.js**

### 3D & Animation Pipeline

* Humanoid avatar (GLB / GLTF)
* Motion capture from real human videos using **DeepMotion**
* Animation cleanup and retargeting via **SketchFab**
* Multiple named animation clips (HELLO, THANKS, HELP, etc.)

### AI & Logic

* Speech‑to‑Text engine (Tunisian dialect)
* Deterministic animation orchestration (playlist model)

### Assets

* LST dictionary and video references provided & validated with AVST mentors
* Animations mapped to standardized sign IDs

---

## 🔄 System Workflow

1. User speaks or types
2. Speech is transcribed into text
3. Text is normalized and matched against LST dictionary
4. Matching engine returns a sequence of sign IDs
5. 3D avatar plays the corresponding animations in order
6. Optional subtitles / voice output displayed

---

## 📦 Deliverables (Hackathon Scope)

### MVP (Achieved)

* Functional Voice → Avatar pipeline
* Basic LST sign set
* Real‑time interaction

### Ideal Target

* Full sentence signing
* Smooth animation transitions
* Production‑ready UI

---

## 🤝 Collaboration with AVST

The Association Voix du Sourd de Tunisie provided:

* Linguistic expertise in Tunisian Sign Language
* Validation of gestures and sign accuracy
* Real‑world usage insights

AVST has formally committed to:

* Using the solution after the hackathon
* Participating in future improvements

---

## 🏆 Innovation Highlights

* **Not a video avatar**: fully controllable 3D human
* Real human motion transfer, not synthetic gestures
* Designed for **medical and vulnerable contexts**
* Accessibility as a default, not an add‑on

> “We don’t generate videos of humans — we generate humans that can communicate.”

---

## 🚀 Roadmap

### Short‑Term

* Expand LST vocabulary
* Improve finger precision
* Add offline emergency phrases

### Mid‑Term

* Bidirectional mode (Sign → Text)
* Integration with hospitals & public services
* User profiles (medical data)

### Long‑Term

* MetaHuman‑level realism
* AI‑assisted sign generation
* National deployment with AVST

---

## 📜 License & Ethics

This project is developed with:

* Full respect of deaf culture and linguistic integrity
* Ethical AI principles
* Non‑profit social impact alignment

---

## 👥 Team & Event

* **Hackathon**: Maratech Hackathon 2026
* **Team Name** :Teknologia
* **Duration**: 42 hours
* **Focus**: Accessibility, Health, Social Inclusion

---

## 📞 Contact

For partnerships, deployment, or further development:

**Association Voix du Sourd de Tunisie (AVST)**
Project Reference: *Voice‑to‑Sign*

---

> Accessibility is not a feature. It is the foundation.
