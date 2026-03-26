import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { message, DatePicker, Modal } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ReportsButtons = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dates, setDates] = useState([]);

  // API endpoints for each report
  const API_ENDPOINTS = {
    customer: "/api/damanorganic/customer_wise_sats_date",
    order: "/api/damanorganic/order_wise_sats_date",
    product: "/api/damanorganic/product_wise_sats_date",
  };

  // Animation for each button item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Animation for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Convert JSON to CSV
  function convertToCSV(data) {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers
        .map((header) => {
          // Handle nested objects if needed
          const value = obj[header];
          return `"${
            value !== undefined && value !== null
              ? String(value).replace(/"/g, '""')
              : ""
          }"`;
        })
        .join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  }

  // Download data as file
  function downloadData(data, fileName, type = "csv") {
    let content, mimeType;

    if (type === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
    } else {
      content = convertToCSV(data);
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Fetch data from API and download
  const fetchAndDownloadReport = async () => {
    if (!dates || dates.length !== 2) {
      message.warning("Please select a start and end date.");
      return;
    }
    try {
      const endpoint = API_ENDPOINTS[selectedReport];
      const fileName = `${selectedReport}-report`;

      if (!endpoint) {
        console.error("Invalid report type");
        return;
      }

      // Using Axios instead of fetch
      const response = await api.get(endpoint, {
        params: {
          startDate: dayjs(dates[0]).format("YYYY-MM-DD"),
          endDate: dayjs(dates[1]).format("YYYY-MM-DD"),
        },
      });

      // With Axios, the response data is in response.data
      if (response.data.code === 200) {
        const data = response.data.data.results;

        downloadData(data, fileName, "csv");
      } else {
        throw new Error(`Error fetching ${reportType} report`);
      }

      // Download the data as CSV
    } catch (error) {
      console.error(`Error fetching ${reportType} report:`, error);
      message.error(`Error fetching ${reportType} report:`, error);

      // Axios provides more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response:", error.response);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
      }

      // You might want to add user feedback here (e.g., toast notification)
    }
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.button
          className="text-center bg-blue-500 cursor-pointer text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedReport("customer");
            setIsModalVisible(true);
          }}
        >
          <motion.p className="font-medium">Customer Report</motion.p>
        </motion.button>

        <motion.button
          className="text-center bg-green-500 cursor-pointer text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedReport("order");
            setIsModalVisible(true);
          }}
        >
          <motion.p className="font-medium">Order Wise Report</motion.p>
        </motion.button>

        <motion.button
          className="text-center bg-purple-500 cursor-pointer text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedReport("product");
            setIsModalVisible(true);
          }}
        >
          <motion.p className="font-medium">Product Wise Report</motion.p>
        </motion.button>
      </motion.div>

      {/* Date Picker Modal */}
      <Modal
        title="Select Date Range"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={fetchAndDownloadReport}
        okText="Download Report"
      >
        <RangePicker
          style={{ width: "100%" }}
          format="YYYY-MM-DD"
          value={dates}
          onChange={(values) => setDates(values)}
        />
      </Modal>
    </>
  );
};

export default ReportsButtons;
