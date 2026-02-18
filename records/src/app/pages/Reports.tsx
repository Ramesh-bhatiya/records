import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar, TrendingUp, Receipt, Users, Truck } from 'lucide-react';
import { getReportData } from '../utils/storage';
import AdminLayout from '../components/AdminLayout';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalPurchases: 0,
    billCount: 0,
    bills: [],
  } as Awaited<ReturnType<typeof getReportData>>);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getReportData(selectedPeriod);
      if (!cancelled) setReportData(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  };

  const handleDownloadPDF = () => {
    // Create a simple PDF-like report in a new window
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const periodLabels = {
      today: "Today's Report",
      week: "Weekly Report",
      month: "Monthly Report",
      year: "Yearly Report",
    };

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${periodLabels[selectedPeriod]} - Vishal Selection</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-center;
              margin-bottom: 40px;
              border-bottom: 3px solid #D4AF37;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #D4AF37;
              margin: 0;
              font-size: 32px;
              letter-spacing: 2px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .report-info {
              margin-bottom: 30px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
            }
            .stat-card h3 {
              margin: 0 0 10px 0;
              color: #666;
              font-size: 14px;
            }
            .stat-card .value {
              font-size: 28px;
              font-weight: bold;
              color: #000;
            }
            .bills-section {
              margin-top: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #000;
              color: #F5E6D3;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>VISHAL SELECTION</h1>
            <p>Bhatiya – Main Bazar</p>
            <p>Contact: 9925086503, 7046386503</p>
          </div>
          
          <div class="report-info">
            <h2>${periodLabels[selectedPeriod]}</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Sales</h3>
              <div class="value">₹${reportData.totalSales.toLocaleString('en-IN')}</div>
            </div>
            <div class="stat-card">
              <h3>Total Purchases</h3>
              <div class="value">₹${reportData.totalPurchases.toLocaleString('en-IN')}</div>
            </div>
            <div class="stat-card">
              <h3>Total Bills</h3>
              <div class="value">${reportData.billCount}</div>
            </div>
          </div>
          
          <div class="bills-section">
            <h3>Bill Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.bills
                  .map(
                    (bill) => `
                  <tr>
                    <td>${bill.billNumber}</td>
                    <td>${new Date(bill.billDate).toLocaleDateString()}</td>
                    <td>${bill.billType === 'customer' ? 'Customer' : 'Supplier'}</td>
                    <td>${bill.name}</td>
                    <td>${bill.mobile}</td>
                    <td>₹${bill.finalTotal.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>© 2026 Vishal Selection. All rights reserved.</p>
            <p>This is a computer-generated report.</p>
          </div>
        </body>
      </html>
    `);

    reportWindow.document.close();
    setTimeout(() => {
      reportWindow.print();
    }, 500);
  };

  const periodButtons = [
    { value: 'today', label: 'Today', icon: Calendar },
    { value: 'week', label: 'This Week', icon: Calendar },
    { value: 'month', label: 'This Month', icon: Calendar },
    { value: 'year', label: 'This Year', icon: Calendar },
  ] as const;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Period Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          <div className="flex flex-wrap gap-3">
            {periodButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.value}
                  onClick={() => handlePeriodChange(button.value)}
                  className={`flex items-center gap-2 px-6 py-3 border-2 transition-all ${
                    selectedPeriod === button.value
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                      : 'border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {button.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Total Sales</p>
                <p className="text-3xl text-green-900">₹{reportData.totalSales.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Purchases</p>
                <p className="text-3xl text-blue-900">₹{reportData.totalPurchases.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D5BF] border border-[#D4AF37]/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#B8941F] mb-1">Total Bills</p>
                <p className="text-3xl text-black">{reportData.billCount}</p>
              </div>
              <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-black" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Download Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl mb-2 text-black">Download Report</h3>
              <p className="text-gray-600">Export your report for record keeping</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#B8941F] transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Bills List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#D4AF37]/20 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl text-black">Bill Details</h3>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {reportData.bills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No bills found for this period
                    </td>
                  </tr>
                ) : (
                  reportData.bills.map((bill) => (
                    <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{bill.billNumber}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
