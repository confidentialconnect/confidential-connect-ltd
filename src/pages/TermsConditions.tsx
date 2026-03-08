import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FileText, AlertTriangle, CreditCard, Scale, ShieldCheck } from "lucide-react";

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <ScrollToTop />

            {/* Hero */}
            <section className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                            Terms & Conditions
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-10">

                    <div className="space-y-3">
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to the official website of <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong> (RC 9081270), operating in partnership with <strong className="text-foreground">All Campus Connect TV</strong>. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
                        </p>
                    </div>

                    <TermsSection
                        icon={<Scale className="h-5 w-5 text-primary" />}
                        title="1. Acceptance of Terms"
                        content={[
                            "By using this website, creating an account, or placing a service order, you acknowledge that you have read, understood, and agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of our services immediately.",
                        ]}
                    />

                    <TermsSection
                        title="2. Services Provided"
                        content={[
                            "CONFIDENTIAL CONNECT LTD provides the following professional services through this platform:",
                        ]}
                        list={[
                            "Document Processing — preparation, formatting, and printing of official and academic documents.",
                            "Result Checking & Verification — WAEC, NECO, NABTEB, and JAMB result checking services.",
                            "School Registration & Applications — assistance with school admissions, course registrations, and related academic services.",
                            "Digital Services — graphic design, online form processing, data entry, and other digital solutions.",
                        ]}
                        afterContent="All services are subject to availability and may be modified or discontinued at our discretion with reasonable notice."
                    />

                    <TermsSection
                        title="3. User Accounts"
                        content={["When creating an account on our platform, you agree to:"]}
                        list={[
                            "Provide accurate, current, and complete information during registration.",
                            "Maintain the security of your account credentials and not share your password with others.",
                            "Accept responsibility for all activities that occur under your account.",
                            "Notify us immediately of any unauthorized use of your account.",
                        ]}
                        afterContent="We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity."
                    />

                    <TermsSection
                        icon={<CreditCard className="h-5 w-5 text-primary" />}
                        title="4. Payments & Pricing"
                        content={["The following payment terms apply to all transactions:"]}
                        list={[
                            "All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable fees unless otherwise stated.",
                            "Payment must be completed before service delivery. We accept bank transfers, Paystack online payments, and other methods as displayed on our platform.",
                            "Service fees are non-refundable once processing has commenced, except where explicitly stated or required by law.",
                            "We reserve the right to modify pricing at any time. Changes will not affect orders already confirmed and paid for.",
                        ]}
                    />

                    <TermsSection
                        title="5. Service Delivery"
                        content={[
                            "We strive to deliver all services within the estimated timeframes communicated at the time of order. However, delivery times may vary depending on the complexity of the request and external factors beyond our control, such as examination body processing times or institutional delays.",
                            "In the event of significant delays, we will notify you promptly and provide updated timelines.",
                        ]}
                    />

                    <TermsSection
                        icon={<AlertTriangle className="h-5 w-5 text-primary" />}
                        title="6. Limitation of Liability"
                        content={[
                            "CONFIDENTIAL CONNECT LTD shall not be held liable for:",
                        ]}
                        list={[
                            "Any indirect, incidental, or consequential damages arising from the use of our services.",
                            "Delays or failures caused by third-party services, including examination bodies, educational institutions, or payment processors.",
                            "Loss of data resulting from circumstances beyond our reasonable control.",
                            "Errors in documents caused by inaccurate information provided by the client.",
                        ]}
                        afterContent="Our total liability for any claim shall not exceed the amount paid by you for the specific service in question."
                    />

                    <TermsSection
                        title="7. Intellectual Property"
                        content={[
                            "All content on this website, including text, graphics, logos, images, and software, is the property of CONFIDENTIAL CONNECT LTD and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.",
                        ]}
                    />

                    <TermsSection
                        title="8. Prohibited Activities"
                        content={["You agree not to:"]}
                        list={[
                            "Use our services for any unlawful purpose or in violation of any applicable laws.",
                            "Attempt to gain unauthorized access to our systems, accounts, or data.",
                            "Submit false, misleading, or fraudulent information.",
                            "Interfere with or disrupt the operation of our website or services.",
                        ]}
                    />

                    <TermsSection
                        icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                        title="9. Governing Law"
                        content={[
                            "These Terms and Conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from the use of our services shall be resolved through amicable negotiation. If a resolution cannot be reached, the matter shall be submitted to the jurisdiction of the courts in Abuja, Nigeria.",
                        ]}
                    />

                    <TermsSection
                        title="10. Changes to Terms"
                        content={[
                            "We reserve the right to update or modify these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes are published constitutes acceptance of the revised terms.",
                        ]}
                    />

                    <TermsSection
                        title="11. Contact Us"
                        content={[
                            "For questions or concerns regarding these Terms and Conditions, please contact us:",
                        ]}
                        list={[
                            "Email: confidentialconnectltd@gmail.com",
                            "Phone: +234 704 029 4858 / +234 911 715 0406",
                            "Address: Airport Road, close to University of Abuja, Abuja, Nigeria",
                        ]}
                    />

                </div>
            </section>

            <GoogleInspiredFooter />
        </div>
    );
};

const TermsSection = ({
    icon,
    title,
    content,
    list,
    afterContent,
}: {
    icon?: React.ReactNode;
    title: string;
    content: string[];
    list?: string[];
    afterContent?: string;
}) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        {content.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
        ))}
        {list && (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                {list.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                ))}
            </ul>
        )}
        {afterContent && (
            <p className="text-muted-foreground leading-relaxed">{afterContent}</p>
        )}
    </div>
);

export default TermsConditions;
