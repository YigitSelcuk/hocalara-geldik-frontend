import React from 'react';
import BranchNewsManager from '../components/admin/BranchNewsManager';

const BranchNews: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = user.branchId;

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">Şube bilgisi bulunamadı</p>
      </div>
    );
  }

  return <BranchNewsManager branchId={branchId} />;
};

export default BranchNews;
