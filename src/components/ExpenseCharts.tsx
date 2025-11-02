import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Expense } from "./ExpenseForm";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns";

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(174, 72%, 56%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(271, 76%, 53%)', 'hsl(24, 95%, 53%)', 'hsl(198, 93%, 60%)'];

export const ExpenseCharts = ({ expenses }: ExpenseChartsProps) => {
  // Category breakdown for pie chart
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Daily spending for line chart (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const dailyData = eachDayOfInterval({
    start: thirtyDaysAgo,
    end: new Date()
  }).map(day => {
    const dayExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return format(expDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    return {
      date: format(day, 'MMM dd'),
      amount: dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  });

  // Monthly comparison for bar chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === month.getMonth() && 
             expDate.getFullYear() === month.getFullYear();
    });
    
    return {
      month: format(month, 'MMM yyyy'),
      amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-smooth border-primary/10">
        <CardHeader>
          <CardTitle className="text-primary">Spending by Category</CardTitle>
          <CardDescription>Distribution of your expenses across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-smooth border-primary/10">
        <CardHeader>
          <CardTitle className="text-secondary">Daily Spending Trend</CardTitle>
          <CardDescription>Your spending pattern over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(174, 72%, 56%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(174, 72%, 56%)', r: 4 }}
                activeDot={{ r: 6 }}
                name="Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-smooth border-primary/10">
        <CardHeader>
          <CardTitle className="text-success">Monthly Comparison</CardTitle>
          <CardDescription>Compare your spending across the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="amount" 
                fill="hsl(142, 71%, 45%)" 
                radius={[8, 8, 0, 0]}
                name="Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
