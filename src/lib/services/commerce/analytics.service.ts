import { createAdminClient } from '@/lib/supabase/admin'

export class CommerceAnalyticsService {
  /**
   * Get store sales metrics and summary for merchant/headless portal
   */
  static async getStoreSummary(storeId: string) {
    const supabase = await createAdminClient()

    // 1. Total Orders & Total GMV
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('user_id', storeId)

    if (ordersErr) throw ordersErr

    const totalOrders = orders?.length || 0
    const totalSales = orders
      ?.filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0

    // 2. Active Products Count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', storeId)

    // 3. Customer Count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', storeId)

    return {
      total_sales: totalSales,
      total_orders: totalOrders,
      total_products: productCount || 0,
      total_customers: customerCount || 0
    }
  }
}
