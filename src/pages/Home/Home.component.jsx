import { useEffect, useState } from "react";

import { Table } from "../../components";

import { KICKSTARTER_PROJECTS_API_URL } from "../../constants";
import KICKSTARTER_PROJECTS from "../../../__mocks__/kickstarters-data.json";

import "./Home.styles.css";

const useGetKickStartersQuery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initApiCall = async () => {
      try {
        setLoading(true);
        // const response = await fetch(KICKSTARTER_PROJECTS_API_URL);
        // const data = await response.json();
        // setData(data);

        setData(KICKSTARTER_PROJECTS);
      } catch {
        // API call error, fallback to mocks
        setData(KICKSTARTER_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    initApiCall();
  }, []);

  return { data, loading };
};

// This must match the API response
const TABLE_KEYS = {
  SERIAL_NUMBER: "s.no",
  PERCENTAGE_FUNDED: "percentage.funded",
  AMOUNT_PLEDGED: "amt.pledged",
};

const TABLE_HEADERS = {
  SERIAL_NUMBER: "Serial Number",
  PERCENTAGE_FUNDED: "Percentage Funded",
  AMOUNT_PLEDGED: "Amount Pledged",
};

export const Home = () => {
  const { data, loading } = useGetKickStartersQuery();

  if (loading) {
    return <p>loading....</p>;
  }
  return (
    <div className="home">
      {data.length ? (
        <>
          <Table
            columns={Object.values(TABLE_HEADERS)}
            data={data.map((each) => ({
              [TABLE_HEADERS.SERIAL_NUMBER]: each[TABLE_KEYS.SERIAL_NUMBER],
              [TABLE_HEADERS.PERCENTAGE_FUNDED]:
                each[TABLE_KEYS.PERCENTAGE_FUNDED] + "%",
              [TABLE_HEADERS.AMOUNT_PLEDGED]: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(each[TABLE_KEYS.AMOUNT_PLEDGED]),
            }))}
          />
        </>
      ) : (
        <p>nothing to show</p>
      )}
    </div>
  );
};
