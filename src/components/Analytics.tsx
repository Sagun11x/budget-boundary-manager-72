import { Card } from "@/components/ui/card";
import { addMonths, format, differenceInDays, addDays, addWeeks, addYears } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface AnalyticsProps {
  subscriptions: Subscription[];
}

export const Analytics = ({ subscriptions }: AnalyticsProps) => {
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
        <div className="space-y-3">
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
    </div>
  );
};