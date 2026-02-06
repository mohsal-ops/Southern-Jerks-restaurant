import PageHeader from "../_components/pageHeader";
import db from "@/db/db";
import OrdersForm from "./_components/ordersForm";


export default async function Items() {
  const orders = await db.order.findMany();

  const eachitemAndItsCategoryObjects = async (orders: any[]) => {
    return await Promise.all(
      orders.map(async (order) => {
        const userEmail = await db.user.findUnique({
          where: { id: order.userId },
          select: { email: true, id :true},
        });
        const product = await db.item.findUnique({
          where: { id: order.productId },
          select: { name: true,priceInCents:true },
        });

        return {
          ...userEmail,
          name: product?.name,
          price: product?.priceInCents || 0,
          orderId: { id: order.id }
        };
      }),
    );
  };
  const products = await db.item.findMany()
  const data = await eachitemAndItsCategoryObjects(orders);

  return (
    <div className="lg:flex justify-center">
      <div className="p-5 space-y-3 w-full lg:w-[80%]">
        <div className="flex justify-between  ">
          <PageHeader>Sales</PageHeader>
        </div>
        <div>
          <OrdersForm products={products} data={ data} />
         
        </div>
      </div>
    </div>
  );
}
