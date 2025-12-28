import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Phone, MapPin, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customers.create(formData);
      setFormData({ name: '', phone: '', city: '', notes: '' });
      setIsOpen(false);
      loadCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.customers.delete(id);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Customers</h2>
          <p className="text-slate-600 mt-1">Manage your customer database</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Phone *</label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 XX XX XX XX"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Casablanca, Rabat..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Café, home, reseller..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Create Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{customer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                {customer.city && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    {customer.city}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(customer.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {customer.notes && (
              <p className="text-sm text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg">
                {customer.notes}
              </p>
            )}
            <div className="text-xs text-slate-400 mt-3">
              Added {new Date(customer.created_at).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No customers yet. Add your first customer to get started!</p>
        </Card>
      )}
    </div>
  );
}
