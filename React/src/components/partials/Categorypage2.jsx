import Footer2 from '../global/Footer2'
import Nav2 from '../global/Nav2'
import BsCard from './Bs-card'
import Listings from './Listings'

const businessreults = () => {
  return (
    <div className='w-full h-screen'>
        {/*<Nav2/>*/}
        <Listings/>
        <BsCard/>
        <Footer2/>
    </div>
  )
}

export default businessreults