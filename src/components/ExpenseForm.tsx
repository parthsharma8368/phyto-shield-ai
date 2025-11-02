import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
}

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Education",
  "Health",
  "Utilities",
  "Other"
];

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      description,
      date
    };

    onAddExpense(expense);
    
    // Reset form
    setCategory("");
    setAmount("");
    setDescription("");
    setDate(new Date());
    
    toast.success("Expense added successfully!");
  };

  return (
    <Card className="shadow-lg hover:shadow-xl glow-effect transition-smooth border-primary/20 bg-card/95 backdrop-blur">
      <CardHeader className="gradient-primary rounded-t-xl">
        <CardTitle className="text-2xl text-primary-foreground">Add New Expense</CardTitle>
        <CardDescription className="text-primary-foreground/90">
          Track your spending by adding expenses below
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="transition-smooth hover:border-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="transition-smooth hover:border-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Lunch at campus cafeteria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transition-smooth hover:border-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal transition-smooth hover:border-primary",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full gradient-primary hover:opacity-90 transition-smooth shadow-sm">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
