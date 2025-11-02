import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Expense } from "./ExpenseForm";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns";

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = ['hsl(221, 83%, 58%)', 'hsl(174, 72%, 56%)', 'hsl(142, 71%, 50%)', 'hsl(38, 92%, 55%)', 'hsl(0, 84%, 65%)', 'hsl(271, 76%, 53%)', 'hsl(24, 95%, 53%)', 'hsl(198, 93%, 60%)'];

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
      <Card className="shadow-lg hover:shadow-xl transition-smooth border-primary/20 bg-card/95 backdrop-blur glow-effect">
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
                labelLine={true}
                label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `₹${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 15%)',
                  border: '1px solid hsl(217, 33%, 25%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)'
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-smooth border-primary/20 bg-card/95 backdrop-blur glow-effect">
        <CardHeader>
          <CardTitle className="text-secondary">Daily Spending Trend</CardTitle>
          <CardDescription>Your spending pattern over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: 'hsl(215, 20%, 70%)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(215, 20%, 70%)' }}
                tickFormatter={(value) => `₹${value}`}
                width={60}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 15%)',
                  border: '1px solid hsl(217, 33%, 25%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)'
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(210, 40%, 98%)' }} />
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

      <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-smooth border-primary/20 bg-card/95 backdrop-blur glow-effect">
        <CardHeader>
          <CardTitle className="text-success">Monthly Comparison</CardTitle>
          <CardDescription>Compare your spending across the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: 'hsl(215, 20%, 70%)' }} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(215, 20%, 70%)' }}
                tickFormatter={(value) => `₹${value}`}
                width={60}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 15%)',
                  border: '1px solid hsl(217, 33%, 25%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)'
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(210, 40%, 98%)' }} />
              <Bar 
                dataKey="amount" 
                fill="hsl(142, 71%, 50%)" 
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
