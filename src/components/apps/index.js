// src/components/apps/index.js
// ─────────────────────────────────────────────────────────────
// Central registry that maps every app id → its React component.
//
// WHY AN INDEX FILE?
//   App.jsx doesn't need to know about every individual app
//   component.  It just does:
//     import APP_COMPONENTS from "./components/apps";
//     const Content = APP_COMPONENTS[windowId];
//   Adding a new app = add one line here. Nothing else changes.
// ─────────────────────────────────────────────────────────────

import FinderApp   from "./FinderApp";
import AboutApp    from "./AboutApp";
import ProjectsApp from "./ProjectsApp";
import MobileApp   from "./MobileApp";
import ResumeApp   from "./ResumeApp";
import SkillsApp   from "./SkillsApp";
import TerminalApp from "./TerminalApp";
import ContactApp  from "./ContactApp";

const APP_COMPONENTS = {
  finder:   FinderApp,
  about:    AboutApp,
  projects: ProjectsApp,
  mobile:   MobileApp,
  resume:   ResumeApp,
  skills:   SkillsApp,
  terminal: TerminalApp,
  contact:  ContactApp,
};

export default APP_COMPONENTS;
