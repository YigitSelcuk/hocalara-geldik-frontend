import React from 'react';
import { AdminUser } from '../types';
import LeadManager from '../components/admin/LeadManager';

interface BranchLeadsProps {
  user?: AdminUser;
  branchId?: string;
}

const BranchLeads: React.FC<BranchLeadsProps> = ({ user, branchId: propBranchId }) => {
  const branchId = propBranchId || user?.branchId;

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-medium">Size atanmış bir şube bulunamadı.</p>
      </div>
    );
  }

  return <LeadManager branchId={branchId} />;
};

export default BranchLeads;
