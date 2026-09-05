import { OrdersDashboard } from "@/components/orders-dashboard";
import { getOrders } from "@/lib/store";

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div>
      <div className="px-5 pt-4 pb-1 md:px-8">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>
      <OrdersDashboard orders={orders} />
    </div>
  );
}
