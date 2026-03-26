import { motion } from "framer-motion";
import withLayout from "../../components/withLayout";
const AboutUs = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-primary to-primaryDark text-white py-20 px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
          Welcome to <span className="font-semibold">Daman Organic Living</span>
          , where every choice you make is an investment in your health, our
          farmers, and the future of our planet.
        </p>
      </motion.section>

      {/* Meaning of Daman */}
      <motion.section
        className="py-16 px-6 max-w-5xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold mb-6">🌿 What Does “Daman” Mean?</h2>
        <p className="text-lg leading-relaxed">
          The word <span className="font-semibold">‘Daman’</span> itself means
          <span className="italic"> “Assurance and Guarantee”</span> — our
          promise to provide you with food that is not only pure and
          chemical-free but also produced with integrity, sustainability, and
          love for the earth.
        </p>
      </motion.section>

      {/* Philosophy */}
      <motion.section
        className="py-16 px-6 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">🌍 Our Philosophy</h2>
          <p className="text-lg leading-relaxed">
            At Daman, we believe that{" "}
            <span className="font-semibold italic">
              one organic food customer can inspire and support the cultivation
              of one more acre of organic farmland.
            </span>{" "}
            With every product you choose, you directly contribute to expanding
            organic farming, empowering farmers, and protecting our soils,
            water, and biodiversity for generations to come.
            <br />
            <br />
            Your plate becomes the starting point of a ripple effect that heals
            both body and planet.
          </p>
        </div>
      </motion.section>

      {/* Offerings */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          🛒 What We Offer
        </h2>
        <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto mb-12">
          We offer a wide range of Organic Fruits, Vegetables, Cereals, Pulses,
          Millets and range of Grocery essentials, Beauty, Health and wellness
          products, all sourced from trusted farms that follow the strictest
          organic standards. Through our farm-to-shelf model, we deliver
          unmatched freshness, flavour, and nutrition — bringing you food the
          way nature truly intended.
        </p>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { title: "Organic Fruits & Vegetables", emoji: "🥦🍎" },
            { title: "Cereals, Pulses & Millets", emoji: "🌾" },
            { title: "Grocery Essentials", emoji: "🍯" },
            { title: "Beauty & Wellness", emoji: "🌸" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-lg transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="text-2xl mb-2">{item.emoji}</p>
              <h3 className="font-semibold text-lg">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Movement */}
      <motion.section
        className="py-16 px-6 bg-primaryLight"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            🌟 More Than a Marketplace
          </h2>
          <p className="text-lg leading-relaxed mb-6">
            But Daman is more than a marketplace. It is a movement to create
            healthier lifestyles, sustainable livelihoods for farmers, and a
            greener tomorrow for all. By choosing Daman, you embrace a life
            where every meal becomes a celebration of purity, wellness, and
            responsibility.
          </p>
          <p className="text-2xl font-semibold text-primary">
            Daman Organic Living — Healthy Food, Happy Life.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default withLayout(AboutUs);
