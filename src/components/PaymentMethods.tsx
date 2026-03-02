import { useState } from "react";
import { CreditCard, Smartphone, Building2, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  type: 'card' | 'bank' | 'mobile';
  details?: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    phoneNumber?: string;
  };
  fees?: string;
  processingTime?: string;
}

// Online payment gateways
const onlinePaymentMethods: PaymentMethod[] = [
  {
    id: 'paystack',
    name: 'Pay with Paystack',
    description: 'Pay securely with Visa, Mastercard, Verve, or Bank Transfer via Paystack',
    icon: CreditCard,
    type: 'card',
    fees: 'Free',
    processingTime: 'Instant'
  }
];

// Normal payment methods (direct transfers)
const normalPaymentMethods: PaymentMethod[] = [
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Transfer to First Bank of Nigeria',
    icon: Building2,
    type: 'bank',
    details: {
      accountNumber: '3191660932',
      accountName: 'Okpo Confidence',
      bankName: 'First Bank of Nigeria'
    },
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'opay',
    name: 'OPay Transfer',
    description: 'Send money via OPay',
    icon: Smartphone,
    type: 'mobile',
    details: {
      phoneNumber: '6113224110',
      accountName: 'Okpo Confidence'
    },
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'palmpay',
    name: 'PalmPay Transfer',
    description: 'Send money via PalmPay',
    icon: Smartphone,
    type: 'mobile',
    details: {
      phoneNumber: '07040294858',
      accountName: 'Okpo Confidence'
    },
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'moniepoint',
    name: 'Moniepoint Transfer',
    description: 'Transfer to Moniepoint account',
    icon: Building2,
    type: 'bank',
    details: {
      accountNumber: '6919053477',
      accountName: 'Confidential Connect Ltd',
      bankName: 'Moniepoint'
    },
    fees: 'Free',
    processingTime: 'Instant'
  }
];

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  orderAmount: number;
}

export const PaymentMethods = ({ selectedMethod, onMethodSelect, orderAmount }: PaymentMethodsProps) => {
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

  const getMethodBadgeColor = (type: string) => {
    switch (type) {
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'bank': return 'bg-green-100 text-green-800';
      case 'mobile': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPaymentCard = (method: PaymentMethod) => {
    const Icon = method.icon;
    const isSelected = selectedMethod === method.id;
    
    return (
      <Card 
        key={method.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
        onClick={() => onMethodSelect(method.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-lg">{method.name}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge className={getMethodBadgeColor(method.type)}>
                {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
              </Badge>
              {method.fees && (
                <p className="text-xs text-muted-foreground">Fee: {method.fees}</p>
              )}
            </div>
          </div>
        </CardHeader>

        {isSelected && method.details && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Payment Details:</h4>
              
              {method.details.phoneNumber && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-lg font-mono">{method.details.phoneNumber}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(method.details!.phoneNumber!, 'Phone Number');
                    }}
                  >
                    {copiedField === 'Phone Number' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {method.details.accountName && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Account Name</p>
                    <p className="font-medium">{method.details.accountName}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(method.details!.accountName!, 'Account Name');
                    }}
                  >
                    {copiedField === 'Account Name' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {method.details.accountNumber && (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Account Number</p>
                    <p className="text-lg font-mono">{method.details.accountNumber}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(method.details!.accountNumber!, 'Account Number');
                    }}
                  >
                    {copiedField === 'Account Number' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {method.details.bankName && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Bank</p>
                  <p className="font-medium">{method.details.bankName}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Time:</span>
                <Badge variant="outline">{method.processingTime}</Badge>
              </div>
              
              {(method.type === 'bank' || method.type === 'mobile') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <p className="text-sm font-medium text-yellow-800 mb-2">📲 Important:</p>
                  <p className="text-xs text-yellow-700">
                    After payment, send your receipt to WhatsApp: +2347040294858 for instant confirmation.
                  </p>
                  <div className="mt-3">
                    <Button size="sm" className="w-full" asChild>
                      <a 
                        href={`https://wa.me/2347040294858?text=${encodeURIComponent('Hello, I have made a payment. Amount: ₦' + (orderAmount / 100).toLocaleString() + '. Please confirm my receipt.')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Send receipt on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

      {isSelected && method.id === 'paystack' && (
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <div className="space-y-3 text-center">
              <div className="flex justify-center gap-2">
                <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">VISA</div>
                <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">MC</div>
                <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">VERVE</div>
                <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded">BANK</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure payment powered by Paystack
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                <span>Opens secure inline payment popup</span>
              </div>
            </div>
          </CardContent>
        )}

      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
        <p className="text-muted-foreground">
          Total Amount: <span className="font-semibold text-primary">₦{(orderAmount / 100).toLocaleString()}</span>
        </p>
      </div>

      {/* Online Payment Gateways */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Online Payment Gateways</h3>
            <p className="text-xs text-muted-foreground">Pay with cards or bank transfer via secure gateways</p>
          </div>
        </div>
        <div className="grid gap-3">
          {onlinePaymentMethods.map(renderPaymentCard)}
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Normal Payment Options Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Direct Transfer Options</h3>
            <p className="text-xs text-muted-foreground">Bank transfer & mobile money payments</p>
          </div>
        </div>
        <div className="grid gap-3">
          {normalPaymentMethods.map(renderPaymentCard)}
        </div>
      </div>
    </div>
  );
};