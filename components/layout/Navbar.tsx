import React from "react";
import { motion } from "framer-motion";
import Logo from "@/assets/Logo.jpg";

const NavLinks = [
  {
    title: "About",
    link: "#",
  },
  {
    title: "Services",
    link: "#",
  },
  {
    title: "Project",
    link: "#",
  },
  {
    title: "Contact",
    link: "#",
  },
];
const Navbar = () => {
  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container py-6 flex justify-between items-center"
      >
        {/* Logo section */}
        <div className="flex items-center gap-3">
          <img src={Logo.src} alt="logo" className="w-10" />
          <span className="text-2xl font-bold">StaySync</span>
        </div>
        {/* Link section */}
        <div className="hidden md:block">
          {NavLinks.map((link,ind) => {
            return (
              <a key = {ind}
                href={link.link}
                className="inline-block mx-4 text-lg font-semibold hover:text-primary duration-300"
              >
                {link.title}
              </a>
            );
          })}
        </div>
        {/* Button section */}
        <div className="flex gap-2">
          <button className="primary-btn">Try For Free</button>
          <button className="secondary-btn">Login</button>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;