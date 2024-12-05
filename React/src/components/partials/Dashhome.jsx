import MyBusinesses from "../dashboard/business/MyBusinesses"
import ServiceTable from "../dashboard/Service/servicestable"
import Table from "./Table"
import MyInvest from "../dashboard/Service/MyInvest"
const Dashhome = () => {
  return (
    <div>
      <MyBusinesses/>
        <ServiceTable/>
        <MyInvest/>

{/*        <Table/>*/}
    </div>
  )
}

export default Dashhome