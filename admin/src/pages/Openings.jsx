import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, Pencil, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { role: '', type: 'Full-time', level: '', description: '', sortOrder: 0, isActive: true };

const Openings = () => {
  const [openings, setOpenings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadOpenings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/openings');
      setOpenings(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load openings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOpenings(); }, []);

  const updateForm = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const openCreate = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (opening) => { setEditingId(opening._id); setForm({ ...emptyForm, ...opening }); setModalOpen(true); };

  const saveOpening = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, sortOrder: Number(form.sortOrder || 0), isActive: Boolean(form.isActive) };
      if (editingId) await api.put(`/openings/${editingId}`, payload);
      else await api.post('/openings', payload);
      toast.success(editingId ? 'Opening updated' : 'Opening published');
      setModalOpen(false);
      await loadOpenings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save opening');
    } finally {
      setSaving(false);
    }
  };

  const removeOpening = async (opening) => {
    if (!window.confirm(`Delete ${opening.role}?`)) return;
    try {
      await api.delete(`/openings/${opening._id}`);
      toast.success('Opening deleted');
      await loadOpenings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete opening');
    }
  };

  return (
    <div>
      <div className="page-heading"><div><h1>Open Positions</h1><p className="text-secondary">Manage the roles displayed on the public careers page.</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Position</button></div>
      <div className="card">{loading ? <div className="empty-state">Loading positions...</div> : openings.length === 0 ? <div className="empty-state"><BriefcaseBusiness size={36} className="text-secondary" /><h3>No positions configured</h3><p className="text-secondary">Add a position to publish it on the careers page.</p></div> : <div className="table-container"><table className="table"><thead><tr><th>Role</th><th>Type</th><th>Level</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{openings.map(opening => <tr key={opening._id}><td className="font-medium">{opening.role}<small className="text-secondary" style={{ display: 'block' }}>{opening.description || ''}</small></td><td>{opening.type}</td><td>{opening.level}</td><td>{opening.sortOrder}</td><td><Badge type={opening.isActive ? 'green' : 'gray'}>{opening.isActive ? 'Published' : 'Hidden'}</Badge></td><td><div className="flex gap-2"><button className="btn btn-outline text-xs" onClick={() => openEdit(opening)}><Pencil size={13} /> Edit</button><button className="btn btn-outline text-xs" onClick={() => removeOpening(opening)} aria-label={`Delete ${opening.role}`}><Trash2 size={13} /></button></div></td></tr>)}</tbody></table></div>}</div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Position' : 'Add Position'}><form className="flex flex-col gap-4" onSubmit={saveOpening}><div className="form-group"><label className="form-label">Role *</label><input className="input" name="role" value={form.role} onChange={updateForm} required /></div><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Type *</label><input className="input" name="type" value={form.type} onChange={updateForm} required placeholder="Full-time · Kathmandu / Hybrid" /></div><div className="form-group"><label className="form-label">Level *</label><input className="input" name="level" value={form.level} onChange={updateForm} required placeholder="Junior–Mid" /></div></div><div className="form-group"><label className="form-label">Description</label><textarea className="input" name="description" value={form.description} onChange={updateForm} rows="3" /></div><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Display Order</label><input className="input" type="number" name="sortOrder" value={form.sortOrder} onChange={updateForm} min="0" /></div><label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={form.isActive} onChange={(event) => setForm(previous => ({ ...previous, isActive: event.target.checked }))} /> Published on careers page</label></div><button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Position' : 'Publish Position'}</button></form></Modal>
    </div>
  );
};

export default Openings;
