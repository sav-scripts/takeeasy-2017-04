(function ()
{
    var $doms = {},
        _isHiding = true,
        _shareEntrySerial,
        _shareImageUrl;

    var self = window.Entries.VoteSuccess =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $("body");

            $doms.content = $doms.container.find(".content");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
                Entries.toStep("list");
            });

            $doms.btnShare = $doms.container.find(".btn-share").on("click", function()
            {
                ga('send', 'event', '作品瀏覽及投票 - 投票成功', "按鈕點擊", '立即發佈到Facebook');

                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath() + "?serial=" + _shareEntrySerial,
                        title: CommonForm.getLastUserName() + " 在輕鬆小品 全台輕鬆練肖畫募集大賽 中投下了一票",
                        description: '人客啊～快來一起看肖畫/話吧～立即投票還有機會獲得7-11禮券$200～',
                        //picture: _shareImageUrl
                        picture: _shareImageUrl + "?v=" + new Date().getTime()
                    },function(response)
                    {
                        //console.log(JSON.stringify(response));

                        if(response && response.post_id)
                        {
                            ga('send', 'event', '作品瀏覽及投票 - 投票成功', "分享成功", response.post_id);

                            self.hide();
                            Entries.ShareSuccess.show();
                        }
                    }
                );
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '作品瀏覽及投票 - 投票成功');

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
            tl.set($doms.content, {marginTop: -30}, 0);
            tl.to($doms.content,.4, {marginTop: -130}, delay);
            tl.add(function ()
            {
                if (cb) cb.apply();
            });

        },
        hide: function (delay, cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            var tl = new TimelineMax;
            tl.to($doms.container, .2, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        },

        setShareEntrySerial: function(serial)
        {
            _shareEntrySerial = serial;
        },

        setShareImageUrl: function(url)
        {
            _shareImageUrl = url;
        }
    };

}());

/* share-success */
(function ()
{
    var $doms = {},
        _isHiding = true;

    var self = window.Entries.ShareSuccess =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $("body");

            $doms.content = $doms.container.find(".content");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
            });

            $doms.btnToParticipate = $doms.container.find(".btn-to-participate").on("click", function()
            {
                ga('send', 'event', '作品瀏覽及投票 - 分享成功', "按鈕點擊", '我要練肖畫');

                self.hide();
                SceneHandler.toHash("/Participate");
            });

            $doms.btnToFill = $doms.container.find(".btn-to-fill").on("click", function()
            {
                ga('send', 'event', '作品瀏覽及投票 - 分享成功', "按鈕點擊", '我要練肖話');

                self.hide();
                SceneHandler.toHash("/Fill");
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '作品瀏覽及投票 - 分享成功');

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
            tl.set($doms.content, {marginTop: -30}, 0);
            tl.to($doms.content,.4, {marginTop: -130}, delay);
            tl.add(function ()
            {
                if (cb) cb.apply();
            });

        },
        hide: function (delay, cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            var tl = new TimelineMax;
            tl.to($doms.container, .2, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        }
    };

}());


/* reviewing */

(function ()
{
    var $doms = {},
        _isHiding = true;

    var self = window.Entries.Reviewing =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $("body");

            $doms.content = $doms.container.find(".content");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
            });

            $doms.btnEntries = $doms.container.find(".btn-entries").on("click", function()
            {
                ga('send', 'event', '作品瀏覽及投票 - 審核中', "按鈕點擊", '作品瀏覽');

                self.hide();
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '作品瀏覽及投票 - 審核中');

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
            tl.set($doms.content, {marginTop: -30}, 0);
            tl.to($doms.content,.4, {marginTop: -130}, delay);
            tl.add(function ()
            {
                if (cb) cb.apply();
            });

        },
        hide: function (delay, cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            var tl = new TimelineMax;
            tl.to($doms.container, .2, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        }
    };

}());


/* unapproved */

(function ()
{
    var $doms = {},
        _isHiding = true;

    var self = window.Entries.Unapproved =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $("body");

            $doms.content = $doms.container.find(".content");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
            });

            $doms.btnEntries = $doms.container.find(".btn-entries").on("click", function()
            {
                ga('send', 'event', '作品瀏覽及投票 - 沒有通過審核', "按鈕點擊", '作品瀏覽');

                self.hide();
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '作品瀏覽及投票 - 沒有通過審核');

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
            tl.set($doms.content, {marginTop: -30}, 0);
            tl.to($doms.content,.4, {marginTop: -130}, delay);
            tl.add(function ()
            {
                if (cb) cb.apply();
            });

        },
        hide: function (delay, cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            var tl = new TimelineMax;
            tl.to($doms.container, .2, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        }
    };

}());
