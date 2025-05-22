import Details from "@/components/landing-page/Details";
import Features from "@/components/landing-page/Features";
import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/HeroSection";

export default function Home() {
  return (
    <div className="container  mx-auto ">
      <Header />
      <HeroSection />
      <Details />
      <Features />
    </div>
  );
}
