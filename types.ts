export interface Friend {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  splitWithIds: string[];
  date: string;
}

export interface Balance {
  friendId: string;
  amount: number;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}
