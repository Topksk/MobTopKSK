var AppVer='000';
//alert('index.js');

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var notificationOpenedCallback = function(jsonData) {
            //console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal
            .startInit("f0ce2837-6f24-4557-9f1c-7cf7db13fa3a")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();

        window.open = cordova.InAppBrowser.open;

        //alert(StatusBar);
        //alert(JSON.stringify(StatusBar));
        //alert('1.ind.js, AppVersion='+AppVersion.version);
        AppVer=AppVersion.version;
        app.receivedEvent('deviceready');
        //alert('ind.js, AppVer2='+AppVer2);
        //alert('label_header='+$("#label_header").text());
        $("#label_header").text(getTranslate("login_header_text")+", v "+AppVer);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        document.addEventListener("backbutton", onBackKeyDown, false);
        function onBackKeyDown(e) {
            e.preventDefault();
        }
    }
};

//alert('2.ind.js, AppVersion='+AppVersion.version);
//alert('end, ind.js, AppVer='+AppVer);