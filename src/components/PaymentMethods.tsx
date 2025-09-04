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

const paymentMethods: PaymentMethod[] = [
  {
    id: 'remita-card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with Visa, Mastercard, or Verve',
    icon: CreditCard,
    type: 'card',
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'remita-bank',
    name: 'Bank Transfer',
    description: 'Direct bank transfer via Remita',
    icon: Building2,
    type: 'bank',
    fees: '₦50',
    processingTime: '5-10 minutes'
  },
  {
    id: 'opay',
    name: 'OPay',
    description: 'Pay with your OPay wallet',
    icon: Smartphone,
    type: 'mobile',
    details: {
      phoneNumber: '09876543210',
      accountName: 'OKPO CONFIDENCE STORE'
    },
    fees: 'Free',
    processingTime: 'Instant'
  },
  {
    id: 'palmpay',
    name: 'PalmPay',
    description: 'Pay with your PalmPay wallet',
    icon: Smartphone,
    type: 'mobile',
    details: {
      phoneNumber: '09876543210',
      accountName: 'OKPO CONFIDENCE STORE'
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

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
        <p className="text-muted-foreground">
          Total Amount: <span className="font-semibold text-primary">₦{(orderAmount / 100).toLocaleString()}</span>
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => {
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
                            handleCopy(method.details.phoneNumber!, 'Phone Number');
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
                            handleCopy(method.details.accountName!, 'Account Name');
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
                            handleCopy(method.details.accountNumber!, 'Account Number');
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
                  </div>
                </CardContent>
              )}

              {isSelected && method.id === 'remita-card' && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-3 text-center">
                    <div className="flex justify-center gap-2">
                      <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
                      <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
                      <img src="/api/placeholder/40/25" alt="Verve" className="h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure payment powered by Remita
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span>Opens in secure payment window</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};