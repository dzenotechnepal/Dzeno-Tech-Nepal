import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    designation: '', department: '', role: 'employee',
    panNumber: '', joiningDate: '',
    bankName: '', accountNumber: '', branch: '', ifsc: '',
    basicSalary: '', da: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Employee registered successfully!');
      navigate('/admin/employees');
    }, 1000);
  };

  return (
    <div>
      <h1 className="mb-6">Register New Employee</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <h2 className="text-xl mb-4 border-b border-border-color pb-2">1. Personal & Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" className="input" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" className="input" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" name="phone" className="input" required value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input type="text" name="panNumber" className="input" value={formData.panNumber} onChange={handleChange} />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Address</label>
              <input type="text" name="address" className="input" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input type="text" name="designation" className="input" required value={formData.designation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" name="department" className="input" value={formData.department} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">System Role *</label>
              <select name="role" className="select" required value={formData.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Joining Date *</label>
              <input type="date" name="joiningDate" className="input" required value={formData.joiningDate} onChange={handleChange} />
            </div>
          </div>
        </div>
        
        <div className="card mb-6">
          <h2 className="text-xl mb-4 border-b border-border-color pb-2">2. Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input type="text" name="bankName" className="input" value={formData.bankName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="text" name="accountNumber" className="input" value={formData.accountNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <input type="text" name="branch" className="input" value={formData.branch} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC / Routing Code</label>
              <input type="text" name="ifsc" className="input" value={formData.ifsc} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl mb-4 border-b border-border-color pb-2">3. Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Monthly Basic Salary (NPR) *</label>
              <input type="number" name="basicSalary" className="input" required min="0" value={formData.basicSalary} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Dearness Allowance (DA) (NPR)</label>
              <input type="number" name="da" className="input" min="0" value={formData.da} onChange={handleChange} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Register Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterEmployee;
