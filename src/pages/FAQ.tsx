import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HelpCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqCategories = [
    {
        title: "General Questions",
        items: [
            {
                question: "What is Confidential Connect LTD?",
                answer: "Confidential Connect LTD (RC 9081270) is a CAC-registered company operating in partnership with All Campus Connect TV. We provide professional documentation, school registration, result verification, and digital services to individuals and institutions across Nigeria.",
            },
            {
                question: "Where is your office located?",
                answer: "Our office is located on Airport Road, close to the University of Abuja, Abuja, Nigeria. You can also reach us through our website, WhatsApp, or by calling our support lines.",
            },
            {
                question: "What are your operating hours?",
                answer: "Our team is available Monday to Saturday, 8:00 AM to 6:00 PM. However, our WhatsApp support is available 24/7 for urgent inquiries.",
            },
        ],
    },
    {
        title: "Services & Processing",
        items: [
            {
                question: "What services do you offer?",
                answer: "We offer a wide range of services including: WAEC/NECO/NABTEB result checking, birth certificate processing, state of origin certificates, school registration assistance, Post UTME registration, professional CV preparation, graphic design, and various digital services.",
            },
            {
                question: "How long does it take to process a service request?",
                answer: "Processing times vary by service. Result checking is usually instant, while document processing (birth certificates, state of origin) may take 5–14 working days depending on the issuing authority. We always provide an estimated timeline when you place your order.",
            },
            {
                question: "Can I track the status of my request?",
                answer: "Yes. Once you create an account and submit a service request, you can track its progress from your dashboard. You'll see statuses such as Pending, In Progress, and Completed. You'll also receive updates via email.",
            },
            {
                question: "What documents do I need to provide?",
                answer: "The required documents depend on the service. For result checking, you'll typically need your examination number and year. For certificates, you may need a passport photograph, valid ID, and other supporting documents. Our team will guide you through the exact requirements.",
            },
        ],
    },
    {
        title: "Pricing & Payments",
        items: [
            {
                question: "How much do your services cost?",
                answer: "Our prices vary by service. For example, WAEC Scratch Cards cost ₦4,200, NECO Tokens cost ₦1,600, Birth Certificates cost ₦5,000, and State of Origin Certificates cost ₦12,000. Visit our Pricing page for a complete list of services and prices.",
            },
            {
                question: "What payment methods do you accept?",
                answer: "We accept bank transfers and online payments through Paystack (card payments). Payment details are provided on our Payments page. All transactions are secure and you'll receive a confirmation receipt.",
            },
            {
                question: "Is there a refund policy?",
                answer: "Refunds are handled on a case-by-case basis. If a service cannot be fulfilled due to reasons within our control, we will issue a full refund. Once processing has commenced, refunds may not be available. Please contact our support team for any refund inquiries.",
            },
        ],
    },
    {
        title: "Account & Security",
        items: [
            {
                question: "How do I create an account?",
                answer: "Click the 'Sign In' button on the top right of the website, then select 'Create Account.' You'll need to provide your full name, email address, and create a secure password. A verification email will be sent to confirm your account.",
            },
            {
                question: "I forgot my password. How do I reset it?",
                answer: "On the Sign In page, click 'Forgot Password' and enter your registered email address. You'll receive a secure password reset link via email. Follow the link to set a new password.",
            },
            {
                question: "Is my personal information safe?",
                answer: "Absolutely. We use industry-standard security measures including encrypted data transmission (SSL/TLS), secure authentication with password hashing, and Google reCAPTCHA protection on all forms. Your personal data is never shared with third parties without your consent.",
            },
        ],
    },
];

const FAQ = () => {
    usePageSEO({
        title: 'FAQ',
        description: 'Find answers to frequently asked questions about document processing, school registration, result checking, and our services at CONFIDENTIAL CONNECT LTD.',
        keywords: 'FAQ confidential connect, document processing questions, WAEC result checker help, service questions Nigeria',
        canonical: 'https://confidential-connect-ltd.lovable.app/faq',
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <ScrollToTop />

            {/* Hero */}
            <section className="bg-primary/5 border-b border-border py-16 mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <HelpCircle className="h-4 w-4" />
                        Frequently Asked Questions
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        How Can We Help You?
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about our services, pricing, and processes. 
                        Can't find what you're looking for? Contact our support team.
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="space-y-10">
                        {faqCategories.map((category, catIdx) => (
                            <div key={catIdx}>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    {category.title}
                                </h2>
                                <Accordion type="single" collapsible className="space-y-2">
                                    {category.items.map((item, itemIdx) => (
                                        <AccordionItem
                                            key={itemIdx}
                                            value={`${catIdx}-${itemIdx}`}
                                            className="bg-card border border-border rounded-lg px-5"
                                        >
                                            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center bg-primary/5 border border-primary/10 rounded-2xl p-10">
                        <h3 className="text-xl font-bold text-foreground mb-3">
                            Still Have Questions?
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Our support team is ready to help. Reach out to us via WhatsApp, phone, or email.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button asChild>
                                <Link to="/contact">Contact Us</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <a
                                    href="https://wa.me/2347040294858"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Chat on WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <GoogleInspiredFooter />
            <WhatsAppButton />
        </div>
    );
};

export default FAQ;
