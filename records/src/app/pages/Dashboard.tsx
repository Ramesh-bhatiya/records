import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Truck, DollarSign, Receipt } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBills, getCustomers, getSuppliers, getReportData } from '../utils/storage';
import AdminLayout from '../components/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [today, week, month, year, customers, suppliers, bills] = await Promise.all([
        getReportData('today'),
        getReportData('week'),
        getReportData('month'),
        getReportData('year'),
        getCustomers(),
        getSuppliers(),
        getBills(),
      ]);

      if (cancelled) return;

      setStats({
        todaySales: today.totalSales,
        weeklySales: week.totalSales,
        monthlySales: month.totalSales,
        yearlySales: year.totalSales,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        totalRevenue: year.totalSales,
      });

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        const dayBills = bills.filter(
          (bill) => new Date(bill.billDate).toDateString() === dateStr && bill.billType === 'customer'
        );

        const total = dayBills.reduce((sum, bill) => sum + bill.finalTotal, 0);

        last7Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: total,
        });
      }
      setChartData(last7Days);
    })().catch((e) => console.error(e));

    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    {
      title: 'Today Sales',
      value: `₹${stats.todaySales.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: '#D4AF37',
      bgColor: '#D4AF37',
    },
    {
      title: 'Weekly Sales',
      value: `₹${stats.weeklySales.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: '#B8941F',
      bgColor: '#B8941F',
    },
    {
      title: 'Monthly Sales',
      value: `₹${stats.monthlySales.toLocaleString('en-IN')}`,
      icon: Receipt,
      color: '#000000',
      bgColor: '#000000',
    },
    {
      title: 'Yearly Sales',
      value: `₹${stats.yearlySales.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: '#D4AF37',
      bgColor: '#D4AF37',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: '#B8941F',
      bgColor: '#B8941F',
    },
    {
      title: 'Total Suppliers',
      value: stats.totalSuppliers.toString(),
      icon: Truck,
      color: '#000000',
      bgColor: '#000000',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-[#D4AF37]/20 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl text-black">{stat.value}</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.bgColor}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: stat.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white border border-[#D4AF37]/20 p-6"
        >
          <h3 className="text-xl mb-6 text-black">Last 7 Days Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.1} />
              <XAxis dataKey="date" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  border: '1px solid #D4AF37',
                  borderRadius: '4px',
                  color: '#F5E6D3',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#D4AF37"
                strokeWidth={3}
                dot={{ fill: '#D4AF37', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-gradient-to-r from-black to-[#1A1A1A] border border-[#D4AF37]/20 p-8 text-center"
        >
          <h3 className="text-2xl mb-4 text-[#D4AF37]">Welcome to Vishal Selection Admin</h3>
          <p className="text-[#F5E6D3]/70 mb-6">Manage your billing, customers, and suppliers efficiently</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/admin/add-bill"
              className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#B8941F] transition-colors tracking-wide"
            >
              Create New Bill
            </a>
            <a
              href="/admin/bills"
              className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors tracking-wide"
            >
              View All Bills
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
