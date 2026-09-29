import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/ui/Badge';
import { UserCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-1 flex flex-col items-center text-center">
          <UserCircle size={80} className="text-secondary mb-4" />
          <h2 className="mb-1">{user?.name || 'Admin User'}</h2>
          <p className="text-secondary mb-3">{user?.email || 'admin@eightbit.com'}</p>
          <Badge type={user?.role === 'admin' ? 'blue' : 'gray'}>
            {(user?.role || 'admin').toUpperCase()}
          </Badge>
        </div>
        
        <div className="card md:col-span-2">
          <h3 className="mb-4 border-b border-border-color pb-2">Change Password</h3>
          <form className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="input" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="input" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="input" placeholder="Confirm new password" />
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" className="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
