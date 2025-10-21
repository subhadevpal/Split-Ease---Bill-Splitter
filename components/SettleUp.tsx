import React from 'react';
import type { Settlement, Friend } from '../types';

interface SettleUpProps {
  settlements: Settlement[];
  friends: Friend[];
  onSettle: (fromId: string, toId: string, amount: number) => void;
}

const SettleUp: React.FC<SettleUpProps> = ({ settlements, friends, onSettle }) => {
  const friendMap = new Map(friends.map(f => [f.id, f.name]));

  if (settlements.length === 0) {
    return (
        <div className="bg-card rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-2">All Settled Up!</h2>
            <p className="text-text-secondary">Everyone is balanced. Great job!</p>
        </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Settle Up</h2>
      <div className="space-y-3">
        {settlements.map((settlement, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-text-primary">
                <span className="font-bold">{friendMap.get(settlement.fromId)}</span> should pay <span className="font-bold">{friendMap.get(settlement.toId)}</span>
              </p>
              <p className="text-lg font-bold text-primary">${settlement.amount.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onSettle(settlement.fromId, settlement.toId, settlement.amount)}
              className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Settle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettleUp;
