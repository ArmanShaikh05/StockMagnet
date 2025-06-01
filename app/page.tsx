import CTASection from "@/components/landing-page/CTASection";
import Details from "@/components/landing-page/Details";
import FAQ from "@/components/landing-page/FAQ";
import Features from "@/components/landing-page/Features";
import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/HeroSection";
import Pricing from "@/components/landing-page/Pricing";
import Testimonials from "@/components/landing-page/Testimonials";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="  mx-auto px-4 sm:px-0 scroll-smooth ">
      <Header />
      <HeroSection />
      <Details />
      <Features />
      <Testimonials />
      <FAQ />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
