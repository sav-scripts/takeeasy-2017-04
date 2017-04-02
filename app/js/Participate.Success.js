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
            $doms.parent = $("body");

            $doms.btnClose = $doms.container.find(".btn-close").on("click", function()
            {
                self.hide();

                SceneHandler.toHash("/Entries");
            });

            $doms.btnShare = $doms.container.find(".btn-share").on("click", function()
            {
                FB.ui
                (
                    {
                        method:"share",
                        display: "iframe",
                        href: Utility.getPath() + "?serial=" + _shareEntrySerial
                    },function(response)
                    {
                        if(!response.error && !response.error_code)
                        {
                            alert('分享成功');

                            self.hide();
                            SceneHandler.toHash("/Entries");
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
        }
    };

}());