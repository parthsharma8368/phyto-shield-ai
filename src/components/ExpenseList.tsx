import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Expense } from "./ExpenseForm";
import { Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    onDeleteExpense(id);
    toast.success("Expense deleted successfully");
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-smooth border-primary/20 bg-card/95 backdrop-blur glow-effect">
      <CardHeader>
        <CardTitle className="text-primary">Expense History</CardTitle>
        <CardDescription>View and manage all your recorded expenses</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 transition-smooth hover:border-primary focus:border-primary"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No expenses match your search" : "No expenses recorded yet"}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow 
                    key={expense.id}
                    className="hover:bg-muted/50 transition-smooth"
                  >
                    <TableCell className="font-medium">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
