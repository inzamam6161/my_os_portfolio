import AboutApp from "./AboutApp";
import ContactApp from "./ContactApp";
import FinderApp from "./FinderApp";
import MobileApp from "./MobileApp";
import NexoraApp from "./NexoraApp";
import ProjectsApp from "./ProjectsApp";
import ResumeApp from "./ResumeApp";
import SkillsApp from "./SkillsApp";
import TerminalApp from "./TerminalApp";

const APP_COMPONENTS = {
  finder: FinderApp,
  about: AboutApp,
  projects: ProjectsApp,
  mobile: MobileApp,
  nexora: NexoraApp,
  skills: SkillsApp,
  resume: ResumeApp,
  terminal: TerminalApp,
  contact: ContactApp,
};

export default APP_COMPONENTS;
