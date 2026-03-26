import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import withLayout from "../../components/withLayout";
import { useParams } from "react-router-dom";

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const { tab } = useParams();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]); // run whenever `tab` changes
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen   py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">
            Daman Organic Living Policies
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            Last updated: April 1, 2025
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap  justify-center mb-5 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {["terms", "privacy", "refund"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full cursor-pointer sm:w-auto text-center px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-primary hover:bg-primaryLight/20"
              }`}
            >
              {tab === "privacy" && "Privacy Policy"}
              {tab === "terms" && "Terms & Conditions"}
              {tab === "refund" && "Refund Policy"}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden"
        >
          {/* Privacy Policy */}
          {activeTab === "privacy" && (
            <motion.div variants={tabVariants}>
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-primaryLight"
              >
                Privacy Policy
              </motion.h2>

              <motion.p variants={itemVariants} className="text-gray-700 mb-6">
                At Daman Organic Living (www.damanorganic.com), we value and
                respect your privacy. This Privacy Policy outlines how we
                collect, use, disclose, and protect your information when you
                visit our website or make a purchase from us.
              </motion.p>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Information We Collect:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Personal Information:</span>{" "}
                    Name, address, phone number, email address, payment
                    information.
                  </li>
                  <li>
                    <span className="font-medium">
                      Non-Personal Information:
                    </span>{" "}
                    Browser type, IP address, referring site, and browsing
                    behavior.
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  How We Use Your Information:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To process and fulfill orders.</li>
                  <li>To improve our website and customer service.</li>
                  <li>To send transactional communications and updates.</li>
                  <li>To respond to inquiries and provide support.</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Sharing of Information:
                </h3>
                <p className="text-gray-700">
                  We do not sell or rent your personal data. We may share your
                  information with third-party service providers for delivery,
                  payment processing, and analytics, under strict
                  confidentiality agreements.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Data Security:
                </h3>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures
                  to protect your data from unauthorized access or disclosure.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Cookies:
                </h3>
                <p className="text-gray-700">
                  We use cookies to enhance your browsing experience. You can
                  manage cookie preferences through your browser settings.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Your Rights:
                </h3>
                <p className="text-gray-700">
                  You may access, correct, or request deletion of your personal
                  data by contacting us at
                  <a
                    href="mailto:info@damanorganic.com"
                    className="text-primary font-medium ml-1"
                  >
                    info@damanorganic.com
                  </a>
                  .
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Contact Us:
                </h3>
                <p className="text-gray-700 mb-2">
                  For questions regarding this policy, contact us at:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <a
                    href="mailto:info@damanorganic.com"
                    className="flex items-center text-primary font-medium"
                  >
                    <span className="mr-2">📧</span> info@damanorganic.com
                  </a>
                  <a
                    href="tel:+917032033366"
                    className="flex items-center text-primary font-medium"
                  >
                    <span className="mr-2">📞</span> +91 7032033366
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Terms & Conditions */}
          {activeTab === "terms" && (
            <motion.div variants={tabVariants}>
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-primaryLight"
              >
                Terms & Conditions
              </motion.h2>

              <motion.p variants={itemVariants} className="text-gray-700 mb-6">
                Welcome to www.damanorganic.com. By accessing or using our
                website, you agree to comply with the following Terms and
                Conditions:
              </motion.p>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  1. Account Responsibility
                </h3>
                <p className="text-gray-700">
                  Customers are responsible for maintaining the confidentiality
                  of their account and password. All activities under your
                  account are your responsibility.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  2. Product Information
                </h3>
                <p className="text-gray-700">
                  All products listed are Organic Certified/ Natural and
                  described as accurately as possible. Images are for reference
                  only and actual products may vary slightly.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  3. Pricing & Payment
                </h3>
                <p className="text-gray-700">
                  Prices are inclusive of applicable taxes. We accept secure
                  payments via recognized online gateways.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  4. Delivery
                </h3>
                <p className="text-gray-700">
                  We aim to deliver within the stipulated timelines. However,
                  delays may occur due to unforeseen circumstances. Delivery
                  will be made to the address provided at the time of order.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  5. Order Cancellation
                </h3>
                <p className="text-gray-700">
                  Orders can be cancelled before dispatch. Post-dispatch,
                  cancellation is not applicable to fruits and vegetables.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  6. Intellectual Property
                </h3>
                <p className="text-gray-700">
                  All content on this website is the property of Daman Organic
                  Living and may not be used without permission.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  7. Limitation of Liability
                </h3>
                <p className="text-gray-700">
                  We shall not be held liable for indirect, incidental, or
                  consequential damages from the use of our products or website.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  8. Jurisdiction
                </h3>
                <p className="text-gray-700">
                  All disputes are subject to the jurisdiction of courts in
                  Hyderabad, India.
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Refund Policy */}
          {activeTab === "refund" && (
            <motion.div variants={tabVariants}>
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-primaryLight"
              >
                Refund & Return Policy
              </motion.h2>

              <motion.p variants={itemVariants} className="text-gray-700 mb-6">
                Effective Date: 1st April 2025. We aim to provide the freshest
                and highest-quality organic products. However, due to the nature
                of our offerings, please refer to the return and refund policy
                below:
              </motion.p>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Fruits & Vegetables, Milk etc
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    As these items are highly perishable, returns are not
                    accepted.
                  </li>
                  <li>
                    Customers are requested to inspect products at the time of
                    delivery and raise any concerns immediately.
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Grocery and Other Home Needs
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Returns are accepted within 24 hours of delivery.</li>
                  <li>
                    Products must be unused, sealed, and in original packaging.
                  </li>
                  <li>
                    To initiate a return, contact us via info@damanorganic.com
                    or 7032033366 with your order details.
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Refunds
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Once the returned item is received and inspected, your
                    refund will be processed within 3–5 business days to the
                    original payment method.
                  </li>
                  <li>Shipping charges (if any) are non-refundable.</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Non-Returnable Items
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Perishable goods (e.g., fruits, vegetables)</li>
                  <li>Opened or used products</li>
                  <li>Items without original packaging</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Contact for Return/Refund Queries:
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <a
                    href="mailto:info@damanorganic.com"
                    className="flex items-center text-primary font-medium"
                  >
                    <span className="mr-2">📧</span> info@damanorganic.com
                  </a>
                  <a
                    href="tel:+917032033366"
                    className="flex items-center text-primary font-medium"
                  >
                    <span className="mr-2">📞</span> +91 7032033366
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12 text-gray-600"
        >
          <p>
            © {new Date().getFullYear()} Daman Organic Living. All rights
            reserved.
          </p>
          <p className="mt-2">www.damanorganic.com</p>
        </motion.div>
      </div>
    </div>
  );
};

export default withLayout(PolicyPage);
