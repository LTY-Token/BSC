import React, { useState } from "react";
import ExcludeAndInclude from "./components/ExcludeAndInclude";
import FieldSettingPrice from "./components/FieldSettingPrice";
import BurnToken from "./components/commision/BurnToken";

import "./Owner.scss";
import AddDex from "./components/commision/AddDex";

const Owner = ({ contract, account, updateInfo, ownership }) => {
  const [excludeInclude] = useState([
    {
      title: 'Exclude/Include in RFI:',
      getExcluded: () => contract.getExcluded(),
      exclude: address => contract.excludeAccount(address),
      include: address => contract.includeAccount(address),
    },
    {
      title: 'Exclude/Include in Fee',
      getExcluded: () => contract.getExcludedFromDexFee(),
      exclude: address => contract.setIsExcludedFromDexFee(address, true),
      include: address => contract.setIsExcludedFromDexFee(address, false),
    },
    {
      title: 'Exclude/Include in limits',
      getExcluded: () => contract.getExcludedFromLimits(),
      exclude: address => contract.setIsExcludedFromLimits(address, true),
      include: address => contract.setIsExcludedFromLimits(address, false),
    }]);
  const [fieldSet] = useState([
    {
      title: 'Set number of tokens to swap:',
      flag: 'LTY',
      func: contract.setNumTokensToSwap.bind(contract),
      getLimit: null
    },
    {
      title: 'Set max transaction size:',
      flag: '%',
      func: contract.setMaxTransactionSizePercent.bind(contract),
      getLimit: null,
    },
    {
      title: 'Set sell fee if price is < x10 IDO price',
      flag: '%',
      func: contract.setSellAtSmallPriceAccumulationFee.bind(contract),
      getLimit: contract.initialSellAtSmallPriceAccumulationFee.bind(contract)
    },
    {
      title: 'Set sell fee if price is > x10 IDO price',
      flag: '%',
      func: contract.setSellAccumulationFee.bind(contract),
      getLimit: contract.initialSellAccumulationFee.bind(contract)
    },
    {
      title: 'Set RFI fee',
      flag: '%',
      func: contract.setSellReflectionFee.bind(contract),
      getLimit: contract.initialSellReflectionFee.bind(contract)
    },
    {
      title: 'Set buy fee',
      flag: '%',
      func: contract.setBuyAccumulationFee.bind(contract),
      getLimit: contract.initialBuyAccumulationFee.bind(contract)
    }]);

  return (
    <div className="owner">
      {ownership ? (
        <h2 className="title"> Owner </h2>
      ) : (
        <div className="owner__head">
          <h2 className="title"> Owner </h2>
          <p>(Only for contract Owner)</p>
        </div>
      )}
      <div className="owner__block">
        <div className="owner__item commission">
          <h2> Get the balance of the Address: </h2>
          <div className="owner__fields">
            <BurnToken ownership={ownership} updateInfo={updateInfo} contract={contract} />
            <AddDex ownership={ownership} contract={contract} />
          </div>
        </div>
        <div className="owner__item">
          {
            excludeInclude.map((el, index) =>
              <ExcludeAndInclude
                key={index}
                ownership={ownership}
                contract={contract}
                title={el.title}
                getExcluded={el.getExcluded}
                exclude={el.exclude}
                include={el.include}
              />)
          }
        </div>
        <div className="owner_set">
          {
            fieldSet.map((el, index) =>
              <FieldSettingPrice
                key={index}
                title={el.title}
                flag={el.flag}
                ownership={ownership}
                contract={contract}
                func={el.func}
                getLimit={el.getLimit} />)
          }

        </div>
      </div>
    </div>
  );
};

export default Owner;