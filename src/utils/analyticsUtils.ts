import { addMonths, format, differenceInDays, addDays, addWeeks, addYears, subMonths } from "date-fns";
import type { Subscription } from "@/types/subscription";

export const calculateAnalytics = (subscriptions: Subscription[]) => {
  const today = new Date();
  const monthlySpend = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);
  const yearlySpend = monthlySpend * 12;

  const upcomingRenewals = subscriptions
    .filter(sub => {
      const nextRenewal = addMonths(new Date(sub.purchaseDate), 1);
      return nextRenewal <= addMonths(today, 1);
    })
    .sort((a, b) => 
      new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
    );

  return {
    totalSubscriptions: subscriptions.length,
    monthlySpend,
    yearlySpend,
    upcomingRenewals,
  };
};

export const getExpenseColor = (cost: number, maxCost: number): string => {
  if (cost <= maxCost * 0.2) return 'hsl(var(--success))'; // Low expense
  if (cost <= maxCost * 0.5) return 'hsl(var(--warning))'; // Medium expense
  return 'hsl(var(--destructive))'; // High expense
};

export const getChartData = (subscriptions: Subscription[], dateRange: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = dateRange - 1; i >= 0; i--) {
    const currentMonth = subMonths(today, i);
    const monthlyData = {
      month: format(currentMonth, 'MMM yyyy'),
      total: 0,
      subscriptions: [] as { name: string; cost: number; color: string }[]
    };

    subscriptions.forEach(sub => {
      const startDate = new Date(sub.purchaseDate);
      if (startDate <= currentMonth) {
        monthlyData.total += sub.cost;
        monthlyData.subscriptions.push({
          name: sub.name,
          cost: sub.cost,
          color: getExpenseColor(sub.cost, Math.max(...subscriptions.map(s => s.cost)))
        });
      }
    });

    data.push(monthlyData);
  }
  return data;
};