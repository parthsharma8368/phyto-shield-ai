import { useState, useEffect } from "react";
import { ExpenseForm, Expense } from "@/components/ExpenseForm";
import { ExpenseStats } from "@/components/ExpenseStats";
import { ExpenseCharts } from "@/components/ExpenseCharts";
import { ExpensePredictor } from "@/components/ExpensePredictor";
import { ExpenseList } from "@/components/ExpenseList";
import { Wallet, TrendingDown } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const withDates = parsed.map((exp: any) => ({
        ...exp,
        date: new Date(exp.date)
      }));
      setExpenses(withDates);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground py-12 px-4 shadow-2xl glow-effect relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Student Expense Tracker</h1>
          </div>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Take control of your finances with intelligent tracking, insightful visualizations, 
            and AI-powered predictions to help you spend smarter.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <ExpenseStats expenses={expenses} />
        </section>

        {/* Form and Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseCharts expenses={expenses} />
          </div>
        </section>

        {/* Predictor Section */}
        <section>
          <ExpensePredictor expenses={expenses} />
        </section>

        {/* Expense List */}
        <section>
          <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur border-t border-primary/20 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="h-5 w-5" />
            <span className="font-semibold">Smart Spending Starts Here</span>
          </div>
          <p className="text-sm">
            Track, analyze, and optimize your expenses with data-driven insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
