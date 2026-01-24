import React from 'react';
import { AdminUser } from '../types';
import LeadManager from '../components/admin/LeadManager';

interface BranchLeadsProps {
  user: AdminUser;
}

const BranchLeads: React.FC<BranchLeadsProps> = ({ user }) => {
  if (!user.branchId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-medium">Size atanmış bir şube bulunamadı.</p>
      </div>
    );
  }

  return <LeadManager branchId={user.branchId} />;
};

export default BranchLeads;
