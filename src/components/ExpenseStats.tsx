import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react";
import { Expense } from "./ExpenseForm";

interface ExpenseStatsProps {
  expenses: Expense[];
}

export const ExpenseStats = ({ expenses }: ExpenseStatsProps) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;
  const thisMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
  const categories = [...new Set(expenses.map(exp => exp.category))].length;

  const stats = [
    {
      title: "Total Spending",
      value: `$${total.toFixed(2)}`,
      icon: DollarSign,
      gradient: "gradient-primary",
      iconColor: "text-primary"
    },
    {
      title: "This Month",
      value: `$${monthlyTotal.toFixed(2)}`,
      icon: Calendar,
      gradient: "gradient-secondary",
      iconColor: "text-secondary"
    },
    {
      title: "Average Expense",
      value: `$${average.toFixed(2)}`,
      icon: TrendingUp,
      gradient: "gradient-success",
      iconColor: "text-success"
    },
    {
      title: "Categories Used",
      value: categories.toString(),
      icon: PieChart,
      gradient: "gradient-primary",
      iconColor: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="overflow-hidden shadow-lg hover:shadow-xl transition-smooth border-primary/20 hover:scale-105 bg-card/95 backdrop-blur glow-effect"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.gradient}`}>
              <stat.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.iconColor}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
