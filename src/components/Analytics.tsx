import { Card } from "@/components/ui/card";
import { addMonths, format, differenceInDays, addDays, addWeeks, addYears, subMonths } from "date-fns";
import type { Subscription } from "@/types/subscription";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { Button } from "./ui/button";

interface AnalyticsProps {
  subscriptions: Subscription[];
}

export const Analytics = ({ subscriptions }: AnalyticsProps) => {
  const [dateRange, setDateRange] = useState<number>(6); // Default to 6 months

  const calculateAnalytics = () => {
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

  const getRenewalDays = (purchaseDate: string, renewalPeriod: { number: number; unit: string }) => {
    const startDate = new Date(purchaseDate);
    const today = new Date();
    let nextRenewal = startDate;

    while (nextRenewal <= today) {
      switch (renewalPeriod.unit) {
        case "days":
          nextRenewal = addDays(nextRenewal, renewalPeriod.number);
          break;
        case "weeks":
          nextRenewal = addWeeks(nextRenewal, renewalPeriod.number);
          break;
        case "months":
          nextRenewal = addMonths(nextRenewal, renewalPeriod.number);
          break;
        case "years":
          nextRenewal = addYears(nextRenewal, renewalPeriod.number);
          break;
      }
    }

    return differenceInDays(nextRenewal, today);
  };

  const calculateRenewalRatio = (subscription: Subscription) => {
    const startDate = new Date(subscription.purchaseDate);
    const today = new Date();
    let nextRenewal = startDate;
    let previousRenewal = startDate;

    // Find the next renewal date after today
    while (nextRenewal <= today) {
      previousRenewal = nextRenewal;
      switch (subscription.renewalPeriod.unit) {
        case "days":
          nextRenewal = addDays(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "weeks":
          nextRenewal = addWeeks(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "months":
          nextRenewal = addMonths(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "years":
          nextRenewal = addYears(nextRenewal, subscription.renewalPeriod.number);
          break;
      }
    }

    const totalPeriodDays = differenceInDays(nextRenewal, previousRenewal);
    const daysElapsed = differenceInDays(today, previousRenewal);
    const ratio = Math.max(0, Math.min(100, (daysElapsed / totalPeriodDays) * 100));
    
    return `${Math.round(ratio)}%`;
  };

  const getChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = dateRange - 1; i >= 0; i--) {
      const currentMonth = subMonths(today, i);
      const monthTotal = subscriptions.reduce((acc, sub) => {
        const startDate = new Date(sub.purchaseDate);
        if (startDate <= currentMonth) {
          return acc + sub.cost;
        }
        return acc;
      }, 0);

      data.push({
        month: format(currentMonth, 'MMM yyyy'),
        cost: monthTotal
      });
    }
    return data;
  };

  const analytics = calculateAnalytics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Overview</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Total Subscriptions</p>
            <p className="text-2xl font-semibold">{analytics.totalSubscriptions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Spend</p>
            <p className="text-2xl font-semibold">${analytics.monthlySpend.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Yearly Spend</p>
            <p className="text-2xl font-semibold">${analytics.yearlySpend.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Upcoming Renewals</h3>
        <div className="space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto">
          {analytics.upcomingRenewals.map(sub => (
            <div key={sub.id} className="border-b pb-2 last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">{sub.name}</span>
                <span className="text-gray-600">${sub.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Renews in {getRenewalDays(sub.purchaseDate, sub.renewalPeriod)} days
                </p>
                <p className="text-sm text-gray-500">
                  Period used: {calculateRenewalRatio(sub)}
                </p>
              </div>
            </div>
          ))}
          {analytics.upcomingRenewals.length === 0 && (
            <p className="text-sm text-gray-500">No upcoming renewals in the next month</p>
          )}
        </div>
      </Card>

      <Card className="p-6 sm:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Subscription Cost Trend</h3>
          <div className="space-x-2">
            <Button
              variant={dateRange === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(3)}
            >
              3M
            </Button>
            <Button
              variant={dateRange === 6 ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(6)}
            >
              6M
            </Button>
            <Button
              variant={dateRange === 12 ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(12)}
            >
              12M
            </Button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
              />
              <Bar dataKey="cost" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
