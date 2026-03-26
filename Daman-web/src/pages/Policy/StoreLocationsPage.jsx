import {
  FaMapMarkerAlt,
  FaPhone,
  FaExternalLinkAlt,
  FaStore,
  FaClock,
} from "react-icons/fa";
import withLayout from "../../components/withLayout";

const stores = [
  {
    id: 1,
    name: "Banjara Hills",
    address:
      "8-2-684/A Ground floor, BS Space, Road Number 12, Banjara Hills, Hyderabad -500034 TS",
    contact: "7032033366",
    mapLink: "https://maps.app.goo.gl/psofxrzJdPJP5VQi8",
    hours: "10:00 AM - 9:00 PM",
  },
  {
    id: 2,
    name: "Manikonda-Lanco Hills",
    address:
      "H. No. 1-1-28/B & 37/B Vaishnavi Premia, Sri Laxminagar Colony, Lanco Hills Road, Manikonda Jagir, Hyderabad -500089 TS",
    contact: "9100725666",
    mapLink: "https://maps.app.goo.gl/NaD4vRdEFQhwjeKBA",
    hours: "10:00 AM - 9:00 PM",
  },
  {
    id: 3,
    name: "Guntur",
    address:
      "Beside Paradise Restaurant, Brindavan Gardens, Krishna Nagar, Guntur, 522006 AP",
    contact: "9100275666",
    mapLink: "https://maps.app.goo.gl/njwYNvmTFyLZgB8o9",
    hours: "10:00 AM - 9:00 PM",
  },
];

const StoreLocations = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
            <FaStore className="text-3xl text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Store Locations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visit us at any of our locations for a premium shopping experience.
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mr-4">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {store.name}
                  </h3>
                </div>

                <div className="mb-5">
                  <p className="text-gray-600 flex items-start">
                    <span className="mr-2 mt-1">📍</span>
                    <span>{store.address}</span>
                  </p>
                </div>

                <div className="mb-6">
                  <a
                    href={`tel:${store.contact}`}
                    className="text-primary hover:text-blue-800 flex items-center transition-colors duration-200 py-1"
                  >
                    <FaPhone className="mr-3" />
                    <span className="font-medium">{store.contact}</span>
                  </a>
                </div>

                <a
                  href={store.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-primary to-primaryDark text-white rounded-xl hover:from-primaryDark hover:to-primaryDark transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">View on Map</span>
                  <FaExternalLinkAlt className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withLayout(StoreLocations);
