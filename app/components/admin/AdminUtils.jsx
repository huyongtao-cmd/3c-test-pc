import React from 'react';
import AdminSessions from "./AdminSessions";
import { Utils } from "../../common";
import ModAdminPwd from "./ModAdminPwd";
import ResetPassword from "./ResetPassword";


let AdminUtils = (() => {

    let adminSessions = (adminId, name) => {
        Utils.common.renderReactDOM(<AdminSessions adminId={adminId} name={name} />);
    };

    let modAdminPwd = () => {
        Utils.common.renderReactDOM(<ModAdminPwd />);
    };

    let resetPassword = (mobile) => {
        Utils.common.renderReactDOM(<ResetPassword mobile={mobile} />)
    }

    return {
        adminSessions, modAdminPwd, resetPassword
    }

})();

export default AdminUtils;