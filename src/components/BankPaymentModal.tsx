import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, CreditCard, Building2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BankPaymentModalProps {
  children: React.ReactNode;
}

export const BankPaymentModal = ({ children }: BankPaymentModalProps) => {
  const [copiedField, setCopiedField] = useState<string>('');
  const { toast } = useToast();

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
    accountName: 'Okpo Confidence',
    bankName: 'First Bank of Nigeria',
    opayNumber: '6113224110'
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-primary" />
            Payment Methods
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Bank Transfer */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Bank Transfer</h3>
                  <p className="text-muted-foreground">Transfer directly to our bank account</p>
                </div>
                <Badge className="ml-auto bg-green-100 text-green-800">Recommended</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                    <p className="text-lg font-semibold">{bankDetails.bankName}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Account Name</p>
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

          {/* OPay Option */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">OPay Transfer</h3>
                  <p className="text-muted-foreground">Quick mobile payment option</p>
                </div>
                <Badge variant="outline" className="ml-auto border-purple-200 text-purple-700">Mobile</Badge>
              </div>
              
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">OPay Number</p>
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
            </CardContent>
          </Card>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800 mb-2">📲 Important:</p>
            <p className="text-sm text-yellow-700 mb-3">
              After making payment, send your receipt to WhatsApp for instant confirmation.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700" 
              asChild
            >
              <a 
                href="https://wa.me/2347040294858?text=Hello%2C%20I%20have%20made%20a%20payment.%20Please%20confirm%20my%20receipt." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Send Receipt on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};