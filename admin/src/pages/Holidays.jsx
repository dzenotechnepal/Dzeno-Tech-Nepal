import React from 'react';
import { CalendarDays } from 'lucide-react';

const Holidays = () => (
  <div>
    <div className="page-heading">
      <div>
        <h1>Holidays</h1>
        <p className="text-secondary">Manage company holidays and office closures.</p>
      </div>
      <button className="btn btn-primary" disabled>Add Holiday</button>
    </div>
    <div className="card empty-state">
      <CalendarDays size={36} className="text-secondary" />
      <h3>No holidays configured</h3>
      <p className="text-secondary">Add company holidays when holiday management is connected.</p>
    </div>
  </div>
);

export default Holidays;
