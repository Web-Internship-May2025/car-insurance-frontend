import React from 'react';
import '../../styles/PolicyCard.scss';

export interface Policy {
  id: number;
  dateSigned: string;
  expiringDate: string;
  moneyReceivedDate: string;
  amount: number;
  isDeleted: boolean;
  valid: boolean;
  canAddClaim: boolean; 
}

interface Props {
  policy: Policy;
}

const PolicyCard: React.FC<Props> = ({ policy }) => {
  return (
    <div className={`policy-card ${policy.isDeleted ? 'deleted' : ''}`}>
      {/* <h3>{policy.carName}</h3> */}
      <p><strong>Date Signed:</strong> {new Date(policy.dateSigned).toLocaleDateString()}</p>
      <p><strong>Expiring Date:</strong> {new Date(policy.expiringDate).toLocaleDateString()}</p>
      <p><strong>Money Received:</strong> {new Date(policy.moneyReceivedDate).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> ${policy.amount.toFixed(2)}</p>

      {policy.isDeleted && <p className="deleted-label">This policy is deleted</p>}

      <div className="actions">
        <button onClick={() => console.log('View', policy.id)}>View</button>
        <button
          onClick={() => console.log('Add Claim', policy.id)}
          disabled={!policy.valid || policy.isDeleted}
        >
          Add Claim
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;