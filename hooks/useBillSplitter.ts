import { useState, useMemo } from 'react';
import type { Friend, Expense, Balance, Settlement } from '../types';

const initialFriends: Friend[] = [
    { id: 'user-1', name: 'You' },
    { id: 'user-2', name: 'Alice' },
    { id: 'user-3', name: 'Bob' },
];

const initialExpenses: Expense[] = [
    {
        id: 'exp-1',
        description: 'Dinner at The Grand Bistro',
        amount: 120,
        paidById: 'user-2',
        splitWithIds: ['user-1', 'user-2', 'user-3'],
        date: new Date('2024-07-20T19:00:00').toISOString(),
    },
    {
        id: 'exp-2',
        description: 'Movie Tickets',
        amount: 30,
        paidById: 'user-1',
        splitWithIds: ['user-1', 'user-3'],
        date: new Date('2024-07-21T21:00:00').toISOString(),
    },
    {
        id: 'exp-3',
        description: 'Groceries',
        amount: 75,
        paidById: 'user-3',
        splitWithIds: ['user-1', 'user-2', 'user-3'],
        date: new Date('2024-07-22T12:00:00').toISOString(),
    }
];

export const useBillSplitter = () => {
    const [friends, setFriends] = useState<Friend[]>(initialFriends);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

    const addFriend = (name: string) => {
        if (name && !friends.find(f => f.name.toLowerCase() === name.toLowerCase())) {
            const newFriend: Friend = { id: `user-${Date.now()}`, name };
            setFriends(prev => [...prev, newFriend]);
        }
    };

    const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
        const newExpense: Expense = {
            ...expenseData,
            id: `exp-${Date.now()}`,
            date: new Date().toISOString(),
        };
        setExpenses(prev => [newExpense, ...prev]);
    };

    const balances = useMemo<Balance[]>(() => {
        const balanceMap = new Map<string, number>();
        friends.forEach(friend => balanceMap.set(friend.id, 0));

        expenses.forEach(expense => {
            const { amount, paidById, splitWithIds } = expense;
            const share = amount / splitWithIds.length;

            balanceMap.set(paidById, (balanceMap.get(paidById) || 0) + amount);

            splitWithIds.forEach(friendId => {
                balanceMap.set(friendId, (balanceMap.get(friendId) || 0) - share);
            });
        });

        return Array.from(balanceMap.entries()).map(([friendId, amount]) => ({
            friendId,
            amount: parseFloat(amount.toFixed(2)),
        }));
    }, [friends, expenses]);

    const settleUp = (fromId: string, toId: string, amount: number) => {
        const fromFriend = friends.find(f => f.id === fromId);
        const toFriend = friends.find(f => f.id === toId);

        if (!fromFriend || !toFriend) return;

        addExpense({
            description: `${fromFriend.name} paid ${toFriend.name}`,
            amount: amount,
            paidById: fromId,
            splitWithIds: [toId],
        });
    };

    const settlements = useMemo<Settlement[]>(() => {
        const debtors = balances.filter(b => b.amount < 0).map(b => ({ ...b, amount: -b.amount })).sort((a,b) => b.amount - a.amount);
        const creditors = balances.filter(b => b.amount > 0).sort((a,b) => b.amount - a.amount);
        const settlementsList: Settlement[] = [];

        let debtorIndex = 0;
        let creditorIndex = 0;

        while(debtorIndex < debtors.length && creditorIndex < creditors.length) {
            const debtor = debtors[debtorIndex];
            const creditor = creditors[creditorIndex];
            const amount = Math.min(debtor.amount, creditor.amount);
            
            if (amount > 0.01) {
                settlementsList.push({
                    fromId: debtor.friendId,
                    toId: creditor.friendId,
                    amount: parseFloat(amount.toFixed(2)),
                });

                debtors[debtorIndex].amount -= amount;
                creditors[creditorIndex].amount -= amount;
            }

            if (debtors[debtorIndex].amount < 0.01) {
                debtorIndex++;
            }
            if (creditors[creditorIndex].amount < 0.01) {
                creditorIndex++;
            }
        }

        return settlementsList;
    }, [balances]);

    return { friends, expenses, balances, addFriend, addExpense, settlements, settleUp };
};
