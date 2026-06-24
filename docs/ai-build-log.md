# PulseGrid — AI Build Log

## Development Approach

PulseGrid was built with AI assistance at multiple stages:

### Architecture & Design
- AI helped design the 8-factor priority scoring system
- Deterministic rules were chosen for critical severity classification to ensure reliability
- AI handles context-rich tasks (explanations, recommendations) while rules handle safety-critical decisions

### Data Modeling
- Zod schemas validated all data structures
- Demo data was curated to ensure realistic, visually convincing scenarios

### AI Integration
- NVIDIA NIM (Llama 3.3 70B) powers all AI inference
- Structured JSON outputs used for schema validation
- Fallback logic ensures the app works even if AI is unavailable
- All AI prompts are operational and concise

### Testing Approach
- Deterministic ranking logic is testable independently
- Schema validation catches malformed AI outputs
- Fallback paths ensure no dead flows

### Key Decisions
1. **Client-side state** — Simple demo-first architecture, no backend required
2. **Pre-seeded scenarios** — Instant demo access without setup
3. **Hybrid scoring** — Deterministic rules + AI context = trustworthy prioritization
4. **Grounded Q&A** — Assistant only answers from app state, not external knowledge
