import { FaUserTie, FaEnvelope, FaBuilding, FaBook } from "react-icons/fa";

export const tableColumns = [
  {
    id: 'name',
    title: 'Name',
    icon: <FaUserTie className="mr-2 text-blue-400" />,
    iconColor: 'text-blue-400',
    hoverColor: 'hover:text-blue-400'
  },
  {
    id: 'email',
    title: 'Email',
    icon: <FaEnvelope className="mr-2 text-purple-400" />,
    iconColor: 'text-purple-400',
    hoverColor: 'hover:text-purple-400'
  },
  {
    id: 'role',
    title: 'Role',
    icon: <FaUserTie className="mr-2 text-indigo-400" />,
    iconColor: 'text-indigo-400',
    hoverColor: 'hover:text-indigo-400',
    badgeClasses: 'bg-indigo-900/30 text-indigo-300 border-indigo-800/30'
  },
  {
    id: 'department',
    title: 'Department',
    icon: <FaBuilding className="mr-2 text-green-400" />,
    iconColor: 'text-green-400',
    hoverColor: 'hover:text-green-400',
    badgeClasses: 'bg-green-900/30 text-green-300 border-green-800/30'
  },
  {
    id: 'courses',
    title: 'Courses',
    icon: <FaBook className="mr-2 text-yellow-400" />,
    iconColor: 'text-yellow-400',
    hoverColor: 'hover:text-yellow-400',
    badgeClasses: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/30'
  }
]; 