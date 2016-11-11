var rhost="https://demo.topksk.kz/";
//var rhost="https://local.topksk.kz/";
var config = {
    timeout: 15000,
    url : {
        root: rhost,
        current : rhost + "supplierProfile/employees/current",
        login : rhost + "login",
        spr_oth : rhost + "sprav/other",
        register : rhost + "regist/register_user",
        restore_password : rhost + "auth?send_pass_reset_code&role_code=",
        uploadImage2 : rhost + "reqs/uploadImage2",
        insReq : rhost + "reqs/insreq",
        sprMain: rhost + "sprav/main",
        sprSub: rhost + "sprav/sub",
        orderList: rhost + "search/reqs",
        imageUrl: rhost + "sprav/subid",
        logout: rhost + "logout",
        execFunc : rhost + "reqs/execFunc"
    },
    lang: function() {
        return (localStorage.getItem("lang") == "RUS") ? 1 : 2;
    },    
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    langList: {
        rus: "RUS",
        kaz: "KAZ"
    },
    authorized: false,
    savePassword: false,
    availableContextMenu: ["notifyListPage", "orderListPage", "orderLookUpPage", "notifyLookUpPage", "languagePage", "addrListPage"]
};