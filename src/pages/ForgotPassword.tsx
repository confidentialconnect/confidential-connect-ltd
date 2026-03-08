import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        document.title = "Reset Password | Confidential Connect Ltd";
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "Error",
                description: "Please enter your email address.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } else {
            setEmailSent(true);
            toast({
                title: "Reset Link Sent",
                description: "Check your email for the password reset link.",
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
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            {emailSent ? (
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            ) : (
                                <Mail className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <CardTitle>
                            {emailSent ? "Check Your Email" : "Forgot Password?"}
                        </CardTitle>
                        <CardDescription>
                            {emailSent
                                ? "We've sent a secure password reset link to your email. The link expires in 15 minutes."
                                : "Enter your registered email address and we'll send you a secure reset link."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {emailSent ? (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setEmailSent(false)}
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email">Email Address</Label>
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
