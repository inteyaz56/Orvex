import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaUtensils,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#efe3d5] mt-20 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-14">
          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <div className="bg-orange-100 p-2 rounded-xl">
                <FaUtensils className="text-orange-500 text-lg" />
              </div>
              Orvex
            </h2>

            <p className="text-gray-600 mt-6 leading-relaxed">
              <span className="font-semibold text-gray-800">
                Orvex Food Delivery
              </span>{" "}
              helps you discover the best meals near you. From flavorful
              biryanis to delicious pizzas and fast food, Orvex connects you
              with top restaurants and delivers fresh meals directly to your
              doorstep.
            </p>

            <p className="text-gray-600 mt-3">
              Fast ordering, modern experience, and great taste — everything in
              one place.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Contact Information
            </h3>

            <div className="flex flex-col gap-5">
              <a
                href="tel:+916389010056"
                className="flex items-center gap-4 group"
              >
                <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-500 transition">
                  <FaPhoneAlt className="text-orange-500 group-hover:text-white" />
                </div>
                <span className="text-gray-600 group-hover:text-orange-500">
                  +91 6389010056
                </span>
              </a>

              <a
                href="mailto:zywvoweb@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-500 transition">
                  <FaEnvelope className="text-orange-500 group-hover:text-white" />
                </div>
                <span className="text-gray-600 group-hover:text-orange-500">
                  zywvoweb@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Connect With Me
            </h3>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://instagram.com/inteayzx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition text-orange-500"
              >
                <FaInstagram />
                inteyazx
              </a>

              <a
                href="https://github.com/inteyaz56"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition text-orange-500"
              >
                <FaGithub />
                inteyaz56
              </a>

              <a
                href="https://linkedin.com/in/inteyaz-ansari"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition text-orange-500"
              >
                <FaLinkedin />
                inteyaz-ansari
              </a>
            </div>
          </div>
        </div>

        {/* GRADIENT DIVIDER */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent my-12"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
          <p className="text-center">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-orange-500">Orvex</span>. All
            rights reserved.
          </p>

          <p className="text-center">
            Developed with ❤️ by{" "}
            <span className="font-semibold text-orange-500">
              Inteyaz Ansari
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
