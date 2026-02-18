import { motion } from 'motion/react';
import { Phone, MapPin, Scissors, Shirt, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl tracking-wider"
            style={{ color: '#D4AF37' }}
          >
            VISHAL SELECTION
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/login"
              className="px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 tracking-wide"
            >
              LOGIN
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1769981653696-5ce5a59263bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjbG90aGluZyUyMHN0b3JlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxMzIyMDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury clothing store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-7xl md:text-8xl tracking-widest mb-4" style={{ color: '#D4AF37', fontWeight: 300, letterSpacing: '0.15em' }}>
              VISHAL SELECTION
            </h1>
            <div className="h-px w-32 mx-auto bg-[#D4AF37] mb-6"></div>
            <p className="text-2xl md:text-3xl text-[#F5E6D3] tracking-wider" style={{ fontWeight: 300 }}>
              Tradition Meets Modern Style
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-[#F5E6D3]/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Experience premium ready-made clothes, exquisite fabrics, and expert tailoring services at Bhatiya's most trusted clothing destination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-6 justify-center"
          >
            <a
              href="#collections"
              className="px-8 py-4 bg-[#D4AF37] text-black tracking-wider hover:bg-[#B8941F] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              EXPLORE COLLECTIONS
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              CONTACT US
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-[#D4AF37] rounded-full mx-auto"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl tracking-wider mb-4" style={{ color: '#000000' }}>Our Collections</h2>
            <div className="h-px w-24 mx-auto bg-[#D4AF37]"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ready-made Clothes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-[#F5E6D3] p-12 text-center hover:bg-black transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <Shirt className="w-16 h-16 text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h3 className="text-2xl mb-4 text-black group-hover:text-[#F5E6D3] transition-colors tracking-wide">Ready-made Clothes</h3>
                <p className="text-black/70 group-hover:text-[#F5E6D3]/80 transition-colors leading-relaxed">
                  Premium quality ready-to-wear garments for every occasion. Discover the latest trends and timeless classics.
                </p>
              </div>
            </motion.div>

            {/* Fabric Store */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-[#F5E6D3] p-12 text-center hover:bg-black transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <Palette className="w-16 h-16 text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h3 className="text-2xl mb-4 text-black group-hover:text-[#F5E6D3] transition-colors tracking-wide">Premium Fabrics</h3>
                <p className="text-black/70 group-hover:text-[#F5E6D3]/80 transition-colors leading-relaxed">
                  Exquisite selection of fabrics from around the world. Quality materials for your perfect outfit.
                </p>
              </div>
            </motion.div>

            {/* Tailoring Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-[#F5E6D3] p-12 text-center hover:bg-black transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <Scissors className="w-16 h-16 text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h3 className="text-2xl mb-4 text-black group-hover:text-[#F5E6D3] transition-colors tracking-wide">Expert Tailoring</h3>
                <p className="text-black/70 group-hover:text-[#F5E6D3]/80 transition-colors leading-relaxed">
                  Precision tailoring services with years of expertise. Perfect fit guaranteed for every garment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl tracking-wider mb-4 text-[#D4AF37]">Visit Our Store</h2>
            <div className="h-px w-24 mx-auto bg-[#D4AF37]"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl text-[#F5E6D3] mb-2 tracking-wide">Store Address</h3>
                  <p className="text-[#F5E6D3]/70 text-lg leading-relaxed">
                    Bhatiya – Main Bazar<br />
                    Gujarat, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl text-[#F5E6D3] mb-2 tracking-wide">Contact Numbers</h3>
                  <p className="text-[#F5E6D3]/70 text-lg leading-relaxed">
                    Punja Bhai: <a href="tel:9925086503" className="text-[#D4AF37] hover:text-[#E8D087] transition-colors">9925086503</a><br />
                    Vishal Bhai: <a href="tel:7046386503" className="text-[#D4AF37] hover:text-[#E8D087] transition-colors">7046386503</a>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#F5E6D3] p-8 border border-[#D4AF37]/30"
            >
              <h3 className="text-2xl mb-6 text-black tracking-wide">Store Hours</h3>
              <div className="space-y-3 text-black/80">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="text-[#D4AF37]">9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#D4AF37]">10:00 AM - 8:00 PM</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-black/10">
                <p className="text-sm text-black/60 italic">
                  Walk-ins welcome. Visit us for a personalized shopping experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#D4AF37]/20 py-8 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F5E6D3]/60 tracking-wide">
            © 2026 Vishal Selection. All rights reserved.
          </p>
          <p className="text-[#D4AF37]/80 mt-2 text-sm">
            Premium Quality • Expert Service • Trusted Since Years
          </p>
        </div>
      </footer>
    </div>
  );
}
