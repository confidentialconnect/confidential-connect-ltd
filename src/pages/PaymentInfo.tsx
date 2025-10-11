import { useEffect } from "react";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, CreditCard, Building2, ExternalLink, Shield, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PaymentInfo = () => {
  const [copiedField, setCopiedField] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Payment Methods | Confidential Connect";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Secure payment options for Confidential Connect. Pay via bank transfer or OPay for your orders and services.");
    }
  }, []);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  const bankDetails = {
    accountNumber: '3191660932',
    accountName: 'Okpo Confidence Oko',
    bankName: 'First Bank of Nigeria',
    opayNumber: '6113224110',
    opayName: 'Okpo Confidence Oko'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Payment Methods
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred payment method. We support secure bank transfers and mobile payments for your convenience.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Bank Transfer */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-10 w-10 text-primary" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1">Bank Transfer</h2>
                    <p className="text-muted-foreground">Direct bank transfer</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Recommended
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Bank Name</p>
                    <p className="text-lg font-semibold">{bankDetails.bankName}</p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Number</p>
                      <p className="text-lg font-mono font-semibold">{bankDetails.accountNumber}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(bankDetails.accountNumber, 'Account Number')}
                    >
                      {copiedField === 'Account Number' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Name</p>
                      <p className="text-lg font-semibold">{bankDetails.accountName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(bankDetails.accountName, 'Account Name')}
                    >
                      {copiedField === 'Account Name' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OPay Transfer */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent dark:border-purple-900/30 dark:from-purple-950/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1">OPay Transfer</h2>
                    <p className="text-muted-foreground">Quick mobile payment</p>
                  </div>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
                    Mobile
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">OPay Number</p>
                      <p className="text-lg font-mono font-semibold">{bankDetails.opayNumber}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(bankDetails.opayNumber, 'OPay Number')}
                    >
                      {copiedField === 'OPay Number' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Name</p>
                      <p className="text-lg font-semibold">{bankDetails.opayName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(bankDetails.opayName, 'OPay Name')}
                    >
                      {copiedField === 'OPay Name' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                    <p className="text-xs text-purple-700 dark:text-purple-400 flex items-start gap-2">
                      <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>Ensure the account name matches exactly before completing your transfer</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                How to Pay
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Transfer Funds</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer the exact amount to our bank account or OPay number
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Receipt</h3>
                    <p className="text-sm text-muted-foreground">
                      Save or screenshot your payment receipt from your bank app
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Send Receipt</h3>
                    <p className="text-sm text-muted-foreground">
                      Send your receipt to us on WhatsApp for instant confirmation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Confirmation */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <ExternalLink className="h-6 w-6 text-yellow-700 dark:text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                  📲 Payment Confirmation Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-500 mb-4">
                  After making payment, you MUST send your receipt to WhatsApp for instant confirmation and order processing. Include your order number if you have one.
                </p>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700" 
                  asChild
                >
                  <a 
                    href="https://wa.me/2347040294858?text=Hello%2C%20I%20have%20made%20a%20payment.%20Please%20confirm%20my%20receipt." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Send Receipt on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Card className="mb-8 border-blue-200 dark:border-blue-900/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Important Payment Information
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Verify Account Name:</strong> Always confirm the account name matches "Okpo Confidence Oko" exactly before transferring to avoid sending money to the wrong account.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Keep Your Receipt:</strong> Save or screenshot your payment confirmation. You'll need to send this to us via WhatsApp.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Include Order Details:</strong> When sending your receipt, include your order number (if you have one) and the items you purchased.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Processing Time:</strong> Orders are typically confirmed within 5-30 minutes after we receive your payment receipt on WhatsApp.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Business Hours:</strong> While payments can be made 24/7, confirmations are fastest during business hours (9AM - 6PM WAT, Monday - Saturday).</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Security:</strong> We will never ask for your bank PIN, password, or OTP. Only share your payment receipt.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  All transactions are secure and verified
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Orders confirmed within minutes of payment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  WhatsApp support available anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <GoogleInspiredFooter />
    </div>
  );
};

export default PaymentInfo;