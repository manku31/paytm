import { useState, useEffect } from "react";
import axios from "axios";

import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axios
      .get("https://paytm-hucr.onrender.com/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setBalance(response.data.balance));
  }, [balance]);
  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
}
