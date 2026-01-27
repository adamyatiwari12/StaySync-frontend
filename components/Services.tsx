import React from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/app/animation/animate";
import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";

const ServiceCard = [
  {
    id: 1,
    title: "Manager",
    description:
      "Create and manage rooms, assign residents, track occupancy, and handle maintenance requests efficiently.",
    icon: <LayoutDashboard />,
    link: "/signup",
    delay: 0.2,
  },
  {
    id: 2,
    title: "Resident",
    description:
      "View stay details, raise service requests, track status, and manage your personal profile with ease.",
    icon: <Users />,
    link: "/signup",
    delay: 0.4,
  },
];
const Services = () => {
  return (
    <div>
      <div className="container py-20">
        {/* heading title */}
        <div className="space-y-4 text-center max-w-[550px] mx-auto mb-8">
          <motion.h1
            variants={SlideUp(0.2)}
            initial="initial"
            whileInView={"animate"}
            className="text-4xl font-bold font-serif"
          >
            Built for Every Role
          </motion.h1>
          <motion.p
            variants={SlideUp(0.4)}
            initial="initial"
            whileInView={"animate"}
            className="text-text-secondary text-sm max-w-[400px] mx-auto"
          >
            Whether you are managing a building or staying in one, 
            StaySync provides the tools you need to succeed.
          </motion.p>
        </div>
        {/* card section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ServiceCard.map((card) => {
            return (
              <motion.div
                variants={SlideUp(card.delay)}
                initial="initial"
                whileInView={"animate"}
                key={card.id}
                className="space-y-4 border-[1px] border-border-muted px-6 py-12 hover:bg-primary hover:text-white hover:shadow-[7px_7px_0px_0px_var(--color-primary-dark)] duration-300"
              >
                <span className="inline-block text-xl border-[1px] border-primary rounded-full p-3">
                  {card.icon}
                </span>
                <p className="text-2xl font-bold font-serif">{card.title}</p>
                <p className="text-text-muted text-xs">{card.description}</p>
                <Link
                  href={card.link}
                  className="inline-block border-b border-primary"
                >
                  Learn More
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;