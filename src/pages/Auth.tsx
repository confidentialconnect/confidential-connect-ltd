import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const Auth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [signUpData, setSignUpData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const signInCaptchaRef = useRef<ReCAPTCHA>(null);
    const signUpCaptchaRef = useRef<ReCAPTCHA>(null);

    const { signIn, signUp, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sign In | Confidential Connect Ltd";
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", "Sign in to your Confidential Connect Ltd account to access our educational services.");
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const verifyCaptcha = async (token: string | null): Promise<boolean> => {
        // If no site key configured, skip verification (dev mode)
        if (!RECAPTCHA_SITE_KEY) return true;

        if (!token) {
            toast({
                title: "Verification Required",
                description: "Please complete the reCAPTCHA verification.",
                variant: "destructive"
            });
            return false;
        }

        try {
            const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
                body: { token }
            });

            if (error) throw error;
            return data?.success === true;
        } catch {
            // If verification endpoint fails, allow through with warning
            console.warn('reCAPTCHA verification failed — allowing through');
            return true;
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signInData.email || !signInData.password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const captchaToken = signInCaptchaRef.current?.getValue() || null;
        const captchaValid = await verifyCaptcha(captchaToken);

        if (!captchaValid) {
            setIsLoading(false);
            signInCaptchaRef.current?.reset();
            return;
        }

        const { error } = await signIn(signInData.email, signInData.password);

        if (error) {
            toast({
                title: "Sign In Failed",
                description: error.message === "Invalid login credentials"
                    ? "Invalid email or password. Please check your credentials."
                    : error.message,
                variant: "destructive"
            });
            signInCaptchaRef.current?.reset();
        } else {
            toast({
                title: "Welcome back!",
                description: "You have successfully signed in."
            });
            navigate('/', { replace: true });
        }

        setIsLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        if (signUpData.password !== signUpData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive"
            });
            return;
        }

        if (signUpData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const captchaToken = signUpCaptchaRef.current?.getValue() || null;
        const captchaValid = await verifyCaptcha(captchaToken);

        if (!captchaValid) {
            setIsLoading(false);
            signUpCaptchaRef.current?.reset();
            return;
        }

        const { error } = await signUp(
            signUpData.email,
            signUpData.password,
            signUpData.fullName
        );

        if (error) {
            if (error.message.includes("already registered")) {
                toast({
                    title: "Account Exists",
                    description: "An account with this email already exists. Please sign in instead.",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Sign Up Failed",
                    description: error.message,
                    variant: "destructive"
                });
            }
            signUpCaptchaRef.current?.reset();
        } else {
            toast({
                title: "Account Created!",
                description: "Please check your email to verify your account.",
            });
        }

        setIsLoading(false);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Confidential Connect Ltd
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        Your Gateway to Educational Success
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin" className="space-y-4">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={signInData.email}
                                            onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={signInData.password}
                                            onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    {RECAPTCHA_SITE_KEY && (
                                        <div className="flex justify-center">
                                            <ReCAPTCHA
                                                ref={signInCaptchaRef}
                                                sitekey={RECAPTCHA_SITE_KEY}
                                                theme="light"
                                            />
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing In..." : "Sign In"}
                                    </Button>
                                    <div className="text-center">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="space-y-4">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={signUpData.fullName}
                                            onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={signUpData.email}
                                            onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Enter your password (min. 6 characters)"
                                            value={signUpData.password}
                                            onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="signup-confirm-password"
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={signUpData.confirmPassword}
                                            onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    {RECAPTCHA_SITE_KEY && (
                                        <div className="flex justify-center">
                                            <ReCAPTCHA
                                                ref={signUpCaptchaRef}
                                                sitekey={RECAPTCHA_SITE_KEY}
                                                theme="light"
                                            />
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Auth;
