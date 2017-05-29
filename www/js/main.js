var langItems = ["KAZ", "RUS"];
var body_copy; 
var langData;
var filesToSend = [];
var oClientData={};
var n_cp=0;

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function alertObject(obj) {
    var str = "";
    for (k in obj) {
        str += k + ": " + obj[k] + "\r\n";
    }
    alert(str);
}

function getTranslate(pattern) {
    return (config.lang() == "1") ? RUS[pattern] : KAZ[pattern];
}

function getClientData(callback) {
    //alert(config.url.current);
    if (config.authorized() && (config.login()!=null)) {
        $.ajax({
            url: config.url.current,
            contentType: 'application/x-www-form-urlencoded',
            success: function(data){
                oClientData=data;
                $("#firstName").text(oClientData.user_info.first_name);
                callback();
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert('getClientData, thrownError39='+JSON.stringify(thrownError));
            }
        });
    }
}

function Login(login, password, callback) {
    $.ajax({
        url: config.url.login,
        data: "role="+login+"&password="+password+"&authurl=login.html",
        contentType: 'application/x-www-form-urlencoded',
        timeout: config.timeout,
        type: 'POST',
        processData: false,
        crossDomain: true,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        success: function(data){
            //window.plugins.OneSignal.syncHashedEmail(login);
            window.plugins.OneSignal.sendTag("email", login.toLowerCase());
            //window.plugins.OneSignal.deleteTag("key1");
            //window.plugins.OneSignal.getIds(function(ids) {
                //alert('1.getIds: ' + JSON.stringify(ids));
                //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
            //});
            callback();
            //alert('login success, authorized='+localStorage.getItem("authorized"));
            //localStorage.setItem("authorized", "true")
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert("please check the internet connection");
            alert(config.url.login +', line 70,'+JSON.stringify(thrownError));
            Logout();
        },
        complete: function(event,xhr,options) {
            $(".overlay_progress").hide();
        }
    });
}

function Logout() {
    $.ajax({
        url: config.url.logout,
        type: 'POST',
        timeout: config.timeout,
        data: {},
        success: function() {
            localStorage.setItem("authorized", "false");
            document.location.hash = "";
        },
        error: function() {
            alert('Error in logout');
        },
        complete: function() {
        }
    });
}

function setLanguage() {
    if(!config.savePassword) {
        $("#loginField").val(null);
        $("#passwordField").val(null);
        $("#savePassword").prop("checked", false);
    }
    else
    {
        $("#loginField").val(localStorage.getItem("login"));
        $("#passwordField").val(localStorage.getItem("password"));
        $("#savePassword").prop("checked", true);
    }
    var langTxt = config.langList.kaz;
    if(localStorage.getItem("lang") == langTxt)
    {
        langTxt = config.langList.kaz;
        langData = KAZ;
        $(".language").text(langTxt);
    }
    else {
        langTxt = config.langList.rus;
        langData = RUS;
        $(".language").text(langTxt);
    }
    $("#languageList").val(langTxt);
    $("#label_header").text(getTranslate("login_header_text"));
    $("#loginBtn").val(getTranslate("login_btn_text"));
    $("#lsavePassword").text(getTranslate("save_password"));

    $("#lforgotPassword").text(getTranslate("restore_password_link"));
    $("#lregistration").text(getTranslate("registration_link"));
    $('#reg_phone').mask(getTranslate("phonemask"));
    var hash = window.location.hash;
    hash = hash.substring(1, hash.length);
    if(config.availableContextMenu.indexOf(hash) != -1)
    {
        $("#contextMenuOpenBtn").show();
    }
    else
    {
        $("#contextMenuOpenBtn").hide();
    }

}

function getOrderReqType(callback) {
    var langId = config.lang();

    var dataToPost = {
        lang_id: langId,
        name: "req_type_ksk"
    };

    var response = [];

    $.ajax({
        url: config.url.sprMain,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        success: function (result) {                    
                response = result;
                callback(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error in req_type list');
        },
        complete: function(){
        }
    });
}

function getStatuses(callback) {
    var langId = config.lang();

    var dataToPost = {
        lang_id: langId,
        name: "req_status"
    };

    var response = [];

    $.ajax({
        url: config.url.sprMain,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        success: function (result) {                    
                response = result;
                callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error in req_status list');
        },
        complete: function(){
            $(".overlay_progress").hide();
        }
    });

    return response;
}

function getUserAddress(callback) {
    var langId = config.lang();

    var response = [];

    var dataToPost = {
        sqlpath: "sprav/user_address",
        t_language_id: 1,
        userId: 1, t_rel_status: 4        
    };

    $.ajax({
        url: config.url.spr_oth,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        timeout: config.timeout,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        data: JSON.stringify(dataToPost),
        success: function (result) {                    
                response = result;
                callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error in user_addr list');
        },
        complete: function(){
            $(".overlay_progress").hide();
        }
    });   
}

function Authorize() {
    $.ajax({
        url: config.url.current,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        processData: false,
        timeout: config.timeout,
        cache: false,
        success: function(data){
            try {
                n_cp=248;
                if(!config.savePassword) {
                    $("#loginField").val(null);
                    $("#passwordField").val(null);
                    localStorage.removeItem("login");
                    localStorage.removeItem("password");
                    localStorage.removeItem("savePassword");
                }
                else
                {
                    localStorage.setItem("login", $("#loginField").val());
                    localStorage.setItem("password", $("#passwordField").val());
                    localStorage.setItem("savePassword", true);
                }
                n_cp++;
                $("#firstName").text(data.user_info.first_name);
                n_cp++;
                localStorage.setItem("authorized", "true");
                n_cp++;
                $(this).attr("type", "password");
                n_cp++;
                $("#visiblePassword").removeClass("visiblePassword-show");
                n_cp++;
                localStorage.setItem("userFirstName", data.user_info.first_name);
                n_cp++;
                document.location.hash = "notifyListPage";
                n_cp++;
                DrawNotifyList();
                n_cp++;
            }
            catch (e) {
                alert('Line ' + n_cp + ',' + e.message+ ', data.user_info='+data.user_info);
            }
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert(getTranslate("auth_fail"));
        }
    });
}

function DrawNotifyList() {
    $(".listData").html("");
    var ddate = $("#notifyDate").val();
    var status = parseInt($("#notifyStatus").val());
    var theme = $("#notifyTheme").val();
    var nid = ($("#notifyId").val() == "") ? -1 : parseInt($("#notifyId").val());
    var langId = config.lang();

    if(ddate == "") {ddate = "1111-11-11";}

    var dataToPost = {  t_language_id: langId,
        userId: 1,
        notifid: nid,
        notifDate1: ddate,
        status: status,
        theme1: theme,
        sqlpath: 'sprav/get_notification'
    };
    //alert('GetList.dataToPost='+JSON.stringify(dataToPost));
    $.ajax({url: config.url.spr_oth,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        beforeSend : function(xhr, opts){
            $(".overlay_progress").show();
        },
        success: function (result, textStatus, request) {
            response = result;
            //alert('GetList.success, response='+JSON.stringify(response));
            //callback(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Error in get_notif');
        },
        complete: function(event, xhr, options) {
            $(".overlay_progress").hide();
            //alert('GetList.complete, response='+JSON.stringify(response));
            //callback(response);

            if(response != null)
            {
                //var date2 ="";
                for(var i = 0; i < response.length; i++)
                {
                    $(".listData").append("<li><div class=\"notif_sender_field\">" + response[i].notif_sender +
                        "</div><div class=\"notif_text_field\">" + response[i].notif_text + "</div><div class=\"id_field\">" + response[i].notif_number +
                        "</div><div class=\"type_field\">" + response[i].notif_theme + "</div><div class=\"state_field\">" + response[i].notif_status +
                        "</div><div class=\"date_field\">" + moment(response[i].dat_notif.substring(0, 19), 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY') + "</div><div class=\"clear\"></div></li>");
                }
            }
            document.location.href="#notifyListPage";
        }
    });
}

function getCityList() {
    var langId = config.lang();
    var dataToPost = {
        lang_id: langId,
        name: "all_city"
    };
    var response = [];
    $.ajax({
        url: config.url.sprMain,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        async: false,
        success: function (result) {
            response = result;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error in all_city list');
        }
    });
    return response;
}

function getStreetList(city_id) {
    var langId = config.lang();
    var dataToPost = {
        lang_id: langId,
        name: "all_street",
        sid: city_id
    };
    var response = [];
    $.ajax({
        url: config.url.sprSub,
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(dataToPost),
        timeout: config.timeout,
        async: false,
        success: function (result) {
            response = result;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error in all_street1 list');
        }
    });
    return response;
}

function crObjList(s_name, l_name){
    $('#'+l_name+' option').remove();
    //$("#orderFilterStatus option").remove();
    switch (s_name) {
        case 'reqType': {
            getOrderReqType(function(reqtype){
                for(var i = 0; i < reqtype.length; i++) {
                    if (reqtype[i].id==-100){
                        $('#'+l_name).append($("<option/>", {
                            value: reqtype[i].id,
                            text : reqtype[i].text,
                            disabled: 'disabled'
                        }));
                    }
                    else {
                        $('#'+l_name).append($("<option/>", {
                            value: reqtype[i].id,
                            html : "&#160;&#160;&#160;"+reqtype[i].text
                        }));
                    }
                }
                //$('#'+l_name).prop("selectedIndex", -1).trigger("change");
            });
        }
            break;
        case 'orderAddress': {
            $('#'+l_name).append($("<option/>", {
                value: "",
                text : "...",
                disabled: 'disabled'
            }));
            getUserAddress(function(addresses){
                for(var i = 0; i < addresses.length; i++) {
                    $('#'+l_name).append($("<option/>", {
                        value: addresses[i].id,
                        text : addresses[i].text
                    }));
                }
            });
        }
            break;
        case 'orderStatus': {
            getStatuses(function(statuses){
                for(var i = 0; i < statuses.length; i++) {
                    $('#'+l_name).append($("<option/>", {
                        value: statuses[i].id,
                        text : statuses[i].text
                    }));
                }
            });
        }
            break;
        default: {
            alert("Неизвестный парам, 439="+s_name);
        }
    }
    $('#'+l_name).prop("selectedIndex", -1).trigger("change");

}

$("document").ready(function()
{
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        $("div.header").css("height", "80px");
        $("div.header").css("line-height", "80px");
        $("div.content").css("padding-top", "90px");
        $("span.menuBtn").css("height", "80px");
        $("a.search").css("height", "80px");
        $("span.orderAddBtn").css("height", "80px");
        $("a.backBtn").css("height", "80px");
    }

    var login = localStorage.getItem("login");
    var password = localStorage.getItem("password");
    if(config.authorized() && (config.login()!=null)) {
        Login(login, password, function(){
            getClientData(function(){
                hashChange();
            });
        });
    }
    body_copy = $("body").html();

    $("body").html(tmpl(body_copy, langData));

    $(document).on("click", "#contextMenuOpenBtn",  function() {
        $(this).hide();
        $(".overlay").fadeIn("slow");
    });
    $(document).on("click", "#contextMenuOpenClose",  function() {
        $(".overlay").fadeOut("slow", function() {
            $("#contextMenuOpenBtn").show();
        });
        
    });

    function updateLanguage() {
        var lang = $(".language").text().trim();
        var index = ((langItems.indexOf(lang) + 1) == langItems.length) ? 0 : langItems.indexOf(lang) + 1;        
        localStorage.setItem("lang",  langItems[index]);        
        $(".language").text(langItems[index]);
        setLanguage();
        $("body").html(tmpl(body_copy, langData));
        $("#firstName").text(localStorage.getItem("userFirstName"));
        $(".overlay_progress").hide();
    }

    function hashChange() {
        var hash = window.location.hash;
        hash = hash.substring(1, hash.length);
        //alert('hashChange(), hash='+hash);
        //alert('orderDateFrom='+$('#orderDateFrom').val()+', hash='+hash);

        if(config.availableContextMenu.indexOf(hash) != -1) {
            $("#contextMenuOpenBtn").show();
        }
        else {
            $("#contextMenuOpenBtn").hide();            
        }

        // Авторизация
        if(hash == "" || hash == "mainPage" || hash == null) {
//alert('hashChange().1');
            if(config.authorized()) {
//alert('hashChange().1.1');
                //window.history.forward();
                //return;
                hash = "notifyListPage";
                //document.location.hash = "notifyListPage";
                DrawNotifyList();
                $("#contextMenuOpenBtn").show();
            }
            else {
//alert('hashChange().1.2');
                $(".page").hide();
                $("#mainPage").css("display", "block");
                return;
            }
        }
        else {
//alert('hashChange().2');
            if(!config.authorized()) {
                if(hash != "forgotPassword" && hash != "registration")
                {
                    $(".page").hide();
                    $("#mainPage").css("display", "block");
                    return;
                }                                
            }            
        }

        if ($('#orderDateFrom').val() == ''){
            var today = new Date();
            var yesterday = new Date(today);
            yesterday.setMonth(today.getMonth() - 12);
            $('#orderDateFrom').val(yesterday.toDateInputValue());
            $('#orderDateTo').val(today.toDateInputValue());
        }

        $(".page").hide();
        $("#"+hash).css("display", "block");
        if(hash == "orderAddPage") {
            crObjList('reqType', 'orderType');
            crObjList('orderAddress', 'orderAddress');
        }
        else if(hash == "orderListPage") {
            refOrderList();
        }
        else if(hash == "addrListPage") {
            var langId = config.lang();
            var dataToPost = {sqlpath: 'sprav/cit_address', lang_id: langId, userId: 1};
            $.ajax({
                url: config.url.spr_oth,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                timeout: config.timeout,
                data: JSON.stringify(dataToPost),
                beforeSend : function(xhr, opts){
                    $(".overlay_progress").show();
                },
                success: function (response) {
                    $(".listAddrData").html("");

                    if(response != null)
                    {
                        for(var i = 0; i < response.length; i++)
                        {
                            $(".listAddrData").append("<li>"+
                                "<div class=\"type_field\">" + response[i].street + ", " + response[i].building + ((response[i].fraction == null) ? "" : "/"+response[i].fraction) + ", " + response[i].flat + ((response[i].flat_fract == null) ? "" : "/"+response[i].flat_fract) + "</div>"+
                                "<div class=\"state_field\">" + response[i].status + "</div>"+
                                "<div class=\"type_field\">"+ response[i].ksk_description + "</div>"+
                                "<div class=\"notif_id_field\">" + response[i].recid + "</div>"+
                                "<div class=\"clear\">" + "</div>"+
                                "</li>");
                        }
                        //new Date(response[i].dat_reg).toLocaleString('ru-RU')
                    }

                    document.location.href="#addrListPage";
                },
                error: function (result) {
                    alert('Error in cit_addr list');
                },
                complete: function(event,xhr,options) {
                    $(".overlay_progress").hide();
                }
            });
        }
        else if(hash == "feedbackAddPage") {
            if (config.authorized()){
                $('#feedbackfio').val(oClientData.user_info.first_name+' '+oClientData.user_info.last_name);
                $('#feedbackphone').val(oClientData.user_info.phone_number);
                $('#feedbackemail').val(oClientData.user_info.email);
            }
        }
        else if(hash == "orderFilterPage") {
            crObjList('reqType', 'orderFilterType');
            crObjList('orderAddress', 'orderFilterAddress');
            crObjList('orderStatus', 'orderFilterStatus');
        }
        else if(hash == "addrAddPage") {
            if (config.authorized()){
                $(".overlay_progress").show();
                $("#addrCity").html('');
                var citylist = getCityList();
                $("#addrCity").append($("<option/>", {
                    value: "",
                    text : "..."
                }));
                for(var i = 0; i < citylist.length; i++)
                {
                    $("#addrCity").append($("<option/>", {
                        value: citylist[i].id,
                        text : citylist[i].text
                    }));
                }
                $(".overlay_progress").hide();
            }
            $('#addrBuild').mask('`?```', {placeholder: ""});
            $('#addrBuildSub').mask('/?/////////', {placeholder: ""});
            $('#addrFlat').mask('`?```', {placeholder: ""});
            $('#addrFlatSub').mask('/?/////////', {placeholder: ""});

        }
        else if(hash == "exit" && config.authorized()) {
            Logout();
        }
    }

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    function getImage(suid, tabName, callback) {
        var dataToPost = {
            sqlpath: 'sprav/cur_image',
                sid: parseInt(suid),
            tab_name: tabName
        };
//alert('getImage.dataToPost='+JSON.stringify(dataToPost));
        var response = {};
        $.ajax({url: config.url.spr_oth,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(dataToPost),
            timeout: config.timeout,
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (data, textStatus, request) {
                response = data;
                callback(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                response = null;
                alert('Error in img_url list');
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });
        return response;
    }

    function getOrderByid(id, callback) {
        var langId = config.lang();

        var dataToPost = {
            citreqs: 1,
            id: parseInt(id),
            lang_id: langId
        };

        var response = [];

        $.ajax({
            url: config.url.orderList,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            timeout: config.timeout,
            async: true,
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (result) {
                response = result;
                callback(response[0]);
            },
            error: function (result) {
                response = [];
                alert('Error in reqs by id list');
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });

        return response;
    }

    function drawBase64(base64Image, guid) {
        $(".cameraButtons").after("<div class=\"upload-images\" index="+guid+">\
            <img src="+base64Image+" /><span class=\"file-delete-button\"></span>\
        </div>");
    }

    function sendImageXHR(tab_id, tab_name) {
        if (filesToSend.length==0){
            $(".overlay_progress").hide();
            document.location.href="#orderListPage";
            return true;
        }
        filesToSend[0].tableId= tab_id;
        filesToSend[0].table_name=tab_name;

        $.ajax({url: config.url.uploadImage2,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            timeout: config.timeout,
            data: JSON.stringify(filesToSend),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (data, textStatus, request) {
                //alert('sendImageXHR-success');
                response = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Error in upl_img='+ JSON.stringify(thrownError));
                response = null;
            },
            complete: function(data)
            {
                $(".overlay_progress").hide();
            }
        });
    }

    function getFileContentAsBase64(path,callback){
        window.resolveLocalFileSystemURL(path, gotFile, fail);

        function fail(e) {
            alert('Cannot found requested file');
        }

        function gotFile(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var content = this.result,
                        fileSize = file.size,
                        fileName = file.name,
                        fileType = file.type,
                        fileModifiedTime = new Date(file.lastModifiedDate).toISOString();


                    callback(content, fileSize, fileName, fileType, fileModifiedTime);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function refOrderList(){
        var langId = config.lang();
        var dataToPost;
        if($("#orderId").val().trim() == "") {
            dataToPost = {
                citreqs: 1,
                dat_reg_beg: $("#orderDateFrom").val(),
                dat_reg_end: $("#orderDateTo").val() + "23:59:59",
                lang_id: langId,
                req_status: parseInt($("#orderFilterStatus").val()),
                req_type: parseInt($("#orderFilterType").val()),
                userId: 1
            };
            //alert('prop.selectedIndex='+$("#orderFilterAddress").prop('selectedIndex'));
            if ($("#orderFilterAddress").prop('selectedIndex')>-1){
                dataToPost.t_flats_id=$("#orderFilterAddress").val();
            }
        }
        else {
            dataToPost = {
                citreqs: 1,
                id: parseInt($("#orderId").val()),
                lang_id: langId
            };
        }
        //alert('refOrderList, dataToPost='+JSON.stringify(dataToPost));
        $.ajax({
            url: config.url.orderList,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            timeout: config.timeout,
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (response) {
                $(".listOrderData").html("");
                //alert('refOrderList, response='+JSON.stringify(response));
                if(response != null) {
                    for(var i = 0; i < response.length; i++) {
                        $(".listOrderData").append("<li><div class=\"notif_sender_field\">" + response[i].req_user +
                            "</div><div class=\"notif_text_field\">" + response[i].req_note + "</div><div class=\"id_field\">" + response[i].recid +
                            "</div><div class=\"type_field\">" + response[i].req_type + "</div><div class=\"state_field\">" + response[i].req_status +
                            "</div><div class=\"date_field\">" + moment(response[i].dat_reg.substring(0, 19), 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY HH:mm:ss') + "</div><div class=\"clear\"></div></li>");
                    }
                }
                document.location.href="#orderListPage";
            },
            error: function (result) {
                alert('Error in reqs_list2');
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });
    }

    $(window).on('hashchange',function(){
        hashChange();
    });

    $(document).on("click", "#loginBtn", function(){
        var login = $("#loginField").val().trim();
        var password = $("#passwordField").val().trim();
        var validated = true;
        var s_err_text = "";
        if(login == "")
        {
            $("[for=\"loginField\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"loginField\"]").hide();
        }

        if(password == "")
        {
            $("[for=\"passwordField\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"passwordField\"]").hide();
        }

        if(validated)
        {
            var dataToPost = {
                code: '1',
                sdescription: login,
                code2: '1',
                sdescription2: login,
                sqlpath: 'req_after_auth'
            };

            $.ajax({
                url: config.url.insReq,
                type: 'post',
                async: false,
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(dataToPost),
                success: function (result) {
                    // one_times_code;
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert(config.url.login +', line 894,'+JSON.stringify(thrownError));
                }
            });

            $.ajax({
                url: config.url.login,
                data: "role="+login+"&password="+password+"&authurl=login.html",
                contentType: 'application/x-www-form-urlencoded',
                timeout: config.timeout,
                type: 'POST',
                processData: false,
                crossDomain: true,
                beforeSend : function(xhr, opts){
                    $(".overlay_progress").show();
                },
                success: function(data){
                    window.plugins.OneSignal.sendTag("email", login.toLowerCase());
                    Authorize();
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert("please check the internet connection");
                    alert(config.url.login +', line 915,'+JSON.stringify(thrownError));
                    Logout();
                },
                complete: function(event,xhr,options) {
                    $(".overlay_progress").hide();
                }
            });            
        }
    });
    $(document).on("click", "#orderFilterBtn", function(){
        refOrderList();
    });
    $(document).on("click", "#notifyFilterSearchBtn", function(){
        DrawNotifyList();
    });
    $(document).on("click", "ul.listData li", function(){
        var thisElem = this;
        if (config.pbtn==1) {
            config.pbtn=0;
            //DrawNotifyList();
            return;
        }
        $(".overlay_progress").show();
        setTimeout(function(){
            $("#notifyLookUpId").val($(thisElem).find(".id_field").text());
            $("#notifyLookUpDate").val($(thisElem).find(".date_field").text());
            $("#notifyLookUpFioSender").val($(thisElem).find(".notif_sender_field").text());
            $("#notifyLookUpTheme").val($(thisElem).find(".type_field").text());
            $("#notifyLookUpText").val($(thisElem).find(".notif_text_field").text());


            $(".overlay_progress").hide();
            $.ajax({
                url: config.url.insReq,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                async: true,
                data: JSON.stringify({sqlpath: 'view_notification', notifid: Number($("#notifyLookUpId").val()), userId: 1}),
                success: function (result) {
                    //search();
                    //alert(JSON.stringify(result))
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    response = null;
                    alert("Error in line 1002: "+JSON.stringify(xhr));
                },
                complete: function(event, xhr, options) {
                    $(".overlay_progress").hide();
                    document.location.href="#notifyLookUpPage";
                }
            });
            //DrawNotifyList();
        }, 500);
        
    });
    $(document).on("click", "ul.listOrderData li", function(){
        if (config.pbtn==1) {
            config.pbtn=0;
            return;
        }
        var thisElem = this;
        $(".overlay_progress").show();
        setTimeout(function(){
            var id = parseInt($(thisElem).find(".id_field").text());
            getOrderByid(id, function(data){
                $("#orderIdLookUp").val(data.recid);
                $("#orderSubTypeLookUp").val(data.req_subtype);
                $("#orderTypeLookUp").val(data.req_type);
                $("#orderAddressLookUp").val(data.req_address);
                $("#orderUrgentLookUp").val(data.req_priority);
                $("#orderLookUpText").val(data.req_note);
                getImage(id, 't_request', function(images){
                    if (images.length>0) {
                        $("#orderLookUpPhotoPage .content").html("");
                        //alert('images.length='+images.length);
                        //alert('images='+JSON.stringify(images));
                        for(var i = 0; i < images.length; i++)
                        {
                            $('#orderLookUpPhotoPage .content').append('<img src=' + config.url.root + images[i].file_id + ' class="gallery" />');
                        }
                        $("#orderPhotoShowBtn").show();
                    }
                    else {
                        $("#orderPhotoShowBtn").hide();
                    }
                });
            });
        }, 500);
        document.location.href="#orderLookUpPage";
    });
    $(document).on("click", "ul.listAddrData li", function(){
        var thisElem = this;
    });
    $(document).on("click", "#orderPhotoShowBtn", function(){
        document.location.hash = "orderLookUpPhotoPage";
    });
    $(document).on("click", "#reg_btn", function(){
        var dataToPost = {
            email: $('#reg_email').val(),
            password: $('#reg_password').val(),
            name: $('#reg_firstname').val(),
            surname: $('#reg_lastname').val(),
            mobilephone: $('#reg_phone').val()
        };
        
        var validated = true;
        
        if(dataToPost.email == "")
        {
            $("[for=\"reg_email\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_email\"]").hide();
        }

        if(dataToPost.password == "")
        {
            $("[for=\"reg_password\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_password\"]").hide();
        }
        
        if(dataToPost.name == "")
        {
            $("[for=\"reg_firstname\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_firstname\"]").hide();
        }
        
        if(dataToPost.surname == "")
        {
            $("[for=\"reg_lastname\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_lastname\"]").hide();
        }
        
        if(dataToPost.mobilephone == "")
        {
            $("[for=\"reg_phone\"]").show();
            validated = false;
        }
        else
        {
            $("[for=\"reg_phone\"]").hide();
        }
        
        $.ajax({
            url: config.url.register,
            type: 'put',
            timeout: config.timeout,
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(dataToPost),
            beforeSend : function(xhr, opts){
                $(".overlay_progress").show();
            },
            success: function (result) {                    
                document.location.href="#mainPage";
                alert(getTranslate("userSuccReg"));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error in line 1085:' + JSON.stringify(xhr));
            },
            complete: function(event,xhr,options) {
                $(".overlay_progress").hide();
            }
        });
    });
    $(document).on("click", "#restore_btn", function(){
        var email = $("#restore_email").val();
        if(isValidEmailAddress(email))
        {
            $.post(config.url.restore_password + email,
            function (result) {
                if (result.email == "email_not_found") {
                    alert(getTranslate("email_not_found"));
                }
                else {
                    alert(getTranslate("resetPasswordMailSent"));
                    document.location.href="#mainPage";
                }                
            });
        }
        else
        {
            alert(getTranslate("invalidLogin"));
        }
    });
    $(document).on("click", ".language", function(){
        updateLanguage();
    });
    $(document).on("click", ".attachFileBtn", function(){
        $(".overlay_progress").show();
        function uploadPhoto(fileName) {
            getFileContentAsBase64(fileName, function(base64Image, fileSize, fileShortName, fileType, fileModifiedTime){                        
                var fileContent = base64Image.substring(base64Image.indexOf("base64") + 7);
                var guid = config.guid();                        
                filesToSend.push({
                    content: fileContent,
                    file: {},
                    modified: fileModifiedTime,
                    name: fileShortName,
                    size: fileSize,
                    type: base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";")),
                    req_id: guid
                });

                $(".overlay_progress").hide();
                drawBase64(base64Image, guid);

            });
        };

        navigator.camera.getPicture(
            uploadPhoto,
            function(message) {
                alert('get picture failed');
                $(".overlay_progress").hide();
            },
            {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }
        );
    });
    $(document).on("click", ".cameraBtn", function() {
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            cameraDirection: 1,
            saveToPhotoAlbum: true,
            correctOrientation : true
        };
        $(".overlay_progress").show();
        try{
            navigator.camera.getPicture(
                function(fileName){
                    getFileContentAsBase64(fileName, function(base64Image, fileSize, fileShortName, fileType, fileModifiedTime){                        
                        var fileContent = base64Image.substring(base64Image.indexOf("base64") + 7);
                        var guid = config.guid();                        
                        filesToSend.push({
                            content: fileContent,
                            file: {},
                            modified: fileModifiedTime,
                            name: fileShortName,
                            size: fileSize,
                            type: base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";")),
                            req_id: guid
                        });
                        $(".overlay_progress").hide();
                        drawBase64(base64Image, guid);

                    });
                }, 
                function(error){
                    $(".overlay_progress").hide();
                }, 
                options
            );
        }
        catch(e)
        {
            alert(e.message);
            $(".overlay_progress").hide();
        }
    });
    $(document).on("click", ".file-delete-button", function(){
        var index = $(this).parent().attr("index");
        var index2 = -1;
        for(var i = 0; i < filesToSend.length; i++)
        {
            if(filesToSend[i].req_id == index)
            {
                index2 = i - 1;
                break;
            }
        }
        filesToSend.splice(index2, 1);
        $(this).parent().remove();
    });
    $(document).on("click", ".orderAddBtn", function(){
        var cur_btn=$(this);
        switch ($(cur_btn).attr('id')) {
            case 'orderAddBtn': {
                var orderText = $("#orderText").val().trim();
                var orderType = parseInt($("#orderType").val());
                var orderAddress = parseInt($("#orderAddress").val());
                var validated = true;
                if(isNaN(orderType)) {
                    $('[for="orderType"][class="warning"]').show();
                    validated = false;
                }
                else {
                    $('[for="orderType"][class="warning"]').hide();
                }
                if(isNaN(orderAddress)) {
                    $('[for="orderAddress"][class="warning"]').show();
                    validated = false;
                }
                else {
                    $('[for="orderAddress"][class="warning"]').hide();
                }
                if(orderText == "") {
                    $('[for="orderText"][class="warning"]').show();
                    validated = false;
                }
                else {
                    $('[for="orderText"][class="warning"]').hide();
                }
                if (validated!=true){
                    return validated;
                }
                setTimeout(function () {
                    var dataToPost = {
                        req_subtype: parseInt($("#orderType").val()),
                        req_flat: parseInt($("#orderAddress").val()),
                        note: $("#orderText").val(),
                        userId: 1,
                        req_status: 1,
                        dead_line: 'null',
                        sqlpath: 'insert_cit_req',
                        t_language_id: 1,
                        userMail: 1
                    };
                    var req_id = null;
                    $.ajax({
                        url: config.url.insReq,
                        type: 'post',
                        timeout: config.timeout,
                        contentType: 'application/json;charset=UTF-8',
                        async: true,
                        data: JSON.stringify(dataToPost),
                        beforeSend: function (xhr, opts) {
                            $(".overlay_progress").show();
                        },
                        success: function (result) {
                            req_id = parseInt(result);
                            sendImageXHR(req_id, 't_request');
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            alert(config.url.login +', line 1336,'+JSON.stringify(thrownError));
                        },
                        complete: function (event, xhr, options) {
                            $("#orderType").prop("selectedIndex", -1).trigger("change");

                            $("#orderAddress").prop("selectedIndex", -1);
                            //$("#orderAddress").trigger("change");

                            $("#orderText").val('');

                            filesToSend = [];
                            $('.upload-images').remove();

                            refOrderList();

                        }
                    });
                }, 500);
                //$(".overlay_progress").hide();
            }
                break;
            case 'feedAddBtn': {
                var feedbackfio = $("#feedbackfio").val().trim();
                var feedbackphone = $("#feedbackphone").val().trim();
                var feedbackemail= $("#feedbackemail").val().trim();
                var feedText= $("#feedText").val().trim();
                var validated = true;
                if(feedbackfio=="")
                {
                    $("[for=\"feedbackfio\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"feedbackfio\"]").hide();
                }
                if(feedbackphone=="")
                {
                    $("[for=\"feedbackphone\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"feedbackphone\"]").hide();
                }
                if(feedbackemail == "")
                {
                    $("[for=\"feedbackemail\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"feedbackemail\"]").hide();
                }
                if(feedText == "")
                {
                    $("[for=\"feedText\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"feedText\"]").hide();
                }
                if (validated!=true){
                    return validated;
                }
                $(".overlay_progress").show();
                setTimeout(function () {
                    var dataToPost = {
                        flname: feedbackfio,
                        phonenum: feedbackphone,
                        guestemail: feedbackemail,
                        comments: feedText,
                        sqlpath: 'insert_guest_feeedback',
                        g_ip: 1
                    };
                    //alert(JSON.stringify(dataToPost));
                    $(".overlay_progress").show();
                    $.ajax({
                        url: config.url.insReq,
                        type: 'post',
                        timeout: config.timeout,
                        contentType: 'application/json;charset=UTF-8',
                        async: true,
                        data: JSON.stringify(dataToPost),
                        success: function (result) {
                            //var req_id = parseInt(result);
                            //alert('Ok, result='+JSON.stringify(result));

                        },
                        error: function () {
                            alert('Error in line 1416');
                        },
                        complete: function (event, xhr, options) {
                            $(".overlay_progress").hide();
                            document.location.href="#orderListPage";
                        }
                    });
                }, 500);
            }
                break;
            case 'addrAddBtn': {
                var addrCity = parseInt($("#addrCity").val());
                var addrStreet = parseInt($("#addrStreet").val());
                var addrBuild = $("#addrBuild").val().trim();
                var addrFlat = $("#addrFlat").val().trim();
                var addrBuildSub = $("#addrBuildSub").val().trim();
                var addrFlatSub = $("#addrFlatSub").val().trim();

                var validated = true;
                if(isNaN(addrCity))
                {
                    $("[for=\"addrCity\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"addrCity\"]").hide();
                }
                if(isNaN(addrStreet))
                {
                    $("[for=\"addrStreet\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"addrStreet\"]").hide();
                }
                if(addrBuild == "")
                {
                    $("[for=\"addrBuild\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"addrBuild\"]").hide();
                }
                if(addrFlat == "")
                {
                    $("[for=\"addrFlat\"]").show();
                    validated = false;
                }
                else
                {
                    $("[for=\"addrFlat\"]").hide();
                }
                var addrRel=$("input[name=addrRelation]:checked").val();
                if (isNaN(addrRel)){
                    $("#errAddrRel").show();
                    validated = false;
                }
                else {
                    $("#errAddrRel").hide();
                }
                if (validated!=true){
                    alert(getTranslate("not_filled"));
                    return validated;
                };

                setTimeout(function () {
                    var dataToPost = {
                        city: addrCity,
                        street: addrStreet,
                        home: addrBuild,
                        fraction: addrBuildSub,
                        flat: addrFlat,
                        flatfraction: addrFlatSub,
                        relation_type: addrRel,
                        addressId: 1,
                        sqlpath: 'create_user_inf',
                        userId: 1
                    };
                    //alert(JSON.stringify(dataToPost));
                    $.ajax({
                        url: config.url.execFunc,
                        type: 'post',
                        timeout: config.timeout,
                        contentType: 'application/json;charset=UTF-8',
                        async: true,
                        data: JSON.stringify(dataToPost),
                        beforeSend: function (xhr, opts) {
                            $(".overlay_progress").show();
                        },
                        success: function (result) {
                            //alert('result='+JSON.stringify(result));
                            if (JSON.stringify(result).indexOf("c_t_relation_unq") > 0) {
                                alert(getTranslate("addr_exists"));
                            }else if (result=='KSK_NOT_FOUND'){
                                alert(getTranslate("ksknotfound"));
                            };
                            
                        },
                        error: function (result) {
                            alert('Error in line 1519');
                        },
                        complete: function (event, xhr, options) {
                            $(".overlay_progress").hide();
                            document.location.href="#addrListPage";
                        }
                    });
                }, 500);
            }
                break;
            default:
                alert("Неизвестная кнопка");
        }
    });
    $(document).on("click", "#visiblePassword", function(){
        var elem = $("#passwordField");
        var type = elem.attr("type");

        if (type == "password") {
            elem.attr("type", "text");
            $(".visiblePassword").css("background", "url('img/not-visible.png') center center no-repeat");
        }
        else {
            elem.attr("type", "password");
            $(".visiblePassword").css("background", "url('img/visible.png') center center no-repeat");
        } 
    });
    $(document).on("click", ".savePasswordCls", function(){
        if(config.savePassword){
            $("#savePassword").prop("checked", false);
            config.savePassword = false;
        }
        else
        {
            $("#savePassword").prop("checked", true);
            config.savePassword = true;
        }
    });
    $(document).on("click", "ul.overlay-menu-list li a", function() {
        $(".overlay").fadeOut("slow", function() {
            $("#contextMenuOpenBtn").show();
        });
    });
    $(document).on("keyup", "#passwordField", function(){
        if ($(this).val()) {
            $("#visiblePassword").addClass("visiblePassword-show");
        } else {
            $(this).attr("type", "password");
            $("#visiblePassword").removeClass("visiblePassword-show");
        }
    });
    $(document).on("change", "#languageList", function(){
        updateLanguage();
        $(".page").hide();
        $("#languagePage").show();
    });
    $(document).on("change", "#addrCity", function(){
        //$(".overlay_progress").show();
        var streetlist = getStreetList($("#addrCity").val());
        $("#addrStreet").html('');
        $("#addrStreet").append($("<option/>", {
            value: "",
            text : "..."
        }));
        //alert(JSON.stringify(streetlist));
        for(var i = 0; i < streetlist.length; i++)
        {
            $("#addrStreet").append($("<option/>", {
                value: streetlist[i].id,
                text : streetlist[i].text
            }));
        }
    });
    /*$(document).on("click", "#orderAddLink", function(){
        //hashChange();
        document.location.href="#orderAddPage";
        //location.reload();
    });*/

});