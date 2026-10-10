import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import Badge from '../components/ui/Badge';
import api from '../api/axios';
import toast from 'react-hot-toast';

const inquiryStatuses = ['new', 'in_progress', 'resolved', 'archived'];
const applicationStatuses = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

const Submissions = () => {
  const [tab, setTab] = useState('inquiries');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/${tab}`);
      setItems(response.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, [tab]);

  const updateStatus = async (item, status) => {
    try {
      await api.patch(`/submissions/${tab}/${item._id}`, { status, adminNotes: item.adminNotes || '' });
      setItems(previous => previous.map(current => current._id === item._id ? { ...current, status } : current));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statuses = tab === 'inquiries' ? inquiryStatuses : applicationStatuses;

  return (
    <div>
      <div className="page-heading">
        <div><h1>Submissions</h1><p className="text-secondary">Review contact inquiries and job applications from the website.</p></div>
        <button className="btn btn-outline" onClick={loadItems} disabled={loading}><RefreshCw size={16} /> Refresh</button>
      </div>

      <div className="card" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button className={`btn ${tab === 'inquiries' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('inquiries')}><MessageSquare size={16} /> Contact Inquiries</button>
        <button className={`btn ${tab === 'applications' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('applications')}><BriefcaseBusiness size={16} /> Job Applications</button>
      </div>

      <div className="card">
        {loading ? <div className="empty-state">Loading submissions...</div> : items.length === 0 ? <div className="empty-state"><Mail size={36} className="text-secondary" /><h3>No submissions found</h3><p className="text-secondary">New website submissions will appear here.</p></div> : (
          <div className="table-container"><table className="table"><thead><tr><th>Submitted</th><th>Sender</th><th>{tab === 'inquiries' ? 'Service' : 'Position'}</th><th>Message</th><th>Status</th></tr></thead><tbody>{items.map(item => <tr key={item._id}><td>{new Date(item.createdAt).toLocaleString('en-NP')}</td><td><strong>{item.name}</strong><small className="text-secondary" style={{ display: 'block' }}>{item.email}<br />{item.phone || ''}</small></td><td>{tab === 'inquiries' ? item.service : item.position}<small className="text-secondary" style={{ display: 'block' }}>{tab === 'applications' ? item.applicationType : ''}</small></td><td style={{ maxWidth: '340px', whiteSpace: 'pre-wrap' }}>{item.message}</td><td><select className="select" value={item.status} onChange={(event) => updateStatus(item, event.target.value)}>{statuses.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><Badge type={item.status === 'new' ? 'blue' : item.status === 'rejected' || item.status === 'archived' ? 'red' : 'green'}>{item.status.replace('_', ' ')}</Badge></td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
