import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Copy, MessageCircle, Trash2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isIPTVOpen, setIsIPTVOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    customer_id: '',
    box_id: '',
    plan_duration: '1',
    start_date: new Date().toISOString().split('T')[0],
    price: '',
  });

  const [iptvFormData, setIPTVFormData] = useState({
    subscription_id: '',
    server_url: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    loadSubscriptions();
    loadCustomers();
    loadBoxes();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await api.subscriptions.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadBoxes = async () => {
    try {
      const data = await api.boxes.getAll();
      setBoxes(data);
    } catch (error) {
      console.error('Error loading boxes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.subscriptions.create(formData);
      setFormData({
        customer_id: '',
        box_id: '',
        plan_duration: '1',
        start_date: new Date().toISOString().split('T')[0],
        price: '',
      });
      setIsOpen(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleIPTVSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.iptv.create(iptvFormData);
      setIPTVFormData({ subscription_id: '', server_url: '', username: '', password: '' });
      setIsIPTVOpen(false);
      alert('IPTV credentials saved successfully!');
    } catch (error) {
      console.error('Error saving IPTV credentials:', error);
    }
  };

  const openIPTVForm = (subscription: any) => {
    setIPTVFormData({ ...iptvFormData, subscription_id: subscription.id.toString() });
    setSelectedSub(subscription);
    setIsIPTVOpen(true);
  };

  const copyCredentials = async (subscriptionId: number) => {
    try {
      const account = await api.iptv.getBySubscription(subscriptionId);
      const text = `Server: ${account.server_url}\nUsername: ${account.username}\nPassword: ${account.password}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(subscriptionId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert('No IPTV credentials found. Please add them first.');
    }
  };

  const sendWhatsApp = async (subscriptionId: number) => {
    try {
      const data = await api.iptv.getWhatsAppMessage(subscriptionId);
      const whatsappURL = `https://wa.me/${data.phone.replace(/\s/g, '')}?text=${encodeURIComponent(data.message)}`;
      window.open(whatsappURL, '_blank');
    } catch (error) {
      alert('No IPTV credentials found. Please add them first.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      try {
        await api.subscriptions.delete(id);
        loadSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const getStatusColor = (status: string, endDate: string) => {
    const isExpired = new Date(endDate) < new Date();
    if (isExpired) return 'bg-red-100 text-red-700';
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-slate-100 text-slate-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Subscriptions</h2>
          <p className="text-slate-600 mt-1">Manage IPTV subscriptions and credentials</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Customer *</label>
                <Select
                  required
                  value={formData.customer_id}
                  onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">TV Box (optional)</label>
                <Select
                  value={formData.box_id}
                  onValueChange={(value) => setFormData({ ...formData, box_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select box" />
                  </SelectTrigger>
                  <SelectContent>
                    {boxes.map((box) => (
                      <SelectItem key={box.id} value={box.id.toString()}>
                        {box.model} - {box.customer_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Plan Duration *</label>
                <Select
                  required
                  value={formData.plan_duration}
                  onValueChange={(value) => setFormData({ ...formData, plan_duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Start Date *</label>
                <Input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Price (MAD)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="200"
                />
              </div>
              <Button type="submit" className="w-full">Create Subscription</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* IPTV Credentials Dialog */}
      <Dialog open={isIPTVOpen} onOpenChange={setIsIPTVOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add IPTV Credentials</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-900">{selectedSub.customer_name}</p>
              <p className="text-xs text-slate-600">{selectedSub.plan_duration} months plan</p>
            </div>
          )}
          <form onSubmit={handleIPTVSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Server URL *</label>
              <Input
                required
                value={iptvFormData.server_url}
                onChange={(e) => setIPTVFormData({ ...iptvFormData, server_url: e.target.value })}
                placeholder="http://example.com:8080"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Username *</label>
              <Input
                required
                value={iptvFormData.username}
                onChange={(e) => setIPTVFormData({ ...iptvFormData, username: e.target.value })}
                placeholder="user12345"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password *</label>
              <Input
                required
                value={iptvFormData.password}
                onChange={(e) => setIPTVFormData({ ...iptvFormData, password: e.target.value })}
                placeholder="pass12345"
              />
            </div>
            <Button type="submit" className="w-full">Save IPTV Credentials</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 gap-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-slate-900 text-lg">{sub.customer_name}</h3>
                  <Badge className={getStatusColor(sub.status, sub.end_date)}>
                    {new Date(sub.end_date) < new Date() ? 'Expired' : sub.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Phone:</span>
                    <p className="font-medium text-slate-900">{sub.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Plan:</span>
                    <p className="font-medium text-slate-900">{sub.plan_duration} months</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Start:</span>
                    <p className="font-medium text-slate-900">{new Date(sub.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Expires:</span>
                    <p className="font-medium text-slate-900">{new Date(sub.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openIPTVForm(sub)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Credentials
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyCredentials(sub.id)}
                  className="relative"
                >
                  {copiedId === sub.id ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => sendWhatsApp(sub.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(sub.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No subscriptions yet. Create your first subscription to get started!</p>
        </Card>
      )}
    </div>
  );
}
