import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div>
      <Hero />
      <Features />
      <HowItWorks />
      </div>
      <Footer />
    </div>
  );
};

export default Home;