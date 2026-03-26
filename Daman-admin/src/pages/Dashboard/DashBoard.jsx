import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { FaShoppingCart, FaRupeeSign, FaUsers, FaTruck } from "react-icons/fa";
import ReportsButtons from "./components/ReportsButtons";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/damanorganic/dashboard_sats");
        setDashboardData(response.data.data); // Access the 'data' property from your response
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  if (!dashboardData) return <div className="p-5">No data available</div>;

  // Prepare stats from the API data
  const stats = [
    {
      title: "Total Sales",
      value: `Rs ${dashboardData.summaryStats.subTotal}`,
      icon: <FaRupeeSign className="text-blue-500" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: dashboardData.summaryStats.totalOrders,
      icon: <FaShoppingCart className="text-green-500" size={24} />,
      color: "bg-green-50",
    },
    {
      title: "Delivered Orders",
      value: dashboardData.summaryStats.deliveredOrders,
      icon: <FaShoppingCart className="text-pink-500" size={24} />,
      color: "bg-pink-50",
    },
    {
      title: "Total Customers",
      value: dashboardData.summaryStats.totalCustomers,
      icon: <FaUsers className="text-purple-500" size={24} />,
      color: "bg-purple-50",
    },
    {
      title: "Pending Orders",
      value: dashboardData.summaryStats.pendingOrders,
      icon: <FaTruck className="text-orange-500" size={24} />,
      color: "bg-orange-50",
    },
  ];

  // Prepare line chart data from monthly trends
  const salesData = dashboardData.monthlyTrends.map((month) => ({
    name: month.month.substring(0, 3), // Shorten month name to 3 letters
    sales: month.totalSales,
    orders: month.totalOrderCount,
  }));

  // Prepare pie chart data from status distribution
  const orderData = dashboardData.statusDistribution.map((status) => ({
    name: status.name,
    value: status.value,
  }));

  return (
    <div className="p-5 space-y-10">
      <h1 className="font-bold text-2xl">Dashboard Overview</h1>

      <motion.div
        className="flex flex-wrap gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.color} p-5 flex-1 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
            variants={item}
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-xl font-semibold mt-1">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ReportsButtons />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Line Chart */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-3">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                name="Sales (Rs)"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-3">
            Order Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {orderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  value,
                  `${name}: ${((props.payload.percent || 0) * 100).toFixed(
                    2
                  )}%`,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
