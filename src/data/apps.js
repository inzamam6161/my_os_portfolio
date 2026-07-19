import Contacts from "../icons/contacts.png";
import File from "../icons/file-manager.png";

// src/data/apps.js
export const APPS = [
  { id: "finder", icon: File, label: "Finder" },
  { id: "about",  icon: Contacts, label: "About Me" },
  // ... more apps
];

export const WINDOW_TITLES = {
  finder: "Finder",
  about:  "About Me",
  // ...
};

export const WIDE_WINDOWS = ["mobile", "resume", "finder"];