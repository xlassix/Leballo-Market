import { useState, useContext, useEffect } from "react";
import { Context } from "./Context";
import { getLogs } from "../utils/helper";
import Table from "./utils/Table";

export default function LogDetailNft({ id }) {
  const { address, setErrorInstance, errorInstance } =
    useContext(Context).state;
  const [data, setData] = useState({});

  useEffect(() => {
    async function feedData() {
      setData(await getLogs(id));
    }
    feedData();
  }, [id]);

  return (
    <div className="center flex-col">
      <h3>Bids</h3>
      <Table header={["tx","bidder", "amount", "timestamp"]} rows={data} />
    </div>
  );
}
