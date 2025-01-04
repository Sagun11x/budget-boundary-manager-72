import React from 'react';

interface SubscriptionCardProps {
  subscription: {
    id: string;
    userEmail: string;
    planType: string;
    cost: number;
    createdAt: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onApprove,
  onReject,
}) => {
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="subscription-card">
      <div className="subscription-info">
        <h3>User Email: {subscription.userEmail || 'N/A'}</h3>
        <p>Plan: {subscription.planType || 'N/A'}</p>
        <p>Cost: ${subscription.cost || '0'}</p>
        <p>Requested: {formatDate(subscription.createdAt)}</p>
      </div>
      <div className="button-group">
        <button 
          className="button approve-btn"
          onClick={() => onApprove(subscription.id)}
        >
          Approve
        </button>
        <button 
          className="button reject-btn"
          onClick={() => onReject(subscription.id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};