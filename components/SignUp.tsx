import React, { useState, useMemo, useEffect, useRef } from 'react';

interface SignUpProps {
    onLoginSuccess: (user: { email: string; fullName: string; }) => void;
    onSwitchToLogin: () => void;
}

// Add a global declaration for the google object from the GSI client script
declare global {
  interface Window {
    google: any;
  }
}

const SignUp: React.FC<SignUpProps> = ({ onLoginSuccess, onSwitchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const passwordValidation = useMemo(() => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
        };
    }, [password]);

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    const passwordsMatch = password === confirmPassword && password !== '';

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !isPasswordValid || !passwordsMatch || !fullName) return;
        
        setIsLoading(true);
        // Simulate API call for registration
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess({ email, fullName }); // Log user in immediately after successful sign-up
        }, 1000);
    };
    
    useEffect(() => {
        if (window.google && googleButtonRef.current) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            
            window.google.accounts.id.initialize({
                client_id: '826553413421-r56gj6et4tcn1gkm0un2dhlicrdcs1pb.apps.googleusercontent.com',
                callback: (response: any) => {
                    console.log("Google Sign-Up successful");
                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        onLoginSuccess({ email: 'shaunwg@outlook.com', fullName: 'Shaun Wg' });
                    }, 500);
                }
            });

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { 
                    theme: isDarkMode ? "filled_black" : "outline", 
                    size: "large",
                    type: "standard",
                    shape: "rectangular",
                    text: "signup_with",
                    logo_alignment: "left",
                } 
            );
        }
    }, [onLoginSuccess]);


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
                    <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-auditor-text-primary mb-1">Create an Account</h2>
                    <p className="text-sm text-center text-gray-500 dark:text-auditor-text-secondary mb-6">Start your website audit journey</p>
                    
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-auditor-dark border border-gray-300 dark:border-auditor-border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary"
                            />
                        </div>
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
                            <label htmlFor="password"className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
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

                        <div>
                            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-500 dark:text-auditor-text-secondary mb-2">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-gray-50 dark:bg-auditor-dark border rounded-md px-3 py-2 text-gray-900 dark:text-auditor-text-primary focus:outline-none focus:ring-2 focus:ring-auditor-primary ${confirmPassword.length > 0 && !passwordsMatch ? 'border-severity-high' : 'border-gray-300 dark:border-auditor-border'}`}
                            />
                            {confirmPassword.length > 0 && !passwordsMatch && <p className="text-xs text-severity-high mt-1">Passwords do not match.</p>}
                        </div>

                        <button type="submit" disabled={isLoading || !isPasswordValid || !passwordsMatch || !email || !fullName} className="w-full flex justify-center bg-auditor-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
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

                    <div className="w-full flex justify-center">
                       {isLoading ? (
                           <span className="text-sm text-gray-500 dark:text-auditor-text-secondary">Please wait...</span>
                       ) : (
                           <div ref={googleButtonRef}></div>
                       )}
                    </div>

                </div>

                <p className="text-center text-sm text-gray-500 dark:text-auditor-text-secondary mt-6">
                    Already have an account? <button onClick={onSwitchToLogin} className="font-medium text-auditor-primary hover:underline">Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;