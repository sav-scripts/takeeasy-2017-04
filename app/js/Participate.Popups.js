(function ()
{
    var $doms = {},
        _isHiding = true,
        _shareEntrySerial = null;

    var self = window.Participate.Success =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.content = $doms.container.find(".content");
            $doms.parent = $("body");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
                SceneHandler.toHash("/Entries");
            });

            $doms.btnShare = $doms.container.find(".btn-share").on("click", function()
            {
                ga('send', 'event', '練肖畫 - 投稿成功', "按鈕點擊", '立即發佈到Facebook');

                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath() + "?serial=" + _shareEntrySerial
                    },function(response)
                    {
                        if(response && response.post_id)
                        {
                            ga('send', 'event', '練肖畫 - 投稿成功', "分享成功", response.post_id);

                            self.hide();
                            Participate.ShareSuccess.show();
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

            ga('send', 'pageview', '練肖畫 - 投稿成功');

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
        }
    };

}());

(function ()
{
    var $doms = {},
        _isHiding = true,
        _shareEntrySerial = null;

    var self = window.Participate.ShareSuccess =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.content = $doms.container.find(".content");
            $doms.parent = $("body");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
                SceneHandler.toHash("/Entries");
            });

            $doms.btnToNext = $doms.container.find(".btn-to-next").on("click", function()
            {
                ga('send', 'event', '練肖畫 - 分享成功', "按鈕點擊", '我要練肖話');

                self.hide();
                SceneHandler.toHash("/Fill");
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            $doms.parent.append($doms.container);

            ga('send', 'pageview', '練肖畫 - 分享成功');

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
            tl.to($doms.container, .4, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        },

        setShareEntrySerial: function(serial)
        {
            _shareEntrySerial = serial;
        }
    };

}());