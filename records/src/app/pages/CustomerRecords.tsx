import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, X, Receipt } from 'lucide-react';
import { getCustomers, getBills, Customer, Bill } from '../utils/storage';
import AdminLayout from '../components/AdminLayout';

export default function CustomerRecords() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBills, setCustomerBills] = useState<Bill[]>([]);

  useEffect(() => {
    void loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    const allCustomers = await getCustomers();
    // Sort by total purchases (highest first)
    allCustomers.sort((a, b) => b.totalPurchases - a.totalPurchases);
    setCustomers(allCustomers);
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.mobile.includes(term) ||
        customer.villageCity.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const viewCustomerHistory = async (customer: Customer) => {
    setSelectedCustomer(customer);
    const allBills = await getBills();
    const bills = allBills.filter(
      (bill) => bill.mobile === customer.mobile && bill.billType === 'customer'
    );
    bills.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());
    setCustomerBills(bills);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Total Customers: {filteredCustomers.length}</span>
            <span>
              Total Sales: ₹{filteredCustomers.reduce((sum, c) => sum + c.totalPurchases, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </motion.div>

        {/* Customers Table */}
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
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-right">Total Purchases</th>
                  <th className="px-4 py-3 text-center">Bills</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewCustomerHistory(customer)}
                          className="text-[#D4AF37] hover:text-[#B8941F] hover:underline"
                        >
                          {customer.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">{customer.mobile}</td>
                      <td className="px-4 py-3">{customer.villageCity}</td>
                      <td className="px-4 py-3 text-right">₹{customer.totalPurchases.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37]">
                          {customer.billCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => viewCustomerHistory(customer)}
                            className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                            title="View History"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* Customer History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-black text-[#F5E6D3] px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-xl">{selectedCustomer.name}</h3>
                <p className="text-sm text-[#F5E6D3]/70">{selectedCustomer.mobile}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#F5E6D3] hover:text-[#D4AF37] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Customer Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#D4AF37]/10 p-4 border border-[#D4AF37]/30">
                  <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
                  <p className="text-2xl text-[#D4AF37]">₹{selectedCustomer.totalPurchases.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Bills</p>
                  <p className="text-2xl text-black">{selectedCustomer.billCount}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-lg text-black">{selectedCustomer.villageCity}</p>
                </div>
              </div>

              {/* Bill History */}
              <div>
                <h4 className="text-lg mb-4 text-black flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Bill History
                </h4>
                {customerBills.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bills found</p>
                ) : (
                  <div className="space-y-3">
                    {customerBills.map((bill) => (
                      <div key={bill.id} className="border border-gray-200 p-4 hover:border-[#D4AF37]/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Bill Number</p>
                            <p className="text-lg text-[#D4AF37]">{bill.billNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-black">{new Date(bill.billDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Items</p>
                              <p className="text-sm text-gray-800">
                                {bill.items.map((item) => item.itemName).join(', ')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Amount</p>
                              <p className="text-xl text-black">₹{bill.finalTotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
