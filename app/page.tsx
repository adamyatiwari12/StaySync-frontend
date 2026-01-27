"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Banner from "@/components/Banner";
import Banner2 from "@/components/Banner2";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
    <Navbar/>
    <Hero/> 
    <Services/>
    <Banner/>
    <Banner2/> 
    <Testimonial/>
    <Newsletter/> 
    <Footer/>
    </>
  )
}
