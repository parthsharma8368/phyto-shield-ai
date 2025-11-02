import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Expense } from "./ExpenseForm";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";

interface ExpensePredictorProps {
  expenses: Expense[];
}

export const ExpensePredictor = ({ expenses }: ExpensePredictorProps) => {
  // Simple linear regression
  const calculateLinearRegression = () => {
    if (expenses.length < 2) return { slope: 0, intercept: 0 };

    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDate = new Date(sortedExpenses[0].date).getTime();
    const dataPoints = sortedExpenses.map((exp, index) => ({
      x: (new Date(exp.date).getTime() - firstDate) / (1000 * 60 * 60 * 24), // days from start
      y: exp.amount
    }));

    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, point) => sum + point.x, 0);
    const sumY = dataPoints.reduce((sum, point) => sum + point.y, 0);
    const sumXY = dataPoints.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = dataPoints.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  const { slope, intercept } = calculateLinearRegression();

  // Generate prediction data
  const generatePredictionData = () => {
    if (expenses.length === 0) return [];

    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDate = new Date(sortedExpenses[0].date);
    const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].date);
    
    const historicalData = sortedExpenses.map((exp) => {
      const daysSinceStart = Math.floor(
        (new Date(exp.date).getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        date: format(new Date(exp.date), 'MMM dd'),
        actual: exp.amount,
        predicted: null,
        isPrediction: false
      };
    });

    // Generate 30 days of predictions
    const predictions = Array.from({ length: 30 }, (_, i) => {
      const predictionDate = addDays(lastDate, i + 1);
      const daysSinceStart = Math.floor(
        (predictionDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const predictedAmount = Math.max(0, slope * daysSinceStart + intercept);

      return {
        date: format(predictionDate, 'MMM dd'),
        actual: null,
        predicted: predictedAmount,
        isPrediction: true
      };
    });

    return [...historicalData.slice(-15), ...predictions]; // Show last 15 actual + 30 predictions
  };

  const predictionData = generatePredictionData();
  const trend = slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable';
  
  // Calculate 30-day projection
  const thirtyDayProjection = predictionData
    .filter(d => d.isPrediction)
    .reduce((sum, d) => sum + (d.predicted || 0), 0);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-smooth border-secondary/20 bg-card/95 backdrop-blur glow-effect">
      <CardHeader className="gradient-secondary rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
              <TrendingUp className="h-6 w-6" />
              Expense Predictor
            </CardTitle>
            <CardDescription className="text-foreground/80 mt-2">
              Based on linear regression analysis of your spending patterns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {expenses.length < 2 ? (
          <div className="text-center py-8 text-muted-foreground">
            Add at least 2 expenses to see predictions
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">Spending Trend</div>
                <div className="text-2xl font-bold text-primary capitalize">
                  {trend}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {slope > 0 ? 'Your expenses are rising' : slope < 0 ? 'Your expenses are declining' : 'Your expenses are steady'}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                <div className="text-sm text-muted-foreground mb-1">30-Day Projection</div>
                <div className="text-2xl font-bold text-warning">
                  ₹{thirtyDayProjection.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  If spending continues at current rate
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
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
                  dataKey="actual" 
                  stroke="hsl(221, 83%, 58%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(221, 83%, 58%)', r: 4 }}
                  name="Actual Spending"
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(38, 92%, 55%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(38, 92%, 55%)', r: 4 }}
                  name="Predicted Spending"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This prediction uses linear regression to forecast future spending based on your historical data. 
                The dashed line shows projected expenses for the next 30 days. Adjust your spending habits now to improve your financial future!
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
