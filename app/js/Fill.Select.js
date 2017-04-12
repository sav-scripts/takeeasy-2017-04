(function ()
{
    var $doms = {},
        _isHiding = true,
        _numWorks = 4,
        _mobileGap = 475,
        _currentIndex = 1,
        _tl;

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
                var $item = $doms['item-' + index] = $doms.container.find(".item-" + index);
                $item.on(_CLICK_, function()
                {
                    if(Main.settings.viewport.index == 1)
                    {
                        ga("send", "event", "練肖話 - 選擇配圖", "配圖點擊", index);
                        toFilling(index);
                    }
                    else if(_currentIndex == index)
                    {
                        ga("send", "event", "練肖話 - 選擇配圖", "配圖點擊", index);
                        toFilling(index);
                    }
                    else
                    {
                        toIndex(index);
                    }
                });
            }

            function toFilling(index)
            {
                Fill.Filling.toIndex(index-1, false, true);
                Fill.toStep('filling');
            }
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga("send", "pageview", "練肖話 - 選擇配圖");

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

        resize: function()
        {
            update();
        }
    };

    function update()
    {
        if(_tl)
        {
            _tl.kill();
            _tl = null;
        }

        var vp = Main.settings.viewport;

        var i,
            startOffset = -(_currentIndex-1) * _mobileGap,
            $dom,
            offsetP,
            scale;

        if(vp.index == 0)
        {

            for(i=1;i<=_numWorks;i++)
            {
                $dom = $doms["item-" + i];

                offsetP = ((_mobileGap * (i-1)) + startOffset) + '%';

                scale = i == _currentIndex? 1: .9;

                TweenMax.set($dom, {marginLeft:offsetP, scale:scale});
            }
        }
        else
        {
            for(i=1;i<=_numWorks;i++)
            {
                $dom = $doms["item-" + i];

                TweenMax.set($dom, {marginLeft:0, scale:1});
            }
        }
    }

    function toIndex(index)
    {
        if(index == _currentIndex) return;

        _currentIndex = index;

        var vp = Main.settings.viewport;

        if(vp.index == 0)
        {
            if(_tl) _tl.kill();

            var startOffset = -(_currentIndex-1) * _mobileGap,
                offset,
                offsetP,
                scale,
                $dom;

            for(var i=1;i<=_numWorks;i++)
            {
                $dom = $doms["item-" + i];

                offset = _mobileGap * (i-1) + startOffset;
                offsetP = offset + "%";

                scale = i == _currentIndex? 1: .9;

                _tl = new TimelineMax;
                _tl.to($dom,.5, {marginLeft:offsetP, scale: scale}, 0);
            }
        }
        else
        {
            //TweenMax.set($doms.elements, {marginLeft:0, scale:1});
        }
    }

}());