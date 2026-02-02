import React from "react";
import { delay, motion } from "framer-motion";
import { SlideUp } from "@/app/animation/animate";

const Newsletter = () => {
  return (
    <div className="max-w-[500px] mx-auto space-y-5 py-14">
      <motion.h1
        variants={SlideUp(0.2)}
        initial="initial"
        whileInView="animate"
        className="text-3xl font-bold font-serif text-center"
      >
        Ready to Manage Smarter?
      </motion.h1>
      <motion.p
        variants={SlideUp(0.4)}
        initial="initial"
        whileInView="animate"
        className="max-w-[400px] mx-auto text-text-secondary text-sm text-center"
      >
        Join hundreds of managers and residents using StaySync to 
        organize their living spaces and streamline operations.
      </motion.p>
      {/* form here */}
      <motion.div
        variants={SlideUp(0.6)}
        initial="initial"
        whileInView="animate"
        className="!mt-10 flex gap-2 justify-center"
      >
        <input
          type="text"
          placeholder="Enter your email"
          className="px-4 py-4 ring-1 ring-border"
        />
        <button className="primary-btn">
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default Newsletter;