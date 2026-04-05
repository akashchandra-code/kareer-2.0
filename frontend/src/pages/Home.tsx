
import Features from "../components/Features"
import Hero from "../components/Hero"
import HowItWorks from "../components/HowItWorks"
import Navbar from "../components/Navbar"
import WhyChoose from "../components/WhyChoose"
import Footer from "../components/Footer"
const Home = () => {
  return (
    <div><Navbar/>
    <Hero/>
    <HowItWorks/>
    <Features/>
    <WhyChoose/>
    <Footer/>
    </div>
  )
}

export default Home