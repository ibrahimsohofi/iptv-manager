const API_URL = '/api';

export const api = {
  // Customers
  customers: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/customers`);
      return res.json();
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_URL}/customers/${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: number, data: any) => {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
  },

  // TV Boxes
  boxes: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/boxes`);
      return res.json();
    },
    getByCustomer: async (customerId: number) => {
      const res = await fetch(`${API_URL}/boxes/customer/${customerId}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/boxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: number, data: any) => {
      const res = await fetch(`${API_URL}/boxes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_URL}/boxes/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
  },

  // Subscriptions
  subscriptions: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/subscriptions`);
      return res.json();
    },
    getActive: async () => {
      const res = await fetch(`${API_URL}/subscriptions/active`);
      return res.json();
    },
    getExpiring: async () => {
      const res = await fetch(`${API_URL}/subscriptions/expiring`);
      return res.json();
    },
    getByCustomer: async (customerId: number) => {
      const res = await fetch(`${API_URL}/subscriptions/customer/${customerId}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    updateStatus: async (id: number, status: string) => {
      const res = await fetch(`${API_URL}/subscriptions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
  },

  // IPTV Accounts
  iptv: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/iptv`);
      return res.json();
    },
    getBySubscription: async (subscriptionId: number) => {
      const res = await fetch(`${API_URL}/iptv/subscription/${subscriptionId}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${API_URL}/iptv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: number, data: any) => {
      const res = await fetch(`${API_URL}/iptv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_URL}/iptv/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
    getWhatsAppMessage: async (subscriptionId: number) => {
      const res = await fetch(`${API_URL}/iptv/whatsapp/${subscriptionId}`);
      return res.json();
    },
  },
};
