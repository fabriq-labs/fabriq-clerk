"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import BigqueryDestination from "./bigquery";
import PostgresDestination from "./postgres";
import RedshiftDestination from "./redshift";

import Layout from "../../components/layout";

// assets
import PostgresLogo from "../../assets/db_logos/pg.png";
import RedshiftLogo from "../../assets/db_logos/redshift.png";
import BigqueryLogo from "../../assets/db_logos/bigquery.png";

const LogoComponent = ({ destinationType }: any) => {
  if (destinationType === "redshift") {
    return <Image src={RedshiftLogo} alt="db-logo" width={60} height={60} />;
  }
  if (destinationType === "postgres") {
    return <Image src={PostgresLogo} alt="db-logo" width={60} height={60} />;
  }
  if (destinationType === "bigquery") {
    return <Image src={BigqueryLogo} alt="db-logo" width={60} height={60} />;
  }
  return null;
};

export default function Destination() {
  const [destination, setDestination]: any = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/destination");

      setDestination(result?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const destinationComponents: any = {
    redshift: <RedshiftDestination destination={destination} />,
    postgres: <PostgresDestination destination={destination} />,
    bigquery: <BigqueryDestination destination={destination} />,
  };

  return (
    <Layout>
      <div className="destination-wrapper">
        <Label className="lable-title">Destination</Label>
        {loading ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="center-div">
            <div className="form-box">
              <div className="flex-center">
                <LogoComponent destinationType={destination?.destinationType} />
                <Label
                  style={{ textTransform: "capitalize" }}
                  className="db-name"
                >
                  {destination?.destinationType}
                </Label>
              </div>
              {destinationComponents[destination?.destinationType] || (
                <>no data found</>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
