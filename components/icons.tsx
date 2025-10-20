import React from 'react';
import { 
    MdDashboard, 
    MdArticle, 
    MdIntegrationInstructions, 
    MdSettings, 
    MdLogout, 
    MdHelpOutline, 
    MdAdd, 
    MdLock,
    MdCheck,
    MdFileDownload,
    MdClose,
    MdArrowUpward,
    MdArrowDownward,
    MdAddCircle,
    MdCheckCircle,
    MdSave,
    MdListAlt,
    MdCode,
    MdContentCopy,
    MdError
} from 'react-icons/md';
import { FaGithub, FaSlack, FaJira } from 'react-icons/fa';
import { SiVercel } from 'react-icons/si';


interface IconProps {
  className?: string;
}

export const DashboardIcon: React.FC<IconProps> = (props) => <MdDashboard {...props} />;
export const ReportsIcon: React.FC<IconProps> = (props) => <MdArticle {...props} />;
export const IntegrationsIcon: React.FC<IconProps> = (props) => <MdIntegrationInstructions {...props} />;
export const SettingsIcon: React.FC<IconProps> = (props) => <MdSettings {...props} />;
export const LogoutIcon: React.FC<IconProps> = (props) => <MdLogout {...props} />;
export const HelpIcon: React.FC<IconProps> = (props) => <MdHelpOutline {...props} />;
export const PlusIcon: React.FC<IconProps> = (props) => <MdAdd {...props} />;
export const LockIcon: React.FC<IconProps> = (props) => <MdLock {...props} />;
export const GitHubIcon: React.FC<IconProps> = (props) => <FaGithub {...props} />;
export const SlackIcon: React.FC<IconProps> = (props) => <FaSlack {...props} />;
export const JiraIcon: React.FC<IconProps> = (props) => <FaJira {...props} />;
export const VercelIcon: React.FC<IconProps> = (props) => <SiVercel {...props} />;
export const CheckIcon: React.FC<IconProps> = (props) => <MdCheck {...props} />;
export const ExportIcon: React.FC<IconProps> = (props) => <MdFileDownload {...props} />;
export const CloseIcon: React.FC<IconProps> = (props) => <MdClose {...props} />;
export const ArrowUpIcon: React.FC<IconProps> = (props) => <MdArrowUpward {...props} />;
export const ArrowDownIcon: React.FC<IconProps> = (props) => <MdArrowDownward {...props} />;
export const PlusCircleIcon: React.FC<IconProps> = (props) => <MdAddCircle {...props} />;
export const CheckCircleIcon: React.FC<IconProps> = (props) => <MdCheckCircle {...props} />;
export const SaveIcon: React.FC<IconProps> = (props) => <MdSave {...props} />;
export const ActionPlanIcon: React.FC<IconProps> = (props) => <MdListAlt {...props} />;
export const SnippetsIcon: React.FC<IconProps> = (props) => <MdCode {...props} />;
export const CopyIcon: React.FC<IconProps> = (props) => <MdContentCopy {...props} />;
export const ErrorIcon: React.FC<IconProps> = (props) => <MdError {...props} />;

// Kept brand icons as custom SVGs for specific styling needs
export const GeminiIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 17.5a2.5 2.5 0 0 1-2.42-3.35l.84-2.29-1.28-1.28-2.29.84a2.5 2.5 0 1 1-1.2-4.22l5.17-1.9a.5.5 0 0 1 .6.6l-1.9 5.17a2.5 2.5 0 0 1-1.78 2.43Zm-7-10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.5 2a3.5 3.5 0 1 1-2.47 5.97l-1.9.71a.5.5 0 0 0-.28.84l2.12 2.13a.5.5 0 0 0 .84-.28l.71-1.9A3.5 3.5 0 0 1 16.5 2Zm-2 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
    </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" className={className}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.61-3.328-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,36.21,44,30.551,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);