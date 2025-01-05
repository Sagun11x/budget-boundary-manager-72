import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { Subscription } from "@/types/subscription";
import { calculateAnalytics } from "@/utils/analyticsUtils";

interface AnalyticsProps {
  subscriptions: Subscription[];
}

export const Analytics = ({ subscriptions }: AnalyticsProps) => {
  const analytics = calculateAnalytics(subscriptions);

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