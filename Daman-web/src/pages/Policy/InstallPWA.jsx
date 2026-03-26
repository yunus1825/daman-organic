import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Smartphone,
  Star,
  Shield,
  Zap,
  CheckCircle,
  Share,
} from "lucide-react";
import Logo from "../../assets/images/damanheaderlogo.png";
import withLayout from "../../components/withLayout";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("User choice:", choiceResult.outcome);
      setDeferredPrompt(null);
    } else {
      alert("Please use your browser's menu to install this app.");
    }
  };

  const features = [
    { icon: Zap, text: "Fast Performance" },
    { icon: Shield, text: "Secure & Private" },
  ];

  return (
    <div className="min-h-screen  from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <motion.div
        className="max-w-5xl w-full bg-white rounded-3xl shadow border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Features Grid */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-700">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Install Our App
            </h2>
            <p className="text-gray-600">
              Get the full app experience with faster loading
            </p>
          </div>

          {/* Android Instructions */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-6 space-y-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Android & Desktop
                </h3>
                <p className="text-sm text-gray-600">Chrome, Edge, Brave</p>
              </div>
            </div>

            <ol className="space-y-2 ml-2">
              {[
                "Open the browser menu (⋮) in top-right",
                "Select 'Add to Home Screen'",
                "Confirm installation",
              ].map((step, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {deferredPrompt && (
              <motion.button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Install Now
              </motion.button>
            )}
          </motion.div>

          {/* iOS Instructions */}
          <motion.div
            className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl p-6 space-y-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">iOS Devices</h3>
                <p className="text-sm text-gray-600">Safari Browser</p>
              </div>
            </div>

            <ol className="space-y-2 ml-2">
              {[
                <>
                  Open in Safari and tap Share icon{" "}
                  <Share className="inline w-4 h-4 text-blue-600 mx-1" />
                </>,
                "Scroll to 'Add to Home Screen'",
                "Tap Add to confirm",
              ].map((step, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {isIOS && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm text-center">
                  💡 Use Safari's share menu to install the app
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default withLayout(InstallPWA);
