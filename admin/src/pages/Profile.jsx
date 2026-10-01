import React, { useEffect, useState } from 'react';
import { ImagePlus, Save, UserCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyProfile = {
  name: '', email: '', role: '', designation: '', department: '', employeeId: '', joiningDate: '',
  phone: '', address: '', gender: '', age: '', citizenshipNumber: '', panNumber: '',
  bankName: '', bankAccountHolderName: '', bankAccountNumber: '', bankBranch: '', ssfEnrolled: true,
  avatar: '',
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const data = response.data.data;
        setProfile({ ...emptyProfile, ...data, joiningDate: data.joiningDate ? data.joiningDate.slice(0, 10) : '' });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const updateField = (event) => setProfile(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const updatePassword = (event) => setPasswords(previous => ({ ...previous, [event.target.name]: event.target.value }));

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Profile picture must be 5 MB or smaller'); return; }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/auth/me/avatar', formData);
      setProfile(previous => ({ ...previous, ...response.data.data }));
      updateUser({ ...user, ...response.data.data });
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/auth/me/profile', {
        name: profile.name, phone: profile.phone, address: profile.address, gender: profile.gender || undefined,
        age: profile.age ? Number(profile.age) : undefined, citizenshipNumber: profile.citizenshipNumber,
        panNumber: profile.panNumber, bankName: profile.bankName, bankAccountHolderName: profile.bankAccountHolderName,
        bankAccountNumber: profile.bankAccountNumber, bankBranch: profile.bankBranch,
      });
      setProfile(previous => ({ ...previous, ...response.data.data }));
      updateUser({ ...user, ...response.data.data });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('New passwords do not match'); return; }
    try {
      setChangingPassword(true);
      await api.post('/auth/change-password', { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <div className="empty-state">Loading profile...</div>;

  const field = (label, name, type = 'text', disabled = false) => <div className="form-group"><label className="form-label">{label}</label><input className="input" name={name} type={type} value={profile[name] ?? ''} onChange={updateField} disabled={disabled} /></div>;

  return (
    <div>
      <div className="page-heading"><div><h1>My Profile</h1><p className="text-secondary">View and manage your account information.</p></div></div>
      <div className="profile-layout">
        <div className="card profile-summary"><div className="profile-avatar-wrap">{profile.avatar ? <img src={profile.avatar} alt="Profile" className="profile-avatar" /> : <UserCircle size={80} className="text-secondary" />}<label className="btn btn-outline profile-avatar-button"><ImagePlus size={16} /> {uploadingAvatar ? 'Uploading...' : 'Change picture'}<input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploadingAvatar} hidden /></label></div><h2>{profile.name || 'User'}</h2><p className="text-secondary">{profile.email}</p><Badge type={profile.role === 'admin' || profile.role === 'superadmin' ? 'blue' : 'gray'}>{profile.role.toUpperCase()}</Badge><div className="profile-summary-details"><span>{profile.employeeId || 'No employee ID'}</span><span>{profile.designation || 'No designation'}</span><span>{profile.joiningDate ? `Joined ${new Date(profile.joiningDate).toLocaleDateString('en-NP')}` : 'Joining date not set'}</span></div></div>
        <form className="card profile-form" onSubmit={saveProfile}><h3>Personal Information</h3><div className="grid grid-cols-2 gap-4">{field('Full Name', 'name')}{field('Email', 'email', 'email', true)}{field('Phone', 'phone', 'tel')}{field('Gender', 'gender')}{field('Age', 'age', 'number')}{field('Citizenship Number', 'citizenshipNumber')}{field('PAN Number', 'panNumber')}{field('Designation', 'designation', 'text', true)}{field('Department', 'department', 'text', true)}{field('Joining Date', 'joiningDate', 'date', true)}<div className="form-group" style={{ gridColumn: '1 / -1' }}>{field('Address', 'address')}</div></div><h3>Bank and Statutory Information</h3><div className="grid grid-cols-2 gap-4">{field('Bank Name', 'bankName')}{field('Account Holder Name', 'bankAccountHolderName')}{field('Account Number', 'bankAccountNumber')}{field('Branch', 'bankBranch')}<div className="form-group"><label className="form-label">SSF Enrollment</label><input className="input" value={profile.ssfEnrolled ? 'Enrolled' : 'Not enrolled'} disabled /></div></div><div className="settings-actions"><button type="submit" className="btn btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}</button></div></form>
      </div>
      <form className="card password-card" onSubmit={changePassword}><h3>Change Password</h3><div className="grid grid-cols-3 gap-4"><div className="form-group"><label className="form-label">Current Password</label><input className="input" type="password" name="oldPassword" value={passwords.oldPassword} onChange={updatePassword} required /></div><div className="form-group"><label className="form-label">New Password</label><input className="input" type="password" name="newPassword" minLength="8" value={passwords.newPassword} onChange={updatePassword} required /></div><div className="form-group"><label className="form-label">Confirm New Password</label><input className="input" type="password" name="confirmPassword" minLength="8" value={passwords.confirmPassword} onChange={updatePassword} required /></div></div><div className="settings-actions"><button type="submit" className="btn btn-primary" disabled={changingPassword}>{changingPassword ? 'Updating...' : 'Update Password'}</button></div></form>
    </div>
  );
};

export default Profile;
