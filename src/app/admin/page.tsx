import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import OrdersByDayChart from "./_components/charts/orderByDayChart";
import { ReactNode } from "react";
import { Prisma } from "@prisma/client";
import { differenceInDays, differenceInMonths, differenceInWeeks, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, eachYearOfInterval, endOfWeek, interval, max, min, startOfDay, startOfWeek, subDays } from "date-fns";
import UserssByDayChart from "./_components/charts/usersByDayChart";
import ProductRevenueByDayChart from "./_components/charts/productRevenuByDayChart";
import TrafficSourceChart from "./_components/charts/trafficSources";



async function getSalesData(
  createdAfter: Date | null,
  createdBefore: Date | null,
) {
  const CreatedAtQuery: Prisma.OrderWhereInput["createdAt"] = {};

  if (createdAfter) CreatedAtQuery.gte = createdAfter;
  if (createdBefore) CreatedAtQuery.lte = createdBefore;

  const [ChartData, data] = await Promise.all([

    db.order.findMany({
      select: { pricePaidInCents: true, createdAt: true },
      where: { createdAt: CreatedAtQuery },
      orderBy: { createdAt: "asc" },
    }),

    db.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    })

  ]);



  const daysArray = eachDayOfInterval(

    interval(
      createdAfter || startOfDay(ChartData[0].createdAt),
      createdBefore || new Date(),
    ),
  ).map((date) => {

    return {
      date: formatDate(date),
      totalSales: 0
    }
  });

  return {

    chartData: ChartData.reduce((data, order) => {
      const formatedDate = formatDate(order.createdAt)
      const entry = daysArray.find(day => day.date === formatedDate)
      if (entry == null) return data
      entry.totalSales += order.pricePaidInCents / 100
      return data
    }, daysArray),

    totalAmount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}
async function getUserData(
  createdAfter: Date | null,
  createdBefore: Date | null
) {
  const createdAtQuery: Prisma.UserWhereInput["createdAt"] = {}
  if (createdAfter) createdAtQuery.gte = createdAfter
  if (createdBefore) createdAtQuery.lte = createdBefore

  const [userCount, orderData, ChartData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
    db.user.findMany({
      select: { createdAt: true },
      where: { createdAt: createdAtQuery },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const daysArray = eachDayOfInterval(
    interval(
      createdAfter || startOfDay(ChartData[0].createdAt),
      createdBefore || new Date(),
    ),
  ).map((date) => {
    return {
      date: formatDate(date),
      totalUsers: 0
    }
  });

  return {
    chartData: ChartData.reduce((data, user) => {
      const formatedDate = formatDate(user.createdAt)
      const entry = daysArray.find(day => day.date === formatedDate)
      if (entry == null) return data
      entry.totalUsers += 1
      return data
    }, daysArray),
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}



async function getItemsData(
  createdAfter: Date | null,
  createdBefore: Date | null,) {

  const CreatedAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
  if (createdAfter) CreatedAtQuery.gte = createdAfter;
  if (createdBefore) CreatedAtQuery.lte = createdBefore;

  const [active, inactive, ChartData] = await Promise.all([
    db.item.count({ where: { isAvailableForPurchase: true } }),
    db.item.count({ where: { isAvailableForPurchase: false } }),
    db.item.findMany({
      select: {
        name: true, orders: {
          select: { pricePaidInCents: true },
          where: { createdAt: CreatedAtQuery }
        }
      },
    }),

  ]);

  const totalItems = await db.item.count();
  return {
    charetData: ChartData.map(product => {
      return {
        name: product.name,
        revenue: product.orders.reduce((sum, order) => {
          return sum + order.pricePaidInCents / 100
        }, 0)
      }
    }),
    active, inactive, totalItems
  };





}

type DashbordProps = {
  title: string;
  description: string | null;
  body: string;
};
type ChartCard = {
  title: string;
  children: ReactNode;
};

function DashboardCard({ title, description, body }: DashbordProps) {
  return (
    <Card >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
function ChartCard({ title, children }: ChartCard) {
  return (
    <Card >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default async function Page() {

  const [salesData, itemsData, usersData] = await Promise.all([
    getSalesData(subDays(new Date(), 6), new Date()),
    getItemsData(subDays(new Date(), 6), new Date()),
    getUserData(subDays(new Date(), 20), new Date()),
  ])
  return (<>
    <div className="p-2">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-col gap-2  ">
        <DashboardCard
          title="Sales"
          description={formatNumber(salesData.numberOfSales) + " " + "Orders"}
          body={formatCurrency(salesData.totalAmount)}
        />
        <DashboardCard
          title="Customers"
          description={`${formatCurrency(
            usersData.averageValuePerUser
          )} - Average Value`}
          body={formatNumber(usersData.userCount)}
        />
        <DashboardCard
          title="Items"
          description={`${formatNumber(
            itemsData.active
          )} - Active Product`}
          body={`${formatNumber(itemsData.totalItems)} `}

        />
      </div>
      <div className="mt-8 grid  lg:grid-cols-2 grid-col-1 gap-2  ">
        <ChartCard title="Total Sales">
          <OrdersByDayChart data={salesData.chartData ?? []} />
        </ChartCard>
        <ChartCard title="New Users">
          <UserssByDayChart data={usersData.chartData} />
        </ChartCard>
        <ChartCard title="Revenue By Product">
          <ProductRevenueByDayChart data={itemsData.charetData} />
        </ChartCard>
        <ChartCard title="Traffic Sources Chart">
          <TrafficSourceChart />
        </ChartCard>

      </div>
    </div>
  </>
  );
}


function getChartDateArray(startDate: Date, endDate: Date = new Date()) {
  const days = differenceInDays(endDate, startDate)
  if (days < 30) {
    return {
      array: eachDayOfInterval(interval(startDate, endDate)),
      format: formatDate,
    }
  }

  const weeks = differenceInWeeks(endDate, startDate)
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval(interval(startDate, endDate)),
      format: (date: Date) => {
        const start = max([startOfWeek(date), startDate])
        const end = min([endOfWeek(date), endDate])

        return `${formatDate(start)} - ${formatDate(end)}`
      },
    }
  }

  const months = differenceInMonths(endDate, startDate)
  if (months < 30) {
    return {
      array: eachMonthOfInterval(interval(startDate, endDate)),
      format: new Intl.DateTimeFormat("en", { month: "long", year: "numeric" })
        .format,
    }
  }

  return {
    array: eachYearOfInterval(interval(startDate, endDate)),
    format: new Intl.DateTimeFormat("en", { year: "numeric" }).format,
  }
}
