import React from "react";
import { Information, Owner, User } from "./components";

import "./Dashboard.scss";

const Dashboard = ({
  account,
  info,
  getAddress,
  getDex,
  contract,
  updateInfo,
  loading,
  ownership,
  updateBalances,
}) => {
  return (
    <div className="container">
      <div className="app-main">
        <Information loading={loading} info={info} updateInfo={updateInfo} />
        <User
          getAddress={getAddress}
          getDex={getDex}
          contract={contract}
          account={account}
          updateInfo={updateInfo}
          updateBalances={updateBalances}
        />
        <Owner
          contract={contract}
          account={account}
          updateInfo={updateInfo}
          ownership={ownership}
        />
      </div>
    </div>
  );
};

export default Dashboard;
