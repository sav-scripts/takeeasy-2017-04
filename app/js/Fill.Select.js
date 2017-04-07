(function ()
{
    var $doms = {},
        _isHiding = true,
        _numWorks = 4;

    var self = window.Fill.Select =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $container.parent();

            for(var i=1;i<=_numWorks;i++)
            {
                setupItem(i);
            }

            $doms.container.detach();

            function setupItem(index)
            {
                var $item = $doms.container.find(".item-" + index);
                $item.on(_CLICK_, function()
                {
                    Fill.Filling.toIndex(index-1, false, true);
                    Fill.toStep('filling');
                });
            }
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