import { supabase } from './supabaseClient';

// Types (UI-level)
export interface BillItem {
  id: string;
  itemName: string;
  quantity: number;
  pricePerItem: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  billDate: string; // YYYY-MM-DD
  billType: 'customer' | 'supplier';
  name: string;
  mobile: string;
  villageCity: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  finalTotal: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  villageCity: string;
  totalPurchases: number;
  billCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  mobile: string;
  city: string;
  totalPurchaseAmount: number;
  billCount: number;
}

// LocalStorage keys (used only for one-time migration)
const BILLS_KEY = 'vishal_selection_bills';
const BILL_COUNTER_KEY = 'vishal_selection_bill_counter';

function isoDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function safeId(prefix = '') {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return prefix ? `${prefix}_${id}` : id;
}

function parseVsNumber(billNumber: string): number | null {
  const match = /^VS(\d+)$/.exec(billNumber.trim());
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

type BillsRow = {
  id: string;
  bill_number: string;
  bill_date: string;
  bill_type: 'customer' | 'supplier';
  name: string;
  mobile: string;
  village_city: string;
  subtotal: number;
  discount: number;
  final_total: number;
  items?: BillItemsRow[];
  bill_items?: BillItemsRow[];
};

type BillItemsRow = {
  id: string;
  bill_id: string;
  item_name: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
};

function mapBillRowToBill(row: BillsRow): Bill {
  const items = (row.items ?? row.bill_items ?? []) as BillItemsRow[];
  return {
    id: row.id,
    billNumber: row.bill_number,
    billDate: row.bill_date,
    billType: row.bill_type,
    name: row.name,
    mobile: row.mobile,
    villageCity: row.village_city,
    items: items.map((it) => ({
      id: it.id,
      itemName: it.item_name,
      quantity: Number(it.quantity),
      pricePerItem: Number(it.price_per_item),
      totalPrice: Number(it.total_price),
    })),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    finalTotal: Number(row.final_total),
  };
}

export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase
    .from('bills')
    .select(
      'id,bill_number,bill_date,bill_type,name,mobile,village_city,subtotal,discount,final_total,items:bill_items(id,bill_id,item_name,quantity,price_per_item,total_price)'
    )
    .order('bill_date', { ascending: false });

  if (error) {
    console.error('getBills failed', error);
    return [];
  }

  return (data as BillsRow[]).map(mapBillRowToBill);
}

export async function saveBill(bill: Bill): Promise<void> {
  const { error: billError } = await supabase.from('bills').upsert({
    id: bill.id,
    bill_number: bill.billNumber,
    bill_date: bill.billDate,
    bill_type: bill.billType,
    name: bill.name,
    mobile: bill.mobile,
    village_city: bill.villageCity,
    subtotal: bill.subtotal,
    discount: bill.discount,
    final_total: bill.finalTotal,
  });

  if (billError) {
    throw billError;
  }

  // Replace items (simple + reliable for this app)
  const { error: deleteError } = await supabase.from('bill_items').delete().eq('bill_id', bill.id);
  if (deleteError) {
    throw deleteError;
  }

  const itemsPayload = bill.items.map((item) => ({
    id: item.id || safeId('item'),
    bill_id: bill.id,
    item_name: item.itemName,
    quantity: item.quantity,
    price_per_item: item.pricePerItem,
    total_price: item.totalPrice,
  }));

  const { error: insertError } = await supabase.from('bill_items').insert(itemsPayload);
  if (insertError) {
    throw insertError;
  }
}

export async function deleteBill(billId: string): Promise<void> {
  const { error } = await supabase.from('bills').delete().eq('id', billId);
  if (error) {
    throw error;
  }
}

export async function getNextBillNumber(): Promise<string> {
  const { data, error } = await supabase.rpc('next_bill_number');
  if (error) {
    throw error;
  }
  return String(data);
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('bills')
    .select('id,name,mobile,village_city,final_total')
    .eq('bill_type', 'customer');

  if (error) {
    console.error('getCustomers failed', error);
    return [];
  }

  const byMobile = new Map<string, Customer>();
  for (const row of data as any[]) {
    const mobile = String(row.mobile);
    const existing = byMobile.get(mobile);
    if (existing) {
      existing.totalPurchases += Number(row.final_total);
      existing.billCount += 1;
    } else {
      byMobile.set(mobile, {
        id: String(row.id),
        name: String(row.name),
        mobile,
        villageCity: String(row.village_city),
        totalPurchases: Number(row.final_total),
        billCount: 1,
      });
    }
  }

  return Array.from(byMobile.values());
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('bills')
    .select('id,name,mobile,village_city,final_total')
    .eq('bill_type', 'supplier');

  if (error) {
    console.error('getSuppliers failed', error);
    return [];
  }

  const byMobile = new Map<string, Supplier>();
  for (const row of data as any[]) {
    const mobile = String(row.mobile);
    const existing = byMobile.get(mobile);
    if (existing) {
      existing.totalPurchaseAmount += Number(row.final_total);
      existing.billCount += 1;
    } else {
      byMobile.set(mobile, {
        id: String(row.id),
        name: String(row.name),
        mobile,
        city: String(row.village_city),
        totalPurchaseAmount: Number(row.final_total),
        billCount: 1,
      });
    }
  }

  return Array.from(byMobile.values());
}

export async function getReportData(period: 'today' | 'week' | 'month' | 'year') {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  switch (period) {
    case 'today':
      start = new Date(now);
      end = new Date(now);
      break;
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = new Date(now);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now);
      break;
  }

  const { data, error } = await supabase
    .from('bills')
    .select(
      'id,bill_number,bill_date,bill_type,name,mobile,village_city,subtotal,discount,final_total,items:bill_items(id,bill_id,item_name,quantity,price_per_item,total_price)'
    )
    .gte('bill_date', isoDateOnly(start))
    .lte('bill_date', isoDateOnly(end));

  if (error) {
    console.error('getReportData failed', error);
    return { totalSales: 0, totalPurchases: 0, billCount: 0, bills: [] as Bill[] };
  }

  const bills = (data as BillsRow[]).map(mapBillRowToBill);

  const totalSales = bills
    .filter((b) => b.billType === 'customer')
    .reduce((sum, b) => sum + b.finalTotal, 0);

  const totalPurchases = bills
    .filter((b) => b.billType === 'supplier')
    .reduce((sum, b) => sum + b.finalTotal, 0);

  return {
    totalSales,
    totalPurchases,
    billCount: bills.length,
    bills,
  };
}

export async function migrateLocalStorageToSupabaseIfNeeded(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  const migratedFlagKey = `vishal_selection_migrated_supabase_${user.id}`;
  if (localStorage.getItem(migratedFlagKey) === 'true') return;

  const rawBills = localStorage.getItem(BILLS_KEY);
  if (!rawBills) {
    localStorage.setItem(migratedFlagKey, 'true');
    return;
  }

  let bills: Bill[] = [];
  try {
    bills = JSON.parse(rawBills);
  } catch {
    return;
  }

  if (!Array.isArray(bills) || bills.length === 0) {
    localStorage.setItem(migratedFlagKey, 'true');
    return;
  }

  // Upload bills
  for (const b of bills) {
    const bill: Bill = {
      ...b,
      id: b.id || safeId('bill'),
      items: Array.isArray(b.items)
        ? b.items.map((it) => ({
            ...it,
            id: it.id || safeId('item'),
          }))
        : [],
    };
    await saveBill(bill);
  }

  // Try to keep the counter aligned to highest VS number
  const maxVs = bills
    .map((b) => parseVsNumber(b.billNumber))
    .filter((n): n is number => typeof n === 'number')
    .reduce((max, n) => Math.max(max, n), 1000);

  await supabase
    .from('bill_counters')
    .upsert({ owner_id: user.id, counter: maxVs, updated_at: new Date().toISOString() }, { onConflict: 'owner_id' });

  // Mark migrated (do not delete localStorage, to avoid accidental data loss)
  localStorage.setItem(migratedFlagKey, 'true');

  // Old counter key is no longer used by the app; keep it as-is.
  void BILL_COUNTER_KEY;
}
