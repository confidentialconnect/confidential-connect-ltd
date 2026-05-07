import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LiveCharts } from "@/components/LiveCharts";

const AdminAnalytics = () => {
  useEffect(() => {
    document.title = "Analytics | Admin Dashboard";
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 via-card to-purple-500/5">
        <CardHeader>
          <CardTitle className="text-2xl">Business Analytics</CardTitle>
          <CardDescription>Live revenue, orders, and promotion insights</CardDescription>
        </CardHeader>
        <CardContent>
          <LiveCharts />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;