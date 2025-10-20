import React from 'react';
import { DashboardIcon, ReportsIcon, IntegrationsIcon, SettingsIcon, LogoutIcon } from './icons';
import { Page, User } from '../types';

interface SidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout, currentUser }) => {
    return (
        <div className="w-64 bg-white dark:bg-auditor-dark border-r border-gray-200 dark:border-auditor-border flex flex-col p-4">
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="bg-auditor-primary p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-auditor-text-primary">Site Auditor</h1>
            </div>

            <nav className="flex-1 flex flex-col space-y-2">
                <NavItem icon={<DashboardIcon className="h-5 w-5" />} label="Dashboard" active={activePage === 'Dashboard'} onClick={() => onNavigate('Dashboard')} />
                <NavItem icon={<ReportsIcon className="h-5 w-5" />} label="Reports" active={activePage === 'Reports'} onClick={() => onNavigate('Reports')} />
                <NavItem icon={<IntegrationsIcon className="h-5 w-5" />} label="Integrations" active={activePage === 'Integrations'} onClick={() => onNavigate('Integrations')} />
                <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" active={activePage === 'Settings'} onClick={() => onNavigate('Settings')} />
            </nav>

            <div className="mt-auto mb-2">
                 <div className="flex items-center space-x-3 p-2">
                    <img src="https://picsum.photos/id/237/200/200" alt="User Avatar" className="h-10 w-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-auditor-text-primary truncate">{currentUser?.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-auditor-text-secondary truncate">{currentUser?.email}</p>
                    </div>
                    <button onClick={onLogout} className="ml-auto text-gray-500 dark:text-auditor-text-secondary hover:text-gray-900 dark:hover:text-auditor-text-primary" aria-label="Logout">
                        <LogoutIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
    const baseClasses = 'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 w-full text-left cursor-pointer';
    const activeClasses = 'bg-auditor-primary/20 text-auditor-primary font-semibold';
    const inactiveClasses = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-auditor-text-secondary dark:hover:bg-auditor-card dark:hover:text-auditor-text-primary';

    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {icon}
            <span>{label}</span>
        </button>
    );
};


export default Sidebar;