import { useState, useEffect } from "react";
import { Loader2, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentProcessingProps {
  orderData: any;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const PaymentProcessing = ({ orderData, onSuccess, onError }: PaymentProcessingProps) => {
  const [status, setStatus] = useState<'processing' | 'verifying' | 'success' | 'failed'>('processing');
  const [countdown, setCountdown] = useState(30);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    initiateRemitaPayment();
  }, []);

  useEffect(() => {
    if (status === 'verifying' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'verifying' && countdown === 0) {
      verifyPayment();
    }
  }, [status, countdown]);

  const initiateRemitaPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-remita-payment', {
        body: {
          paymentReference: orderData.payment_reference,
          amount: orderData.total_amount,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          customerPhone: orderData.customer_phone,
          description: `Order payment for ${orderData.payment_reference}`
        }
      });

      if (error) throw error;

      if (data.success) {
        setPaymentUrl(data.paymentUrl);
        // Open payment page in new window
        const paymentWindow = window.open(data.paymentUrl, '_blank', 'width=800,height=600');
        
        // Start verification process
        setTimeout(() => {
          setStatus('verifying');
          if (paymentWindow) paymentWindow.close();
        }, 3000);
      } else {
        throw new Error(data.error || 'Payment initiation failed');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setStatus('failed');
      onError(error.message);
    }
  };

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-remita-payment', {
        body: {
          paymentReference: orderData.payment_reference
        }
      });

      if (error) throw error;

      if (data.success) {
        if (data.status === 'completed') {
          setStatus('success');
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          });
          onSuccess();
        } else if (data.status === 'failed') {
          setStatus('failed');
          onError('Payment verification failed');
        } else {
          // Still pending, continue checking
          setCountdown(30);
        }
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      onError(error.message);
    }
  };

  const reopenPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'width=800,height=600');
      setStatus('verifying');
      setCountdown(30);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="h-6 w-6" />
          Payment Processing
        </CardTitle>
        <CardDescription>
          Order: {orderData.payment_reference}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {status === 'processing' && (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-semibold">Redirecting to Payment Gateway</h3>
              <p className="text-sm text-muted-foreground">
                Please complete your payment in the new window
              </p>
            </div>
            <Badge variant="secondary">Processing...</Badge>
          </div>
        )}

        {status === 'verifying' && (
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{countdown}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Verifying Payment</h3>
              <p className="text-sm text-muted-foreground">
                We're confirming your payment status...
              </p>
            </div>
            <Badge variant="secondary">Verifying...</Badge>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                If the payment window closed, you can reopen it below.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={reopenPayment}
              variant="outline"
              size="sm"
            >
              Reopen Payment Window
            </Button>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <div>
              <h3 className="font-semibold text-green-700">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your order has been confirmed
              </p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700">Payment Failed</h3>
              <p className="text-sm text-muted-foreground">
                Please try again or contact support
              </p>
            </div>
            <Badge variant="destructive">Failed</Badge>
            
            <Button 
              onClick={() => {
                setStatus('processing');
                setCountdown(30);
                initiateRemitaPayment();
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Amount: ₦{(orderData.total_amount / 100).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};