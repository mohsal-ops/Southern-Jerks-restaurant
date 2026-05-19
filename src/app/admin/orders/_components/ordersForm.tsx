'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteOrder } from "../../menuItems/_components/productsActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";

function OrdersForm({ products, data }: { products: any[]; data: any[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id ?? ""
  );
  const router = useRouter();

  const handleAddOrder = () => {
    if (!selectedProductId) return;
    router.push(`/admin/orders/new?productId=${selectedProductId}`);
  };

  return (
    <div className="space-y-4">
      {/* Add Order Row — product selector + button */}
      <div className="flex items-center gap-3">
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger className="w-55">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="p-5 text-md"
          onClick={handleAddOrder}
          disabled={!selectedProductId}
        >
          Add Order
        </Button>
      </div>

      {/* Orders Table */}
      <Table>
        <TableCaption>
          {data.length > 0 ? "A list of your sales orders" : "No orders found"}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Customer Email</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((order) => (
            <TableRow key={`${order.id}-${order.orderId?.id}`}>
              <TableCell>{order?.name}</TableCell>
              <TableCell>{formatCurrency(order?.price / 100)}</TableCell>
              <TableCell>{order?.email}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Actions</span>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DeleteOrder id={order?.orderId?.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default OrdersForm;