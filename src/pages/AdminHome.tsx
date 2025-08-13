import React, { useEffect } from "react";

const AdminHome = () => {
  useEffect(() => {
    document.title = "Admin | Confidential Connect";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Admin dashboard placeholder for managing orders and products.");
  }, []);

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">This is a placeholder. Once Supabase is connected, we can add orders, payments, and product management here.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Orders</h2>
            <p className="text-sm text-muted-foreground">Coming soon: view and confirm customer orders.</p>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Payments</h2>
            <p className="text-sm text-muted-foreground">Coming soon: verify payments and generate receipts.</p>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Products</h2>
            <p className="text-sm text-muted-foreground">Coming soon: manage products and pricing.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
