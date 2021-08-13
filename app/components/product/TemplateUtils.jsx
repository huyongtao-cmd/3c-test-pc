import React, {Component} from 'react';
import {Utils} from "../../common";
import TemplateDrawer from "./TemplateDrawer";

let TemplateUtils = (() => {



    let templateDrawer = (templates) => {
        Utils.common.renderReactDOM(<TemplateDrawer productList={templates}/>)
    };


    return { templateDrawer}


})();

export default TemplateUtils;