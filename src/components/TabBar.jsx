import { NavLink } from 'react-router-dom';
import { Camera, Images, Map, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Kamera', icon: Camera, end: true },
  { to: '/gallery', label: 'Galerie', icon: Images },
  { to: '/map', label: 'Karte', icon: Map },
  { to: '/settings', label: 'Mehr', icon: Settings },
];

export function TabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800
                 bg-slate-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium transition-colors ${
                isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
