import React from "react";
import Banner1 from "@/assets/banner2.png";
import { motion } from "framer-motion";
import { SlideUp } from "@/app/animation/animate";
import Link from "next/link";

const Banner2 = () => {
  return (
    <div>
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* text section */}
          <div className="space-y-5 flex justify-center flex-col xl:max-w-[500px]">
            <motion.h1
              variants={SlideUp(0.2)}
              initial="initial"
              whileInView="animate"
              className="text-4xl font-bold font-serif"
            >
              Secure & Unified Management Dashboard
            </motion.h1>
            <motion.p
              variants={SlideUp(0.4)}
              initial="initial"
              whileInView="animate"
              className="text-text-secondary text-sm leading-7"
            >
              Manage residents, issues, and building occupancy with role-based 
              access control. Our platform provides tailored dashboards for 
              managers and residents to streamline daily operations.
            </motion.p>
            <motion.div
              variants={SlideUp(0.6)}
              initial="initial"
              whileInView="animate"
              className="flex gap-3"
            >
              <div className="max-w-[80px] space-y-2">
                <p className="text-3xl font-bold font-serif">100+</p>
                <p className="text-text-secondary text-sm">Rooms Managed</p>
              </div>
              <div className="max-w-[80px] space-y-2">
                <p className="text-3xl font-bold font-serif">500+</p>
                <p className="text-text-secondary text-sm">Happy Residents</p>
              </div>
              <div className="max-w-[80px] space-y-2">
                <p className="text-3xl font-bold font-serif">24/7</p>
                <p className="text-text-secondary text-sm">Issue Tracking</p>
              </div>
            </motion.div>
            <div>
              <Link href="/signin">
                <motion.button
                  variants={SlideUp(0.6)}
                  initial="initial"
                  whileInView="animate"
                  className="primary-btn"
                >
                  Explore Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
          {/* image section */}
          <div className="flex flex-col justify-center  ">
            <motion.img
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              src={Banner1.src}
              alt=""
              className="w-[95%] md:w-full mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner2;