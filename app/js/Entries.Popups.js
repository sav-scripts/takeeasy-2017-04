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

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
                Entries.toStep("list");
            });

            $doms.btnShare = $doms.container.find(".btn-share").on("click", function()
            {

                //alert("_shareEntrySerial = " + _shareEntrySerial);
                FB.ui
                (
                    {
                        method:"share",
                        display: "iframe",
                        href: Utility.getPath() + "?serial=" + _shareEntrySerial,
                        title: CommonForm.getLastUserName() + "參加了輕鬆小品暑假打工爽的咧",
                        description: '客倌們快來看看超有梗會笑出腹肌的爽畫作們啊～立即爽投票＋分享好友還有機會獲得7-11禮券＄200，多爽呀～～',
                        picture: _shareImageUrl + "?v=" + new Date().getTime()
                    },function(response)
                    {
                        if(!response.error && !response.error_code)
                        {
                            alert('分享成功');
                            self.hide();
                            Entries.toStep("list");
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

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0, marginTop:50});
            tl.to($doms.container, .4, {autoAlpha: 1, marginTop: 0}, delay);
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
        },

        setShareImageUrl: function(url)
        {
            _shareImageUrl = url;
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

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
            });

            $doms.btnEntries = $doms.container.find(".btn-entries").on("click", function()
            {
                self.hide();

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
            tl.set($doms.container, {autoAlpha: 0, marginTop:50});
            tl.to($doms.container, .4, {autoAlpha: 1, marginTop: 0}, delay);
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

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();
            });

            $doms.btnEntries = $doms.container.find(".btn-entries").on("click", function()
            {
                self.hide();

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
            tl.set($doms.container, {autoAlpha: 0, marginTop:50});
            tl.to($doms.container, .4, {autoAlpha: 1, marginTop: 0}, delay);
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
