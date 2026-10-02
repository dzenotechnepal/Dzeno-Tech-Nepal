import React, { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const defaults = {
  companyName: '', companyEmail: '', companyPhone: '', companyAddress: 'Kathmandu, Lolang', currency: 'NPR',
  timezone: 'Asia/Kathmandu', defaultLeaveDays: 0, attendanceCutoff: '18:00', payslipFooter: '',
};

const Settings = () => {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setForm({ ...defaults, ...response.data.data });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateForm = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));

  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/settings', { ...form, defaultLeaveDays: Number(form.defaultLeaveDays || 0) });
      setForm({ ...defaults, ...response.data.data });
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="empty-state">Loading settings...</div>;

  return (
    <div>
      <div className="page-heading"><div><h1>Settings</h1><p className="text-secondary">Manage application defaults used across attendance, leave, and payslips.</p></div><SettingsIcon size={32} className="text-secondary" /></div>
      <form onSubmit={saveSettings}>
        <div className="card settings-section"><h3>Company Information</h3><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Company Name *</label><input className="input" name="companyName" value={form.companyName} onChange={updateForm} required /></div><div className="form-group"><label className="form-label">Company Email</label><input className="input" type="email" name="companyEmail" value={form.companyEmail} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Company Phone</label><input className="input" name="companyPhone" value={form.companyPhone} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Currency</label><input className="input" name="currency" value={form.currency} onChange={updateForm} maxLength="5" /></div><div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Company Address</label><input className="input" name="companyAddress" value={form.companyAddress} onChange={updateForm} /></div></div></div>
        <div className="card settings-section"><h3>Attendance and Leave</h3><div className="grid grid-cols-2 gap-4"><div className="form-group"><label className="form-label">Timezone</label><input className="input" name="timezone" value={form.timezone} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Attendance Cutoff</label><input className="input" type="time" name="attendanceCutoff" value={form.attendanceCutoff} onChange={updateForm} /></div><div className="form-group"><label className="form-label">Default Leave Days</label><input className="input" type="number" min="0" name="defaultLeaveDays" value={form.defaultLeaveDays} onChange={updateForm} /></div></div></div>
        <div className="card settings-section"><h3>Payslip</h3><div className="form-group"><label className="form-label">Payslip Footer</label><textarea className="input" name="payslipFooter" value={form.payslipFooter} onChange={updateForm} rows="3" /></div></div>
        <div className="settings-actions"><button type="submit" className="btn btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}</button></div>
      </form>
    </div>
  );
};

export default Settings;
