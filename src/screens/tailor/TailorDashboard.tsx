import React from 'react';
import AdminOverview from '../admin/AdminOverview';
import { User } from '../../types';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function TailorDashboard({ user, onLogout }: Props) {
  return <AdminOverview user={user} onLogout={onLogout} />;
}
