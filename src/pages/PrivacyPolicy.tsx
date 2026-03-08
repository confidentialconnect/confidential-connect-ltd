import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Shield, Lock, Eye, Database, Mail, Globe } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <ScrollToTop />

            {/* Hero */}
            <section className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                            Privacy Policy
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
                            <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong> (RC 9081270), operating in partnership with <strong className="text-foreground">All Campus Connect TV</strong>, is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.
                        </p>
                    </div>

                    <PolicySection
                        icon={<Database className="h-5 w-5 text-primary" />}
                        title="1. Information We Collect"
                        content={[
                            "We may collect the following types of information:",
                        ]}
                        list={[
                            "Personal identification details such as your full name, email address, and phone number provided during registration or service requests.",
                            "Payment information necessary to process transactions, including bank transfer references and payment confirmations.",
                            "Technical data such as your IP address, browser type, device information, and pages visited, collected automatically through cookies and similar technologies.",
                            "Service-related information including documents submitted for processing, examination details, and school registration data.",
                        ]}
                    />

                    <PolicySection
                        icon={<Eye className="h-5 w-5 text-primary" />}
                        title="2. How We Use Your Information"
                        content={["We use your information for the following purposes:"]}
                        list={[
                            "To provide, operate, and maintain our services including document processing, result verification, school registration, and digital services.",
                            "To process payments and send transaction confirmations.",
                            "To communicate with you regarding service updates, order status, and customer support.",
                            "To improve our website, services, and user experience.",
                            "To comply with legal obligations and protect against fraudulent activity.",
                        ]}
                    />

                    <PolicySection
                        icon={<Lock className="h-5 w-5 text-primary" />}
                        title="3. Data Protection & Security"
                        content={[
                            "We implement industry-standard security measures to protect your personal information, including:",
                        ]}
                        list={[
                            "Encrypted data transmission using SSL/TLS protocols.",
                            "Secure authentication systems with password hashing.",
                            "Google reCAPTCHA protection on all forms to prevent unauthorized access.",
                            "Restricted access to personal data, limited to authorized personnel only.",
                        ]}
                    />

                    <PolicySection
                        icon={<Globe className="h-5 w-5 text-primary" />}
                        title="4. Cookies & Tracking"
                        content={[
                            "Our website uses cookies and similar technologies to enhance your browsing experience. Cookies help us understand how you interact with our site, remember your preferences, and improve performance. You may disable cookies in your browser settings, though this may affect certain features of the website.",
                        ]}
                    />

                    <PolicySection
                        title="5. Third-Party Sharing"
                        content={[
                            "We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers solely for the purpose of delivering our services, such as payment processors and communication platforms. All third parties are required to maintain the confidentiality of your information.",
                        ]}
                    />

                    <PolicySection
                        title="6. Data Retention"
                        content={[
                            "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Once data is no longer required, it will be securely deleted or anonymized.",
                        ]}
                    />

                    <PolicySection
                        title="7. Your Rights"
                        content={["As a user, you have the right to:"]}
                        list={[
                            "Access the personal data we hold about you.",
                            "Request correction of inaccurate or incomplete information.",
                            "Request deletion of your personal data, subject to legal requirements.",
                            "Withdraw consent for data processing at any time.",
                        ]}
                    />

                    <PolicySection
                        icon={<Mail className="h-5 w-5 text-primary" />}
                        title="8. Contact Us"
                        content={[
                            "If you have any questions or concerns about this Privacy Policy, please contact us:",
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

const PolicySection = ({
    icon,
    title,
    content,
    list,
}: {
    icon?: React.ReactNode;
    title: string;
    content: string[];
    list?: string[];
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
    </div>
);

export default PrivacyPolicy;
