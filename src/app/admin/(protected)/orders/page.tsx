import { OrdersDashboard } from "@/components/orders-dashboard";
import { getOrders } from "@/lib/store";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="px-5 pt-4 pb-1 md:px-8">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>
      <OrdersDashboard orders={orders} />
    </div>
  );
}
