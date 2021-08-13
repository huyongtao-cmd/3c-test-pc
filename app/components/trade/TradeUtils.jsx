import React from 'react';
import {Utils} from "../../common";
import TradeDetail from "./TradeDetail";


let TradeUtils = {


    tradeDetail: (tradeId) => {
        Utils.common.renderReactDOM(<TradeDetail tradeId={tradeId}/>);
    },

};

export default TradeUtils;
