import React from 'react';
import { FileSignature } from 'lucide-react';

const Contracts = () => (
  <div>
    <div className="page-heading">
      <div>
        <h1>Contracts</h1>
        <p className="text-secondary">Keep employment, consultancy, internship, and other employee contracts together.</p>
      </div>
      <button className="btn btn-primary" disabled>Add Contract</button>
    </div>
    <div className="card empty-state">
      <FileSignature size={36} className="text-secondary" />
      <h3>No contracts yet</h3>
      <p className="text-secondary">Employee contracts will appear here once contract management is connected.</p>
    </div>
  </div>
);

export default Contracts;
