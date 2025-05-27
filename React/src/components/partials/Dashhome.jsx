import MyBusinesses from "../dashboard/business/MyBusinesses"
import ServiceTable from "../dashboard/Service/servicestable"
import Table from "./Table"
import MyInvest from "../dashboard/Myinvestments/MyInvest"
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
const Dashhome = () => {

  const [hasInvestment, SetHasInvestment] = useState(false);
  useEffect(() => {
        const invest_check = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome/"+'hasInvestment')
                    .then(({ data }) => {
                        SetHasInvestment(data.status);
                        // console.log('dash',data);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }, 500);
        };
        invest_check();
    }, []);

  return (
      <div>
          <div className="">
              {hasInvestment && <MyInvest />}
          </div>

          <MyBusinesses />
          <ServiceTable />
      </div>
  );
}

export default Dashhome