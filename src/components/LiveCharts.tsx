import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}

interface StatusBreakdown {
  name: string;
  value: number;
  color: string;
}

export const LiveCharts = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [dailyData, setDailyData] = useState<DailyStats[]>([]);
  const [statusData, setStatusData] = useState<StatusBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

      if (error) throw error;

      // Calculate overall stats
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount / 100), 0) || 0;
      const pendingOrders = orders?.filter(o => o.payment_status === 'pending').length || 0;
      const completedOrders = orders?.filter(o => o.payment_status === 'completed').length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders
      });

      // Calculate daily data for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const dayOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate <= dayEnd;
        }) || [];

        return {
          date: format(date, 'MMM dd'),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount / 100), 0)
        };
      });

      setDailyData(last7Days);

      // Calculate status breakdown
      const statusBreakdown = [
        { name: 'Completed', value: completedOrders, color: '#22c55e' },
        { name: 'Pending', value: pendingOrders, color: '#eab308' },
        { name: 'Failed', value: orders?.filter(o => o.payment_status === 'failed').length || 0, color: '#ef4444' },
      ].filter(item => item.value > 0);

      setStatusData(statusBreakdown);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscription for live updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          console.log('Orders updated, refreshing charts...');
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-xs text-green-600">
              📈 Live Updates
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              💰 Live Updates
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <div className="flex items-center text-xs text-yellow-600">
              ⏳ Needs Action
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            <div className="flex items-center text-xs text-green-600">
              ✅ Successful
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      {statusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};