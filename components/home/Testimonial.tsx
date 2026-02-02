import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "@/app/animation/animate";

const TestimonialData = [
  {
    id: 1,
    name: "Deepak Sharma",
    designation: "Property Manager",
    img: "https://i.pravatar.cc/300?img=1",
    text: "Managing several buildings was a struggle until I started using StaySync. Now everything from room assignment to rent tracking is automated.",
    delay: 0.2,
  },
  {
    id: 2,
    name: "Anjali Gupta",
    designation: "Tenant",
    img: "https://i.pravatar.cc/300?img=2",
    text: "Raising maintenance requests is so much easier now. I can track exactly when it will be fixed and communicate directly with building staff.",
    delay: 0.4,
  },
  {
    id: 3,
    name: "Vikram Mehta",
    designation: "Building Owner",
    img: "https://i.pravatar.cc/300?img=3",
    text: "The real-time occupancy insights have helped us maximize our building's efficiency. StaySync is an essential tool for modern stay operations.",
    delay: 0.6,
  },
  {
    id: 4,
    name: "Rohit Verma",
    designation: "PG Owner",
    img: "https://i.pravatar.cc/300?img=4",
    text:
      "Earlier I was managing rent, rooms, and tenants on Excel sheets. StaySync replaced all of that with a clean dashboard and automated monthly payments.",
    delay: 0.8,
  },
  {
    id: 5,
    name: "Sneha Iyer",
    designation: "Tenant",
    img: "https://i.pravatar.cc/300?img=5",
    text:
      "I love how transparent everything is. My rent status, payment history, and complaints are all in one place. No more WhatsApp follow-ups.",
    delay: 0.2,
  },
  {
    id: 6,
    name: "Amit Kulkarni",
    designation: "Hostel Administrator",
    img: "https://i.pravatar.cc/300?img=6",
    text:
      "Room allocation and tenant tracking used to take hours every month. With StaySync, onboarding and room assignments are effortless.",
    delay: 0.2,
  },
  {
    id: 7,
    name: "Pooja Malhotra",
    designation: "Tenant",
    img: "https://i.pravatar.cc/300?img=7",
    text:
      "Paying rent digitally and getting instant confirmation feels very professional. It honestly feels like living in a tech-enabled space.",
    delay: 0.2,
  },
  {
    id: 8,
    name: "Karan Singh",
    designation: "Co-Living Space Manager",
    img: "https://i.pravatar.cc/300?img=8",
    text:
      "Managing multiple stays under one system is where StaySync shines. The stay-based access control is exactly what we needed.",
    delay: 0.2,
  },
  {
    id: 9,
    name: "Neha Arora",
    designation: "Operations Head",
    img: "https://i.pravatar.cc/300?img=9",
    text:
      "From complaints to payments, everything is traceable and structured. StaySync has significantly reduced operational chaos.",
    delay: 0.2,
  },
];

const Testimonial = () => {
  return (
    <div className="py-14">

      {/* Heading */}
      <div className="space-y-4 text-center max-w-[550px] mx-auto mb-8">

        <motion.h1
          variants={SlideUp(0.2)}
          initial="initial"
          whileInView="animate"
          className="text-4xl font-bold font-serif"
        >
          Words from our customers
        </motion.h1>

        <motion.p
          variants={SlideUp(0.4)}
          initial="initial"
          whileInView="animate"
          className="text-text-secondary text-sm max-w-[350px] mx-auto"
        >
          Bring your dream home to life with one-on-one design help & hand-picked products
        </motion.p>

      </div>

      {/* ROOMS STYLE CSS SCROLL */}
      <div className="bg-background-muted py-12">

        <div className="
          flex
          gap-6
          overflow-x-auto
          overflow-y-hidden
          px-6
          no-scrollbar
          scroll-smooth
          [&::-webkit-scrollbar]:hidden
        ">

          {TestimonialData.map((card) => (
            <motion.div
              key={card.id}
              variants={SlideLeft(card.delay)}
              initial="initial"
              whileInView="animate"
              className="
                min-w-[320px]
                max-w-[320px]
                border border-border-muted
                px-5 py-10
                bg-background-card
                text-text-primary
                group
                hover:bg-primary hover:text-white
                duration-300
              "
            >
              {/* Top */}
              <div className="flex items-center gap-3">
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-[60px] rounded-full"
                />

                <div>
                  <p className="text-sm font-bold group-hover:text-white">
                    {card.name}
                  </p>
                  <p className="text-xs text-text-muted group-hover:text-white">
                    {card.designation}
                  </p>
                  <div className="text-xs mt-2">⭐⭐⭐⭐⭐</div>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5 border-t-2 border-border-muted pt-5">
                <p className="text-sm text-text-secondary group-hover:text-white duration-300">
                  {card.text}
                </p>
              </div>

            </motion.div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Testimonial;
