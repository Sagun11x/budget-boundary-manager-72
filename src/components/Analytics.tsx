import { Card } from "@/components/ui/card";
import { addMonths, format, differenceInDays } from "date-fns";
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

  const analytics = calculateAnalytics();

  const getRenewalDays = (purchaseDate: string) => {
    const nextRenewal = addMonths(new Date(purchaseDate), 1);
    const daysUntilRenewal = differenceInDays(nextRenewal, new Date());
    return daysUntilRenewal;
  };

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
              <p className="text-sm text-gray-500">
                Renews in {getRenewalDays(sub.purchaseDate)} days
              </p>
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