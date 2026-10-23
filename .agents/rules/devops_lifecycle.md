# Standing Rule: Mandatory 5-Phase DevOps & Full-Spectrum Testing Lifecycle

Every user request, bug fix, or feature enhancement MUST execute through the 5-phase DevOps protocol:

1. **Phase 1: Research & Discovery**:
   - Analyze requirements, inspect related code and state.
   - Search the web for latest reasoning architectures (DeepMind Gemini, Nvidia Nemotron/Cosmos) and GitHub codebases for optimal design patterns.
   - Audit for data integrity and zero answer/secret leaks.

2. **Phase 2: Architectural Planning & Task Logging**:
   - Write plan in `TASK_LOG.md` before modifying code.
   - Explicitly document requirements, research findings, implementation steps, edge cases, and verification criteria.

3. **Phase 3: Utmost Development & Execution**:
   - Highest engineering caliber, clean code, defensive guards, zero placeholders or shortcuts.

4. **Phase 4: Exhaustive Verification & Tester Phase (ANTI-SUPERFICIAL MANDATE)**:
   - Line-by-line inspection of all modified code.
   - Run static analysis and production build (`npm run build`).
   - Run logic tests (`npm run test:rules`).
   - Run full campaign verification (`node scripts/full_campaign_audit.js`).
   - **Never stop at Level 1 or 2**: Validate all levels from start to finish, all buttons, hints, badges, and dialogue for zero answer giveaways.

5. **Phase 5: Automated Delivery & Push**:
   - Stage changes (`git add .`).
   - Commit with descriptive message (`git commit -m "..."`).
   - Push to remote (`git push origin main`).
