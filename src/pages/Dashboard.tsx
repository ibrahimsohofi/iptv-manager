import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Box, CreditCard, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBoxes: 0,
    activeSubscriptions: 0,
    expiringSubscriptions: 0,
  });
  const [expiring, setExpiring] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customers, boxes, active, exp] = await Promise.all([
        api.customers.getAll(),
        api.boxes.getAll(),
        api.subscriptions.getActive(),
        api.subscriptions.getExpiring(),
      ]);

      setStats({
        totalCustomers: customers.length,
        totalBoxes: boxes.length,
        activeSubscriptions: active.length,
        expiringSubscriptions: exp.length,
      });
      setExpiring(exp);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'TV Boxes',
      value: stats.totalBoxes,
      icon: Box,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSubscriptions,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">Overview of your IPTV business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Expiring Subscriptions */}
      {expiring.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-slate-900">
              Expiring Subscriptions (Next 7 Days)
            </h3>
          </div>
          <div className="space-y-3">
            {expiring.map((sub: any) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p className="font-medium text-slate-900">{sub.customer_name}</p>
                  <p className="text-sm text-slate-600">{sub.customer_phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">
                    Expires: {new Date(sub.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600">{sub.plan_duration} months plan</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/customers"
            className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
          >
            <h4 className="font-medium text-slate-900">Add New Customer</h4>
            <p className="text-sm text-slate-600 mt-1">Register a new customer</p>
          </a>
          <a
            href="/boxes"
            className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
          >
            <h4 className="font-medium text-slate-900">Register TV Box</h4>
            <p className="text-sm text-slate-600 mt-1">Add a new TV box</p>
          </a>
          <a
            href="/subscriptions"
            className="p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
          >
            <h4 className="font-medium text-slate-900">Create Subscription</h4>
            <p className="text-sm text-slate-600 mt-1">Activate IPTV service</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
