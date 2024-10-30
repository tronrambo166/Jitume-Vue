import MyBusinesses from "../dashboard/business/MyBusinesses"
import ServiceTable from "../dashboard/Service/servicestable"
import Table from "./Table"

const Dashhome = () => {
  return (
    <div>
      <MyBusinesses/>
        <ServiceTable/>

{/*        <Table/>*/}
    </div>
  )
}

export default Dashhome