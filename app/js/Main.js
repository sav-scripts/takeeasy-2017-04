(function(){

    "use strict";
    var self = window.Main =
    {
        localSettings:
        {
            fb_appid: "153719541717801"
        },

        settings:
        {
            isLocal: false,
            isMobile: false,

            useFakeData: false,

            fb_appid: "153715675051521",
            fbPermissions: [],

            fbToken: null,
            fbUid: null,

            fbState: null,

            isiOS: false,
            isLineBrowser: false,

            viewport:
            {
                width: 0,
                height: 0,
                ranges: [640],
                index: -1,
                changed: false
            }
        },

        hashArray:
            [
                "/Index",
                "/Reviewer",
                "/Participate",
                "/Entries"
            ],

        firstHash: '',
        defaultHash: '/Index',

        init: function()
        {
            if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com")
            {
                $.extend(self.settings, self.localSettings);
                Main.settings.isLocal = true;

                if(Utility.urlParams.usefakedata == '1') Main.settings.useFakeData = true;
            }


            ScalableContent.init(self.settings.viewport.ranges);
            ScalableContent.enableFixFullImage = true;
            ScalableContent.enableDrawBounds = true;

            CommonForm.init();
            EntryView.init();

            startApp();

            $(window).on("resize", onResize);
            onResize();

            function startApp()
            {
                SceneHandler.init(Main.hashArray,
                {
                    defaultHash: self.defaultHash,
                    listeningHashChange: true,
                    loadingClass: Loading,
                    version: new Date().getTime(),

                    cbBeforeChange: function()
                    {
                    }
                });

                SceneHandler.toFirstHash();
            }
        }
    };

    function onResize()
    {
        var width = $(window).width(),
            height = $(window).height();

        var obj = ScalableContent.updateView(width, height);
        self.settings.viewport.changed = obj.modeChanged;
        self.settings.viewport.index = obj.modeIndex;
        //ScalableContent.updateResizeAble();

        console.log(self.settings.viewport.index);
    }

}());
