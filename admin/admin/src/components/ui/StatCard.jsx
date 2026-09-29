import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass = 'text-accent-blue' }) => {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="text-secondary text-sm mb-2">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className={`p-3 rounded-full bg-bg-primary ${colorClass}`}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
