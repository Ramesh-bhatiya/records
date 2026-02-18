import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Eye, Edit, Trash2, X } from 'lucide-react';
import { getBills, deleteBill, Bill } from '../utils/storage';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'sonner';

export default function BillRecords() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    void loadBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, searchTerm, filterType]);

  const loadBills = async () => {
    const allBills = await getBills();
    setBills(allBills);
  };

  const filterBills = () => {
    let filtered = bills;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((bill) => bill.billType === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bill) =>
          bill.name.toLowerCase().includes(term) ||
          bill.mobile.includes(term) ||
          bill.villageCity.toLowerCase().includes(term) ||
          bill.billNumber.toLowerCase().includes(term)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());

    setFilteredBills(filtered);
  };

  const handleDelete = async (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBill(billId);
        await loadBills();
        toast.success('Bill deleted successfully');
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || 'Failed to delete bill');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, mobile, location, or bill number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'customer' | 'supplier')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Bills</option>
                <option value="customer">Customer Bills</option>
                <option value="supplier">Supplier Bills</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Total Bills: {filteredBills.length}</span>
            <span>Total Amount: ₹{filteredBills.reduce((sum, bill) => sum + bill.finalTotal, 0).toLocaleString('en-IN')}</span>
          </div>
        </motion.div>

        {/* Bills Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#D4AF37]/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-[#F5E6D3]">
                <tr>
                  <th className="px-4 py-3 text-left">Bill No.</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No bills found
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="text-[#D4AF37] hover:text-[#B8941F] hover:underline"
                        >
                          {bill.billNumber}
                        </button>
                      </td>
                      <td className="px-4 py-3">{new Date(bill.billDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs ${
                            bill.billType === 'customer'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {bill.billType === 'customer' ? 'Customer' : 'Supplier'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{bill.name}</td>
                      <td className="px-4 py-3">{bill.mobile}</td>
                      <td className="px-4 py-3">{bill.villageCity}</td>
                      <td className="px-4 py-3 text-right">₹{bill.finalTotal.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedBill(bill)}
                            className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bill.id)}
                            className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-black text-[#F5E6D3] px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl">Bill Details</h3>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-[#F5E6D3] hover:text-[#D4AF37] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bill Number</p>
                  <p className="text-lg text-black">{selectedBill.billNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg text-black">{new Date(selectedBill.billDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bill Type</p>
                  <p className="text-lg text-black">
                    {selectedBill.billType === 'customer' ? 'Customer Bill' : 'Supplier Bill'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="text-lg text-black">{selectedBill.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mobile</p>
                  <p className="text-lg text-black">{selectedBill.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-lg text-black">{selectedBill.villageCity}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="text-lg mb-4 text-black">Items</h4>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Item Name</th>
                      <th className="px-4 py-2 text-center text-sm">Qty</th>
                      <th className="px-4 py-2 text-right text-sm">Price</th>
                      <th className="px-4 py-2 text-right text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">{item.itemName}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">₹{item.pricePerItem.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">₹{item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-black">₹{selectedBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Discount:</span>
                  <span className="text-black">₹{selectedBill.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-lg text-black">Final Total:</span>
                  <span className="text-2xl text-[#D4AF37]">₹{selectedBill.finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
