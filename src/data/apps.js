import Contacts from "../icons/contacts.png";
import File from "../icons/file-manager.png";
import Code from "../icons/code-editor.png";
import Mobile from "../icons/messages.png";
import SignalDesk from "../icons/signaldesk.svg";
import Nexora from "../icons/nexora.svg";
import Notes from "../icons/notes.png";
import Skills from "../icons/activity-monitor.png";
import Terminal from "../icons/terminal.png";
import Mail from "../icons/mail.png";
import Assistant from "../icons/assistant.svg";

export const APPS = [
  { id: "finder", icon: File, label: "Finder" },
  { id: "about", icon: Contacts, label: "About Me" },
  { id: "projects", icon: Code, label: "Projects" },
  { id: "mobile", icon: Mobile, label: "Mobile Work" },
  { id: "signaldesk", icon: SignalDesk, label: "SignalDesk" },
  { id: "nexora", icon: Nexora, label: "Nexora AI Lab" },
  { id: "skills", icon: Skills, label: "Skills" },
  { id: "resume", icon: Notes, label: "Resume" },
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "contact", icon: Mail, label: "Contact" },
  { id: "assistant", icon: Assistant, label: "Ask About Me" },
];

export const WINDOW_TITLES = {
  finder: "Finder",
  about: "About Me",
  projects: "Projects",
  mobile: "Mobile Work",
  signaldesk: "SignalDesk",
  nexora: "Nexora AI Lab",
  skills: "Skills",
  resume: "Resume",
  terminal: "Terminal",
  contact: "Contact",
  assistant: "Ask About Me",
};

export const WIDE_WINDOWS = [
  "mobile",
  "resume",
  "finder",
  "projects",
  "signaldesk",
  "nexora",
  "skills",
  "assistant",
];
