import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Subscription } from "@/types/subscription";
import { getChartData } from "@/utils/analyticsUtils";

interface SubscriptionBarChartProps {
  subscriptions: Subscription[];
  dateRange: number;
  setDateRange: (range: number) => void;
}

export const SubscriptionBarChart = ({ subscriptions, dateRange, setDateRange }: SubscriptionBarChartProps) => {
  const data = getChartData(subscriptions, dateRange);
  const uniqueSubscriptions = Array.from(
    new Set(data.flatMap(d => d.subscriptions.map(s => s.name)))
  );

  return (
    <Card className="p-6 sm:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Total Duration Cost</h3>
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, `${name} Duration`]}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded p-2 shadow-lg">
                      <p className="font-semibold">{label}</p>
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between gap-4">
                          <span style={{ color: entry.color }}>{entry.name} Duration:</span>
                          <span>${entry.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend formatter={(value) => `${value} Duration`} />
            {uniqueSubscriptions.map((name, index) => (
              <Bar
                key={name}
                dataKey={`subscriptions[${index}].cost`}
                name={name}
                stackId="a"
                fill={data[0]?.subscriptions.find(s => s.name === name)?.color || `hsl(${index * 30}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};