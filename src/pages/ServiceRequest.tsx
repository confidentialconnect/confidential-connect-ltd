import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReCAPTCHA from 'react-google-recaptcha';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const RECAPTCHA_SITE_KEY = '6LfI5K0sAAAAAO0PAp9Gk2Ku10gGRqOIkI7Z0_ct';

const SERVICE_TYPES = [
    { value: 'birth_certificate', label: 'Birth Certificate', price: '₦5,000' },
    { value: 'state_of_origin', label: 'State of Origin Certificate', price: '₦12,000' },
    { value: 'waec_certificate', label: 'WAEC Certificate', price: '₦12,000' },
    { value: 'waec_scratch_card', label: 'WAEC Scratch Card', price: '₦4,200' },
    { value: 'neco_token', label: 'NECO Token', price: '₦1,600' },
    { value: 'nabteb_scratch_card', label: 'NABTEB Scratch Card', price: '₦1,600' },
    { value: 'nabteb_token', label: 'NABTEB Token', price: '₦1,600' },
    { value: 'result_checker', label: 'Result Checker', price: '₦500' },
    { value: 'gce_result_checker', label: 'G.C.E. Result Checker', price: '₦500' },
    { value: 'post_utme', label: 'Post UTME Registration', price: '₦6,000' },
    { value: 'hostel_booking', label: 'Hostel Booking', price: '₦20,000' },
    { value: 'cv_preparation', label: 'Professional CV Preparation', price: 'Contact Us' },
    { value: 'document_processing', label: 'Document Processing', price: 'Contact Us' },
    { value: 'other', label: 'Other Service', price: 'Contact Us' },
];

const ServiceRequest = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const captchaRef = useRef<ReCAPTCHA>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        service_type: '',
        client_name: profile?.full_name || '',
        client_email: profile?.email || user?.email || '',
        client_phone: profile?.phone || '',
        description: '',
    });

    if (!user) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh] pt-20">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="text-center">
                            <CardTitle>Sign In Required</CardTitle>
                            <CardDescription>
                                Please sign in to submit a service request
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <a href="/auth">Sign In</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'Maximum file size is 10MB',
                    variant: 'destructive',
                });
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.service_type || !formData.client_name || !formData.client_email || !formData.client_phone) {
            toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        try {
            let documentUrl: string | null = null;

            // Upload document if provided
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const filePath = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('service-documents')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;
                documentUrl = filePath;
            }

            // Insert service request
            const { error } = await supabase
                .from('service_requests')
                .insert({
                    user_id: user.id,
                    service_type: formData.service_type,
                    client_name: formData.client_name,
                    client_email: formData.client_email,
                    client_phone: formData.client_phone,
                    description: formData.description || null,
                    document_url: documentUrl,
                    status: 'pending',
                });

            if (error) throw error;

            // Create notification for the user
            await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Service Request Submitted',
                message: `Your request for "${SERVICE_TYPES.find(s => s.value === formData.service_type)?.label}" has been submitted successfully. We will process it shortly.`,
                type: 'success',
                link: '/dashboard',
            });

            toast({
                title: 'Request Submitted!',
                description: 'Your service request has been submitted. You can track it in your dashboard.',
            });

            navigate('/dashboard');
        } catch (error: any) {
            console.error('Service request error:', error);
            toast({
                title: 'Submission Failed',
                description: error.message || 'Failed to submit request. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            captchaRef.current?.reset();
        }
    };

    const selectedService = SERVICE_TYPES.find(s => s.value === formData.service_type);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Request a Service
                        </h1>
                        <p className="text-muted-foreground">
                            Fill out the form below to submit your service request. Our team will process it promptly.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Service Request Form
                            </CardTitle>
                            <CardDescription>
                                All fields marked with * are required
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="service_type">Service Type *</Label>
                                    <Select
                                        value={formData.service_type}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SERVICE_TYPES.map((service) => (
                                                <SelectItem key={service.value} value={service.value}>
                                                    {service.label} — {service.price}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedService && (
                                        <p className="text-sm text-primary font-medium">
                                            Price: {selectedService.price}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="client_name">Full Name *</Label>
                                        <Input
                                            id="client_name"
                                            value={formData.client_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="client_phone">Phone Number *</Label>
                                        <Input
                                            id="client_phone"
                                            value={formData.client_phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                                            placeholder="e.g. 08012345678"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="client_email">Email Address *</Label>
                                    <Input
                                        id="client_email"
                                        type="email"
                                        value={formData.client_email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Additional Details</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Provide any additional information about your request..."
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Supporting Document (Optional)</Label>
                                    <div
                                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {selectedFile ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                                <span className="text-sm font-medium">{selectedFile.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">
                                                    Click to upload a document (PDF, JPG, PNG — max 10MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {RECAPTCHA_SITE_KEY && (
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            ref={captchaRef}
                                            sitekey={RECAPTCHA_SITE_KEY}
                                            theme="light"
                                        />
                                    </div>
                                )}

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit Service Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ServiceRequest;
