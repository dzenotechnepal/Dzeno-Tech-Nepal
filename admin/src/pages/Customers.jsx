import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => (
  <div>
    <div className="page-heading">
      <div>
        <h1>Customers</h1>
        <p className="text-secondary">Manage customer contacts and relationships.</p>
      </div>
      <button className="btn btn-primary" disabled>Add Customer</button>
    </div>
    <div className="card empty-state">
      <Users size={36} className="text-secondary" />
      <h3>No customers yet</h3>
      <p className="text-secondary">Customer records will appear here once customer management is connected.</p>
    </div>
  </div>
);

export default Customers;
