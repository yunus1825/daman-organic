import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import isoCertificate from "../../assets/images/ISO_22000.jpg";
import wolfOrganicCertificate from "../../assets/images/WOFL_Organic_Certificate.jpg";
import withLayout from "../../components/withLayout";

const certificates = [
  {
    id: 1,
    img: wolfOrganicCertificate,
    title: "Organic Certification",
    description:
      "Certified organic, ensuring our products meet the highest organic standards.",
  },
  {
    id: 2,
    img: isoCertificate,
    title: "ISO 22000 Certification",
    description:
      "ISO 22000 certification for food safety management systems, guaranteeing quality and safety.",
  },
];

const CertificatesAndStores = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div className="min-h-screen px-4 py-12 md:px-6 md:py-16 space-y-16 max-w-6xl mx-auto">
      {/* Certificates Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Our Certifications
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are proud to maintain the highest standards of quality and safety
            through our certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
              onClick={() => setSelectedCert(cert.img)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={cert.img}
                  alt={cert.title}
                  className="w-full h-72 object-contain transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-medium">Click to view</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {cert.title}
                </h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Certificate Preview */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute -top-12 right-0 cursor-pointer text-white text-3xl hover:text-gray-300 transition-colors"
                  onClick={() => setSelectedCert(null)}
                >
                  &times;
                </button>
                <img
                  src={selectedCert}
                  alt="Certificate"
                  className="max-h-[80vh] w-full object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default withLayout(CertificatesAndStores);
