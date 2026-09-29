import React from 'react';

const Badge = ({ children, type = 'gray', className = '' }) => {
  return (
    <span className={`badge badge-${type} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
