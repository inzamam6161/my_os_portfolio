import Contacts from "../icons/contacts.png";
import File from "../icons/file-manager.png";
import Code from "../icons/code-editor.png";
import Mobile from "../icons/messages.png";
import Notes from "../icons/notes.png";
import Skills from "../icons/activity-monitor.png";
import Terminal from "../icons/terminal.png";
import Mail from "../icons/mail.png";

// src/data/apps.js
export const APPS = [
  { id: "finder", icon: File, label: "Finder" },
  { id: "about",  icon: Contacts, label: "About Me" },
  { id: "projects", icon: Code, label: "Projects" },
  { id: "mobile", icon: Mobile, label: "Mobile Work" },
  { id: "skills", icon: Skills, label: "Skills" },
  { id: "resume", icon: Notes, label: "Resume" },
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export const WINDOW_TITLES = {
  finder: "Finder",
  about:  "About Me",
  projects: "Projects",
  mobile: "Mobile Work",
  skills: "Skills",
  resume: "Resume",
  terminal: "Terminal",
  contact: "Contact",
};

export const WIDE_WINDOWS = ["mobile", "resume", "finder", "projects"];
