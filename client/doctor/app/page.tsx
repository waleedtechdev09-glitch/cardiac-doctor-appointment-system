import Expertise from "@/components/Expertise";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import SurgeryVideoSection from "@/components/SurgerySection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Services />
      <Expertise />
      <SurgeryVideoSection />
      {/* <Footer /> */}
    </>
  );
}
