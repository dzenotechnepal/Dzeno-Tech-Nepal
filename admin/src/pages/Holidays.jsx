import React, { useEffect, useState } from 'react';
import { CalendarDays, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', date: '', type: 'company', description: '', isActive: true };

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      const response = await api.get('/holidays', { params: { year, search: search || undefined, isActive: activeFilter || undefined } });
      setHolidays(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadHolidays, 250);
    return () => clearTimeout(timer);
  }, [year, search, activeFilter]);

  const updateForm = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const openCreate = () => { setEditingId(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (holiday) => { setEditingId(holiday._id); setForm({ name: holiday.name || '', date: holiday.date ? new Date(holiday.date).toISOString().slice(0, 10) : '', type: holiday.type || 'company', description: holiday.description || '', isActive: holiday.isActive !== false }); setIsModalOpen(true); };

  const saveHoliday = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingId) await api.put(`/holidays/${editingId}`, form);
      else await api.post('/holidays', form);
      toast.success(editingId ? 'Holiday updated' : 'Holiday created');
      setIsModalOpen(false);
      await loadHolidays();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save holiday');
    } finally {
      setSaving(false);
    }
  };

  const removeHoliday = async (holiday) => {
    if (!window.confirm(`Delete ${holiday.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/holidays/${holiday._id}`);
      toast.success('Holiday deleted');
      await loadHolidays();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete holiday');
    }
  };

  return (
    <div>
      <div className="page-heading"><div><h1>Holidays</h1><p className="text-secondary">Manage company holidays and office closures.</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Holiday</button></div>
      <div className="card customer-filters"><div className="customer-search"><Search size={16} className="customer-search-icon" /><input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search holiday name" /></div><input className="input holiday-year-filter" type="number" value={year} onChange={(event) => setYear(event.target.value)} min="2000" /><select className="select customer-status-filter" value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select></div>
      <div className="card">{loading ? <div className="empty-state">Loading holidays...</div> : holidays.length === 0 ? <div className="empty-state"><CalendarDays size={36} className="text-secondary" /><h3>No holidays found</h3><p className="text-secondary">Add a holiday to start building the company calendar.</p></div> : <div className="table-container"><table className="table"><thead><tr><th>Date</th><th>Holiday</th><th>Type</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead><tbody>{holidays.map(holiday => <tr key={holiday._id}><td>{new Date(holiday.date).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}</td><td className="font-medium">{holiday.name}</td><td style={{ textTransform: 'capitalize' }}>{holiday.type}</td><td>{holiday.description || '—'}</td><td><Badge type={holiday.isActive ? 'green' : 'gray'}>{holiday.isActive ? 'Active' : 'Inactive'}</Badge></td><td><div className="flex gap-2"><button className="btn btn-outline text-xs" onClick={() => openEdit(holiday)}><Pencil size={13} /> Edit</button><button className="btn btn-outline text-xs" onClick={() => removeHoliday(holiday)} aria-label={`Delete ${holiday.name}`}><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div>}</div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Holiday' : 'Add Holiday'}><form className="flex flex-col gap-4" onSubmit={saveHoliday}><div className="form-group"><label className="form-label">Holiday Name *</label><input className="input" name="name" value={form.name} onChange={updateForm} required /></div><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Date *</label><input className="input" type="date" name="date" value={form.date} onChange={updateForm} required /></div><div className="form-group"><label className="form-label">Type</label><select className="select" name="type" value={form.type} onChange={updateForm}><option value="public">Public</option><option value="company">Company</option><option value="optional">Optional</option></select></div></div><div className="form-group"><label className="form-label">Description</label><textarea className="input" name="description" value={form.description} onChange={updateForm} rows="3" /></div><label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={form.isActive} onChange={updateForm} /><span className="form-label" style={{ margin: 0 }}>Active holiday</span></label><button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Holiday' : 'Save Holiday'}</button></form></Modal>
    </div>
  );
};

export default Holidays;
