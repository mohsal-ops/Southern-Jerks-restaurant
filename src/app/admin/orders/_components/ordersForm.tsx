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

import { randomUUID } from "node:crypto";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteOrder } from "../../menuItems/_components/productsActions";
function OrdersForm({products,data}:{products:any[],data:any[]}) {

  console.log(data)
    
  return (
      <div>
           
            <div className="flex gap-2">
                
              {products.map(product => (
                <div key={product.id} className="flex gap-2">
                  <p>{product.name}</p>
                  <Link href={{
                      pathname: "/admin/orders/new",
                      query: {
                        productId: product ?  product.id as string : 'none'
                      }
                    }}>
                      <Button className="text-sm">add item</Button>                     
                    </Link>
                </div>
              ))}
            </div>
          <Table>
            <TableCaption>
              {data.length > 0 ? "A list of your items" : "No items found"}
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="">
                  <span className="">Status</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((data) => (
                <TableRow key={`${data.id}-${Math.random().toString(36)}`}>
                  
                  <TableCell>{data?.name}</TableCell>
                  <TableCell>
                    {formatCurrency(data?.price / 100)}
                  </TableCell>
                  <TableCell>{data?.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="sr-only">Actions</span>
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                       
                        <DeleteOrder id={data?.orderId?.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </div>
  )
}

export default OrdersForm