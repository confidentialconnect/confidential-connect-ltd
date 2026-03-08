import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Lock } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [checking, setChecking] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Set New Password | Confidential Connect Ltd";
    }, []);

    useEffect(() => {
        /**
         * Check if we have a recovery session.
         * Supabase redirects back with a hash fragment containing
         * type=recovery. The onAuthStateChange listener picks it up.
         */
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setIsValidSession(true);
                    setChecking(false);
                }
            }
        );

        // Also check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsValidSession(true);
            }
            setChecking(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long.",
                variant: "destructive"
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Password Updated!",
                description: "Your password has been reset successfully.",
            });
            navigate('/auth', { replace: true });
        }

        setIsLoading(false);
    };

    if (checking) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Verifying reset link...</p>
            </section>
        );
    }

    if (!isValidSession) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Invalid or Expired Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired. Please request a new one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link to="/forgot-password">
                            <Button className="w-full">Request New Reset Link</Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Confidential Connect Ltd
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Set New Password</CardTitle>
                        <CardDescription>
                            Choose a strong password for your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-new-password"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-start gap-2 rounded-md bg-muted p-3">
                                <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground">
                                    Your password is securely encrypted. We never store
                                    passwords in plain text.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ResetPassword;
