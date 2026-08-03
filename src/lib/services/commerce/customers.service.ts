import { createAdminClient } from '@/lib/supabase/admin'

export interface CreateCustomerPayload {
  name: string
  phone: string
  email?: string
  whatsapp?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  pincode?: string
  notes?: string
}

export class CommerceCustomersService {
  /**
   * Get customers for store tenant
   */
  static async getCustomers(storeId: string, phone?: string) {
    const supabase = await createAdminClient()
    let query = supabase
      .from('customers')
      .select('*')
      .eq('user_id', storeId)
      .eq('is_deleted', false)

    if (phone && phone.trim()) {
      query = query.eq('phone', phone.trim())
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  /**
   * Create or update customer record for store tenant
   */
  static async createOrUpdateCustomer(storeId: string, payload: CreateCustomerPayload) {
    const supabase = await createAdminClient()

    // Check existing by phone
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', storeId)
      .eq('phone', payload.phone.trim())
      .single()

    if (existing) {
      const { data: updated, error: updateErr } = await supabase
        .from('customers')
        .update({
          name: payload.name.trim(),
          email: payload.email || null,
          whatsapp: payload.whatsapp || null,
          address_line1: payload.address_line1 || null,
          address_line2: payload.address_line2 || null,
          city: payload.city || null,
          state: payload.state || null,
          pincode: payload.pincode || null,
          notes: payload.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      if (updateErr) throw updateErr
      return updated
    }

    const { data: newCust, error: insertErr } = await supabase
      .from('customers')
      .insert({
        user_id: storeId,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email || null,
        whatsapp: payload.whatsapp || null,
        address_line1: payload.address_line1 || null,
        address_line2: payload.address_line2 || null,
        city: payload.city || null,
        state: payload.state || null,
        pincode: payload.pincode || null,
        notes: payload.notes || null
      })
      .select('*')
      .single()

    if (insertErr) throw insertErr
    return newCust
  }
}
