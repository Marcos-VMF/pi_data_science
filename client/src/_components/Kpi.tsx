import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
  return (
    <div className="stat">
      <div className="stat-figure text-primary">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{value}</div>
    </div>
  );
};

export default KpiCard;
