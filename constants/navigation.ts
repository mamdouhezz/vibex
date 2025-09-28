
import {
    FaHome, FaTasks, FaUserFriends, FaCode, FaCreditCard, FaCog, FaLifeRing, FaUserCircle,
    FaChartLine, FaRocket, FaLightbulb, FaPuzzlePiece, FaProjectDiagram, FaBook, FaRobot,
    FaCalendarAlt, FaTrello, FaFolderOpen, FaUsers, FaGlobe, FaShieldAlt, FaChartArea,
    FaStore, FaPalette, FaBell, FaFlask, FaBullseye, FaComments
} from 'react-icons/fa';
import { NavigationItem } from '../types/index.ts';

export const NAVIGATION_STRUCTURE: NavigationItem[] = [
  {
    id: "home",
    icon: FaHome,
    subPages: [
      { id: "home-overview" },
      { id: "home-insights" },
      { id: "home-news" }
    ]
  },
  {
    id: "tasks",
    icon: FaTasks,
    subPages: [
      { id: "tasks-all" },
      { id: "tasks-progress" },
      { id: "tasks-completed" },
      { id: "tasks-priority" }
    ]
  },
  {
    id: "analytics",
    icon: FaChartLine,
    subPages: [
      { id: "analytics-traffic" },
      { id: "analytics-users" },
      { id: "analytics-revenue" },
      { id: "analytics-reports" }
    ]
  },
  {
    id: "projects",
    icon: FaTrello,
    subPages: [
      { id: "projects-kanban" },
      { id: "projects-roadmap" }
    ]
  },
  {
    id: "users",
    icon: FaUserFriends,
    subPages: [
      { id: "users-all" },
      { id: "users-roles" },
      { id: "users-invitations" },
      { id: "users-analytics" }
    ]
  },
  {
    id: "teams",
    icon: FaUsers,
    subPages: [
      { id: "teams-members" },
      { id: "teams-roles" }
    ]
  },
  {
    id: "playground",
    icon: FaRobot,
    subPages: [
      { id: "playground-analyzer" },
      { id: "playground-text" },
      { id: "playground-design" },
      { id: "playground-data" }
    ]
  },
  {
    id: "integrations",
    icon: FaPuzzlePiece,
    subPages: [
      { id: "integrations-apps" },
      { id: "integrations-installed" }
    ]
  },
  {
    id: "subscription",
    icon: FaCreditCard,
    subPages: [
      { id: "subscription-plan" },
      { id: "subscription-billing" },
      { id: "subscription-upgrade" },
      { id: "subscription-invoices" }
    ]
  },
  {
    id: "settings",
    icon: FaCog,
    subPages: [
      { id: "settings-profile" },
      { id: "settings-language" },
      { id: "settings-security" },
      { id: "settings-theme" }
    ]
  },
  {
    id: "help",
    icon: FaLifeRing,
    subPages: [
      { id: "help-docs" },
      { id: "help-tutorials" },
      { id: "help-chat" },
      { id: "help-contact" }
    ]
  },
  {
    id: "account",
    icon: FaUserCircle,
    subPages: [
      { id: "account-switch" },
      { id: "account-logout" }
    ]
  },
];