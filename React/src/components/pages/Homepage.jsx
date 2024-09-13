import CategoryLinks from "../partials/categorylinks"
import Footer from "../partials/footer"
import Getstarted from "../partials/Getstarted"
import Herosection from "../partials/Herosection"
import CardList from "../partials/Homecards"
import Homesearch from "../partials/Homesearch"
import HowItWorks from "../partials/Howitworks"
import Invest from "../partials/Invest"

const Homepage = () => {
  return (
    <div>
        <Herosection/>
        <Homesearch/>
        <CategoryLinks/>
        <CardList/>
        <HowItWorks/>
        <Invest/>
        <Getstarted/>
        

    </div>
  )
}

export default Homepage