export interface Subscription {
  id: string;
  name: string;
  logo?: string;
  cost: number;
  currency: string;
  purchaseDate: string;
  renewalPeriod: {
    number: number;
    unit: "days" | "weeks" | "months" | "years";
  };
  description?: string;
  userId: string;
}