import Expertise from "@/components/Expertise";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import SurgeryVideoSection from "@/components/SurgerySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Services />
      <Expertise />
      <SurgeryVideoSection />
    </>
  );
}
