import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { saveBill, getNextBillNumber, Bill, BillItem } from '../utils/storage';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'sonner';

export default function AddBill() {
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billType, setBillType] = useState<'customer' | 'supplier'>('customer');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [villageCity, setVillageCity] = useState('');
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', itemName: '', quantity: 0, pricePerItem: 0, totalPrice: 0 },
  ]);
  const [discount, setDiscount] = useState(0);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await getNextBillNumber();
        if (!cancelled) setBillNumber(next);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || 'Failed to generate bill number');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemName: '',
        quantity: 0,
        pricePerItem: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'pricePerItem') {
            updated.totalPrice = updated.quantity * updated.pricePerItem;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalTotal = subtotal - discount;

  const handleSave = async () => {
    // Validation
    if (!name || !mobile || !villageCity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!billNumber) {
      toast.error('Bill number is not ready yet');
      return;
    }

    if (items.some((item) => !item.itemName || item.quantity <= 0 || item.pricePerItem <= 0)) {
      toast.error('Please fill in all item details');
      return;
    }

    const bill: Bill = {
      id: Date.now().toString(),
      billNumber,
      billDate,
      billType,
      name,
      mobile,
      villageCity,
      items,
      subtotal,
      discount,
      finalTotal,
    };

    try {
      await saveBill(bill);
      toast.success('Bill saved successfully!');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to save bill');
      return;
    }

    // Reset form
    window.location.reload();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          {/* Bill Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Bill Number</label>
              <input
                type="text"
                value={billNumber}
                disabled
                className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Bill Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Bill Type</label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value as 'customer' | 'supplier')}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="customer">Customer Bill</option>
                <option value="supplier">Supplier (Vepari) Bill</option>
              </select>
            </div>
          </div>

          {/* Customer/Supplier Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">{billType === 'customer' ? 'Customer' : 'Supplier'} Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Village / City *</label>
              <input
                type="text"
                value={villageCity}
                onChange={(e) => setVillageCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                placeholder="Enter village or city"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black">Items</h3>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black hover:bg-[#B8941F] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-[#F5E6D3]">
                  <tr>
                    <th className="px-4 py-3 text-left">Item Name</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Price Per Item</th>
                    <th className="px-4 py-3 text-left">Total Price</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                          placeholder="Enter item name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                          placeholder="0"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.pricePerItem || ''}
                          onChange={(e) => updateItem(item.id, 'pricePerItem', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="px-3 py-2 bg-gray-50 text-gray-700">
                          ₹{item.totalPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-96 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-xl text-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Discount:</span>
                <input
                  type="number"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-1 border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-right"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-between items-center py-3 bg-[#D4AF37]/10 px-4">
                <span className="text-lg text-black">Final Total:</span>
                <span className="text-2xl text-[#D4AF37]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#B8941F] transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Bill
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print Bill
            </button>
          </div>
        </motion.div>

        {/* Hidden Print Template */}
        <div style={{ display: 'none' }}>
          <div ref={printRef} className="p-8 bg-white">
            <div className="text-center mb-6">
              <h1 className="text-3xl mb-2" style={{ color: '#D4AF37' }}>VISHAL SELECTION</h1>
              <p className="text-sm">Bhatiya – Main Bazar</p>
              <p className="text-sm">Contact: 9925086503, 7046386503</p>
            </div>
            <div className="border-t-2 border-b-2 border-black py-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Bill No:</strong> {billNumber}</p>
                  <p><strong>Date:</strong> {new Date(billDate).toLocaleDateString()}</p>
                  <p><strong>Type:</strong> {billType === 'customer' ? 'Customer Bill' : 'Supplier Bill'}</p>
                </div>
                <div>
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Mobile:</strong> {mobile}</p>
                  <p><strong>Location:</strong> {villageCity}</p>
                </div>
              </div>
            </div>
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.itemName}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">₹{item.pricePerItem.toFixed(2)}</td>
                    <td className="text-right py-2">₹{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right">
              <p className="mb-1"><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
              <p className="mb-1"><strong>Discount:</strong> ₹{discount.toFixed(2)}</p>
              <p className="text-xl mt-2"><strong>Final Total:</strong> ₹{finalTotal.toFixed(2)}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
