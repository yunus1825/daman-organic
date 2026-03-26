import express from "express";
import {
    getSalesOrderStats,
    getOrderStatusPieChart,
    getSalesByMonthly,
    getCustomerWiseData,
    getOrderWiseData,
    getProductWiseData,
    getDashboardStats,
    getCustomerWiseDatawithdate,
    getOrderWiseDatawithdate,
    getProductWiseDatawithdate

    
} from "../controllers/Reports.controller.js";

const router = express.Router();

router.get("/total_sats", getSalesOrderStats);
router.get("/status_count_pie_charts",getOrderStatusPieChart);
router.get("/sales_by_monthly", getSalesByMonthly);
router.get("/customer_wise_sats", getCustomerWiseData);
router.get("/order_wise_sats", getOrderWiseData);
router.get("/product_wise_sats", getProductWiseData);
router.get("/dashboard_sats", getDashboardStats);
router.get("/customer_wise_sats_date", getCustomerWiseDatawithdate);
router.get("/order_wise_sats_date", getOrderWiseDatawithdate);
router.get("/product_wise_sats_date", getProductWiseDatawithdate);









export default router;


