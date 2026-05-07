import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Wallet, MessageCircle, Tag } from "lucide-react";

interface Settings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  whatsappLink: string;
  pricingPlans: string;
}

const DEFAULTS: Settings = {
  businessName: "Confidential Connect Ltd",
  businessEmail: "support@confidentialconnect.ltd",
  businessPhone: "+234 704 029 4858",
  bankName: "Moniepoint MFB",
  accountName: "Confidential Connect Ltd",
  accountNumber: "",
  whatsappLink: "https://wa.me/2347040294858",
  pricingPlans: "Starter — ₦5,000\nGrowth — ₦15,000\nPremium — ₦35,000",
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [stored, setStored] = useLocalStorage<Settings>("cc_admin_settings", DEFAULTS);
  const [form, setForm] = useState<Settings>(stored);

  useEffect(() => {
    document.title = "Settings | Admin Dashboard";
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    setStored(form);
    toast({ title: "Settings saved", description: "Your changes have been applied locally." });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />Business Details</CardTitle>
          <CardDescription>Basic information shown across the app</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Business Name</Label><Input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={form.businessEmail} onChange={(e) => update("businessEmail", e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={form.businessPhone} onChange={(e) => update("businessPhone", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Payment Account</CardTitle>
          <CardDescription>Bank details for manual transfers</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => update("bankName", e.target.value)} /></div>
          <div><Label>Account Name</Label><Input value={form.accountName} onChange={(e) => update("accountName", e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Account Number</Label><Input value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" />WhatsApp Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>WhatsApp Link</Label>
          <Input value={form.whatsappLink} onChange={(e) => update("whatsappLink", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary" />Pricing Plans</CardTitle>
          <CardDescription>One plan per line</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea rows={6} value={form.pricingPlans} onChange={(e) => update("pricingPlans", e.target.value)} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} size="lg" className="bg-gradient-to-r from-primary to-purple-700">Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;