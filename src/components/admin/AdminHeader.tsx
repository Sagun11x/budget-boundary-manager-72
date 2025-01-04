import React from 'react';

interface AdminHeaderProps {
  userEmail: string | null;
  onLogin: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail, onLogin }) => {
  return (
    <div className="header">
      <h1>Subscription Admin Panel</h1>
      <div id="auth-status">{userEmail ? `Logged in as: ${userEmail}` : 'Not logged in'}</div>
      {!userEmail && (
        <button onClick={onLogin} className="button">
          Login with Google
        </button>
      )}
    </div>
  );
};