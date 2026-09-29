import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', company: '', email: '', phone: '', address: '', status: 'active', notes: '' };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers', { params: { search: search || undefined, status: status || undefined } });
      setCustomers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadCustomers, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || '', company: customer.company || '', email: customer.email || '',
      phone: customer.phone || '', address: customer.address || '', status: customer.status || 'active', notes: customer.notes || '',
    });
    setIsModalOpen(true);
  };

  const updateForm = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));

  const saveCustomer = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingId) await api.put(`/customers/${editingId}`, form);
      else await api.post('/customers', form);
      toast.success(editingId ? 'Customer updated' : 'Customer created');
      setIsModalOpen(false);
      await loadCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const removeCustomer = async (customer) => {
    if (!window.confirm(`Delete ${customer.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/customers/${customer._id}`);
      toast.success('Customer deleted');
      await loadCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div><h1>Customers</h1><p className="text-secondary">Manage customer contacts and relationships.</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Customer</button>
      </div>

      <div className="card customer-filters">
        <div className="customer-search"><Search size={16} className="customer-search-icon" /><input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, email or phone" /></div>
        <select className="select customer-status-filter" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>

      <div className="card">
        {loading ? <div className="empty-state">Loading customers...</div> : customers.length === 0 ? <div className="empty-state"><Users size={36} className="text-secondary" /><h3>No customers found</h3><p className="text-secondary">Add your first customer to start managing relationships.</p></div> : <div className="table-container"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Contact</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead><tbody>{customers.map(customer => <tr key={customer._id}><td className="font-medium">{customer.name}</td><td>{customer.company || '—'}</td><td><div>{customer.email || '—'}</div><small className="text-secondary">{customer.phone || ''}</small></td><td><Badge type={customer.status === 'active' ? 'green' : 'gray'}>{customer.status}</Badge></td><td>{customer.notes || '—'}</td><td><div className="flex gap-2"><button className="btn btn-outline text-xs" onClick={() => openEdit(customer)}><Pencil size={13} /> Edit</button><button className="btn btn-outline text-xs" onClick={() => removeCustomer(customer)} aria-label={`Delete ${customer.name}`}><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Customer' : 'Add Customer'}>
        <form className="flex flex-col gap-4" onSubmit={saveCustomer}>
          <div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Name *</label><input className="input" name="name" value={form.name} onChange={updateForm} required /></div><div className="form-group"><label className="form-label">Company</label><input className="input" name="company" value={form.company} onChange={updateForm} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Email</label><input className="input" type="email" name="email" value={form.email} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Phone</label><input className="input" name="phone" value={form.phone} onChange={updateForm} /></div></div>
          <div className="form-group"><label className="form-label">Address</label><input className="input" name="address" value={form.address} onChange={updateForm} /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="select" name="status" value={form.status} onChange={updateForm}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="input" name="notes" value={form.notes} onChange={updateForm} rows="3" /></div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Customer' : 'Save Customer'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
