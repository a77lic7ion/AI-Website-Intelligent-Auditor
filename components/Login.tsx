import React, { useState, useMemo } from 'react';
import { GoogleIcon } from './icons';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const passwordValidation = useMemo(() => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
        };
    }, [password]);

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !isPasswordValid) return;
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);
    };
    
    const handleGoogleLogin = () => {
        setIsLoading(true);
         // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);
    }

    const ValidationCheck: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
        <div className={`flex items-center text-xs ${isValid ? 'text-auditor-secondary' : 'text-auditor-text-secondary'}`}>
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d={isValid ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"} clipRule="evenodd"></path>
            </svg>
            {text}
        </div>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-auditor-dark p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center items-center space-x-3 mb-6">
                    <div className="bg-auditor-primary p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-auditor-text-primary">Site Auditor</h1>
                </div>
                
                <div className="bg-white dark:bg-auditor-card border border-gray-200 dark:border-auditor-border rounded-lg shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-auditor-text-primary mb-1">Welcome Back</h2>
                    <p className="text-sm text-center text-gray-500 dark:text-auditor-text-secondary mb-6">Sign in to continue</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password"className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary">Password</label>
                                <a href="#" className="text-sm font-medium text-auditor-primary hover:underline">Forgot?</a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                            />
                        </div>

                        {password.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                <ValidationCheck isValid={passwordValidation.length} text="8+ characters" />
                                <ValidationCheck isValid={passwordValidation.uppercase} text="1 uppercase" />
                                <ValidationCheck isValid={passwordValidation.number} text="1 number" />
                                <ValidationCheck isValid={passwordValidation.symbol} text="1 symbol" />
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full flex justify-center bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-auditor-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-auditor-card text-gray-500 dark:text-auditor-text-secondary">OR</span>
                        </div>
                    </div>

                    <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-auditor-card hover:bg-gray-100 dark:hover:bg-auditor-dark text-gray-900 dark:text-auditor-text-primary font-semibold px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-auditor-border disabled:opacity-50 disabled:cursor-not-allowed">
                        <GoogleIcon className="h-5 w-5" />
                        <span>Sign in with Google</span>
                    </button>

                </div>

                <p className="text-center text-sm text-gray-500 dark:text-auditor-text-secondary mt-6">
                    Don't have an account? <a href="#" className="font-medium text-auditor-primary hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
