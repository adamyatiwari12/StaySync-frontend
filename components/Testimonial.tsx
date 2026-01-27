import React from "react";
import { delay, motion } from "framer-motion";
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
];
const Testimonial = () => {
  return (
    <div className="py-14">
      {/* heading title */}
      <div className="space-y-4 text-center max-w-[550px] mx-auto mb-8">
        <motion.h1
          variants={SlideUp(0.2)}
          initial="initial"
          whileInView="animate"
          className="text-4xl font-bold font-serif"
        >
          Words from our coustomers
        </motion.h1>
        <motion.p
          variants={SlideUp(0.4)}
          initial="initial"
          whileInView="animate"
          className="text-text-secondary text-sm max-w-[350px] mx-auto"
        >
          Bring your dream home to life with one-on-one design help & hand
          picked products
        </motion.p>
      </div>
      {/* tesitomonial cards */}
      <div className="bg-background-muted p-12">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
          {TestimonialData.map((card) => {
            return (
              <motion.div
                variants={SlideLeft(card.delay)}
                initial="initial"
                whileInView="animate"
                key={card.id}
                className="border-[1px] border-border-muted px-5 py-10 bg-background-card text-text-primary group hover:bg-primary hover:text-white duration-300"
              >
                {/* Upper section */}
                <div className="flex flex-row items-center gap-3 ">
                  <img
                    src={card.img}
                    alt=""
                    className="w-[60px] rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold group-hover:text-white">
                      {card.name}
                    </p>
                    <p className="text-text-muted text-xs group-hover:text-white">
                      {card.designation}
                    </p>
                    <div className="text-xs mt-2">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                {/* Bottom section */}
                <div className="mt-5 border-t-2 border-border-muted pt-5">
                  <p className="text-sm text-text-secondary group-hover:text-white duration-300">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;