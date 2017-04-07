(function(){

    "use strict";
    var self = window.Main =
    {
        localSettings:
        {
            fb_appid: "1896326817270897"
        },

        settings:
        {
            isLocal: false,
            isMobile: false,

            useFakeData: false,

            fb_appid: "1896325417271037",
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
                "/Rule",
                "/Participate",
                "/Entries",
                "/Fill"
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

            self.settings.isLineBrowser = Boolean(navigator.userAgent.match('Line'));

            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();
            CommonForm.init();
            EntryView.init();


            checkAccessToken();

            FBHelper.init(Main.settings.fb_appid);

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
                        Menu.close();
                    },

                    hashChangeTester: function(hashName)
                    {
                        if(hashName == '/Participate')
                        {
                            if(self.settings.isLineBrowser)
                            {
                                alert('您的瀏覽器不支援上傳檔案, 請使用其他的瀏覽器瀏覽此單元');
                                hashName = null; // cancel content change
                                SceneHandler.setHash('/Index');

                                return null;
                            }
                        }

                        if(hashName == '/Participate' || hashName == '/Fill')
                        {
                            if(!Main.settings.fbToken)
                            {
                                //console.log("no token");
                                hashName = null; // cancel content change
                                SceneHandler.setHash('/Index');

                                return null;
                            }
                        }

                        if(hashName == '/Participate' || hashName == '/Fill')
                        {
                            if(!Modernizr.canvas)
                            {
                                alert('您的瀏覽器不支援 html5 canvas, 請使用其他的瀏覽器瀏覽此單元');

                                hashName = null; // cancel content change
                                SceneHandler.setHash('/Index');

                                return null;
                            }
                        }


                        return hashName;
                    }
                });



                if(Utility.urlParams.serial)
                {
                    getFirstEntry();
                }
                else
                {
                    SceneHandler.toFirstHash();
                }
            }
        },

        testCanvas: function(canvas)
        {
            $(canvas).css(
                {
                    "position": 'fixed',
                    "top": 0,
                    "left": 0
                }
            );

            $("body").append(canvas);
        },

        loginFB: loginFB
    };


    function getFirstEntry()
    {
        if(history && history.replaceState)
        {
            var hash = SceneHandler.getHash();
            var uri = Helper.removeURLParameter(location.href, 'serial') + "#" + hash;
            window.history.replaceState({path:uri},'',uri);
        }

        Entries.firstEntrySerial = Utility.urlParams.serial;
        SceneHandler.toHash('/Entries');
    }

    function checkAccessToken()
    {
        if(location.hash.match("access_token") && location.hash.match("state"))
        {
            var string = location.hash.replace("#", "?");

            if(string)
            {
                self.settings.fbToken = Helper.getParameterByName("access_token", string);

                var state = Helper.getParameterByName("state", string);
                window.location.hash = "#" + state;

                removeFBParams();
            }
        }
    }

    function removeFBParams()
    {
        if(history && history.replaceState)
        {
            var hash = Main.settings.fbState;
            var uri = Helper.removeURLParameter(location.href, 'code');
            uri = Helper.removeURLParameter(uri, 'state');

            var currentHash = SceneHandler.getHash();

            uri = uri.replace('?#' + currentHash, '').replace('#' + currentHash, '');

            uri += "#" + hash;

            window.history.replaceState({path: uri}, '', uri);
        }
    }

    function loginFB(targetHash, cb, redirectUrl)
    {
        if(!targetHash) targetHash = "/Index";

        Loading.progress("登入 Facebook 中...請稍候").show();

        if(Main.settings.fbUid)
        {
            complete();
        }
        else
        {
            if(Main.settings.isiOS || Main.settings.isLineBrowser)
            //if(true)
            {
                //doRedirectLogin(); return;

                FB.getLoginStatus(function(response)
                {
                    if (response.status === 'connected')
                    {
                        //checkPermissions(response.authResponse, true);
                        complete(response.authResponse);
                    }
                    else
                    {
                        doRedirectLogin();
                    }
                });
            }
            else
            {
                FB.login(function(response)
                    {
                        if(response.error)
                        {
                            alert("登入 Facebook 失敗");
                        }
                        else if(response.authResponse)
                        {
                            //checkPermissions(response.authResponse, false);

                            complete(response.authResponse);

                        }
                        else
                        {
                            //alert("您必須登入 Facebook 才能參加本活動");
                            Loading.hide();
                        }

                    },
                    {
                        scope: Main.settings.fbPermissions,
                        return_scopes: true,
                        auth_type: "rerequest"
                    });
            }

        }

        function checkPermissions(authResponse, redirectToLogin)
        {
            FB.api('/me/permissions', function(response)
            {
                if (response && response.data && response.data.length)
                {

                    var i, obj, permObj = {};
                    for(i=0;i<response.data.length;i++)
                    {
                        obj = response.data[i];
                        permObj[obj.permission] = obj.status;
                    }

                    if (permObj.publish_actions != 'granted')
                    {
                        fail("您必須給予發佈權限才能製作分享影片");
                    }
                    else
                    {
                        complete(authResponse);
                    }
                }
                else
                {
                    alert("fail when checking permissions");
                    Loading.hide();
                }
            });

            function fail(message)
            {
                alert(message);
                Loading.hide();
                if(redirectToLogin) doRedirectLogin();
            }
        }

        function doRedirectLogin()
        {
            //var uri = redirectUrl? encodeURI(redirectUrl): encodeURI(Utility.getPath());
            var uri = redirectUrl? encodeURI(redirectUrl): encodeURI(Utility.getPathWithFilename());

            //console.log(uri); return;

            var url = "https://www.facebook.com/dialog/oauth?"+
                "response_type=token"+
                "&client_id="+Main.settings.fb_appid+
                "&scope="+Main.settings.fbPermissions.join(",")+
                "&state="+ targetHash +
                "&redirect_uri=" + uri;

            window.open(url, "_self");
        }


        function complete(authResponse)
        {
            if(authResponse)
            {
                Main.settings.fbToken = authResponse.accessToken;
                Main.settings.fbUid = authResponse.userID;
            }

            Loading.hide();
            if(cb) cb.apply();
        }
    }

    function onResize()
    {
        var width = $(window).width(),
            height = $(window).height();

        var obj = ScalableContent.updateView(width, height);
        self.settings.viewport.changed = obj.modeChanged;
        self.settings.viewport.index = obj.modeIndex;
        //ScalableContent.updateResizeAble();
    }

}());
