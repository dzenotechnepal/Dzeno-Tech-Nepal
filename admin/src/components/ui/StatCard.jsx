import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#3b82f6' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
      </div>
      <div style={{
        padding: '12px',
        borderRadius: '50%',
        background: `${color}20`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
