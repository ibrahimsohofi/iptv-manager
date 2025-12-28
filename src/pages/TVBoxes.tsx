import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Box, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function TVBoxes() {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    model: '',
    serial_number: '',
    mac_address: '',
    status: 'active',
  });

  useEffect(() => {
    loadBoxes();
    loadCustomers();
  }, []);

  const loadBoxes = async () => {
    try {
      const data = await api.boxes.getAll();
      setBoxes(data);
    } catch (error) {
      console.error('Error loading boxes:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.boxes.create(formData);
      setFormData({ customer_id: '', model: '', serial_number: '', mac_address: '', status: 'active' });
      setIsOpen(false);
      loadBoxes();
    } catch (error) {
      console.error('Error creating box:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this TV box?')) {
      try {
        await api.boxes.delete(id);
        loadBoxes();
      } catch (error) {
        console.error('Error deleting box:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'replaced':
        return 'bg-yellow-100 text-yellow-700';
      case 'returned':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">TV Boxes</h2>
          <p className="text-slate-600 mt-1">Manage TV box inventory</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add TV Box
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New TV Box</DialogTitle>
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
                <label className="text-sm font-medium text-slate-700">Model *</label>
                <Input
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="X96 Max, T95, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Serial Number</label>
                <Input
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="SN123456789"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">MAC Address</label>
                <Input
                  value={formData.mac_address}
                  onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                  placeholder="00:1A:2B:3C:4D:5E"
                />
              </div>
              <Button type="submit" className="w-full">Create TV Box</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <Card key={box.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <Box className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{box.model}</h3>
                  <Badge className={getStatusColor(box.status)}>{box.status}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(box.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Customer:</span>
                <span className="font-medium text-slate-900">{box.customer_name}</span>
              </div>
              {box.serial_number && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Serial:</span>
                  <span className="font-mono text-slate-900 text-xs">{box.serial_number}</span>
                </div>
              )}
              {box.mac_address && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">MAC:</span>
                  <span className="font-mono text-slate-900 text-xs">{box.mac_address}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 mt-4">
              Added {new Date(box.created_at).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {boxes.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No TV boxes yet. Add your first box to get started!</p>
        </Card>
      )}
    </div>
  );
}
