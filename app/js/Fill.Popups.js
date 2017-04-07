(function ()
{
    var $doms = {},
        _isHiding = true,
        _shareImageUrl;

    var self = window.Fill.Success =
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
                //self.hide();

                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath(),
                        picture: _shareImageUrl + "?v=" + new Date().getTime(),
                        title: "輕鬆小品 全台輕鬆練肖畫募集大賽！",
                        description: '為紓解大眾生活壓力、促進國民身心健康、培養輕鬆幽默的處世態度，輕鬆小品邀你一起輕鬆練肖畫/話、輕鬆拿獎金，還有機會登上包裝供全民欣賞喔～'
                    },function(response)
                    {
                        if(response && response.post_id)
                        {
                            self.hide();
                            Fill.ShareSuccess.show();
                        }
                    }
                );
            });

            $doms.container.detach();
        },

        setShareImageUrl: function(url)
        {
            _shareImageUrl = url;
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

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


(function ()
{
    var $doms = {},
        _isHiding = true;

    var self = window.Fill.ShareSuccess =
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
                self.hide();
                SceneHandler.toHash("/Participate");
            });

            $doms.container.detach();
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

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
            tl.to($doms.container, .4, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        }
    };

}());