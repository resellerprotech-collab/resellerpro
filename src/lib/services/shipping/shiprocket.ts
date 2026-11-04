/**
 * ResellerPro Shiprocket Integration Service
 * 
 * Provides end-to-end integration with the official Shiprocket API v2:
 * - Authentication (JWT token)
 * - Pickup locations lookup
 * - Ad-hoc order creation
 * - Courier assignment & AWB generation
 * - PDF shipping label generation
 * - Doorstep pickup request scheduling
 */

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

export interface ShiprocketPickupLocation {
  id?: number
  pickup_location: string
  address: string
  city: string
  state: string
  pin_code: string | number
  phone: string
  name?: string
}

export interface ShiprocketOrderItem {
  name: string
  sku?: string
  units: number
  selling_price: number
  discount?: number
  tax?: number
}

export interface CreateShiprocketOrderParams {
  orderNumber: string | number
  orderDate: string // YYYY-MM-DD HH:mm
  pickupLocation: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  items: ShiprocketOrderItem[]
  paymentMethod: 'Prepaid' | 'COD'
  totalAmount: number
  weight?: number // kg (default 0.5)
  dimensions?: {
    length?: number // cm
    breadth?: number // cm
    height?: number // cm
  }
}

export interface ShiprocketOrderResult {
  success: boolean
  orderId?: number
  shipmentId?: number
  awbCode?: string
  courierName?: string
  labelUrl?: string
  pickupScheduled?: boolean
  error?: string
}

/**
 * 1. Authenticate with Shiprocket API and retrieve JWT token
 */
export async function loginToShiprocket(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok || !data.token) {
      const errorMessage =
        data.message ||
        (data.errors ? JSON.stringify(data.errors) : 'Invalid Shiprocket credentials')
      return { success: false, error: errorMessage }
    }

    return {
      success: true,
      token: data.token,
    }
  } catch (error: any) {
    console.error('Shiprocket login error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to connect to Shiprocket servers',
    }
  }
}

/**
 * 2. Fetch all registered pickup locations/warehouses for this seller's account
 */
export async function fetchPickupLocations(
  token: string
): Promise<{ success: boolean; locations?: ShiprocketPickupLocation[]; error?: string }> {
  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/settings/company/pickup`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch Shiprocket pickup locations',
      }
    }

    const shippingAddresses = data.data?.shipping_address || []

    const locations: ShiprocketPickupLocation[] = shippingAddresses.map((addr: any) => ({
      id: addr.id,
      pickup_location: addr.pickup_location,
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      pin_code: addr.pin_code || '',
      phone: addr.phone || '',
      name: addr.name || addr.pickup_location,
    }))

    return {
      success: true,
      locations,
    }
  } catch (error: any) {
    console.error('Shiprocket pickup locations error:', error)
    return {
      success: false,
      error: error?.message || 'Error fetching pickup locations',
    }
  }
}

/**
 * 3. Create Ad-hoc Order in Shiprocket
 */
export async function createShiprocketAdhocOrder(
  token: string,
  params: CreateShiprocketOrderParams
): Promise<{ success: boolean; orderId?: number; shipmentId?: number; error?: string }> {
  try {
    // Split customer name into first and last name
    const nameParts = params.customerName.trim().split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || ''

    // Ensure weight is formatted in kg
    const weight = params.weight && params.weight > 0 ? params.weight : 0.5
    const length = params.dimensions?.length || 10
    const breadth = params.dimensions?.breadth || 10
    const height = params.dimensions?.height || 5

    const orderPayload = {
      order_id: String(params.orderNumber),
      order_date: params.orderDate,
      pickup_location: params.pickupLocation,
      channel_id: '',
      comment: 'ResellerPro Auto Dispatch',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: params.shippingAddress.line1,
      billing_address_2: params.shippingAddress.line2 || '',
      billing_city: params.shippingAddress.city,
      billing_pincode: String(params.shippingAddress.pincode).replace(/\D/g, ''),
      billing_state: params.shippingAddress.state,
      billing_country: 'India',
      billing_email: params.customerEmail || 'orders@resellerpro.in',
      billing_phone: String(params.customerPhone).replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: params.items.map((item, idx) => ({
        name: item.name || `Item ${idx + 1}`,
        sku: item.sku || `SKU-${params.orderNumber}-${idx + 1}`,
        units: item.units || 1,
        selling_price: item.selling_price || 0,
        discount: item.discount || 0,
        tax: item.tax || 0,
      })),
      payment_method: params.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: params.totalAmount,
      length,
      breadth,
      height,
      weight,
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    })

    const data = await res.json()

    if (!res.ok || (!data.order_id && !data.shipment_id)) {
      const errMsg =
        data.message ||
        (data.errors ? JSON.stringify(data.errors) : 'Failed to create Shiprocket order')
      return { success: false, error: errMsg }
    }

    return {
      success: true,
      orderId: data.order_id,
      shipmentId: data.shipment_id,
    }
  } catch (error: any) {
    console.error('Shiprocket order creation error:', error)
    return {
      success: false,
      error: error?.message || 'Network error creating Shiprocket order',
    }
  }
}

/**
 * 4. Assign Courier & Generate AWB Code
 */
export async function assignCourierAWB(
  token: string,
  shipmentId: number,
  courierId?: number
): Promise<{ success: boolean; awbCode?: string; courierName?: string; error?: string }> {
  try {
    const payload: any = { shipment_id: shipmentId }
    if (courierId) {
      payload.courier_id = courierId
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || data.status_code === 400) {
      return {
        success: false,
        error: data.message || 'Failed to assign courier partner',
      }
    }

    const responseData = data.response?.data
    const awbCode = responseData?.awb_code
    const courierName = responseData?.courier_name || 'Shiprocket Partner'

    if (!awbCode) {
      return {
        success: false,
        error: data.message || 'Courier assigned but AWB code not generated',
      }
    }

    return {
      success: true,
      awbCode,
      courierName,
    }
  } catch (error: any) {
    console.error('Shiprocket AWB assignment error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to assign courier',
    }
  }
}

/**
 * 5. Generate Printable Shipping Label (PDF)
 */
export async function generateShippingLabel(
  token: string,
  shipmentIds: number[]
): Promise<{ success: boolean; labelUrl?: string; error?: string }> {
  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/generate/label`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id: shipmentIds }),
    })

    const data = await res.json()

    if (!res.ok || !data.label_url) {
      return {
        success: false,
        error: data.message || 'Failed to generate shipping label PDF',
      }
    }

    return {
      success: true,
      labelUrl: data.label_url,
    }
  } catch (error: any) {
    console.error('Shiprocket label error:', error)
    return {
      success: false,
      error: error?.message || 'Error generating shipping label',
    }
  }
}

/**
 * 6. Request Doorstep Courier Pickup
 */
export async function requestDoorstepPickup(
  token: string,
  shipmentIds: number[]
): Promise<{ success: boolean; scheduledDate?: string; tokenNumber?: string; error?: string }> {
  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/pickup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id: shipmentIds }),
    })

    const data = await res.json()

    const pickupResponse = data.response
    return {
      success: true,
      scheduledDate: pickupResponse?.pickup_scheduled_date,
      tokenNumber: pickupResponse?.pickup_token_number,
    }
  } catch (error: any) {
    console.error('Shiprocket pickup generation error:', error)
    // Non-fatal, order and label are already created
    return {
      success: false,
      error: error?.message || 'Pickup scheduling pending',
    }
  }
}

