/* reviewing */

(function ()
{
    var $doms = {},
        _numExamples = 2,
        _currentIndex = null,
        _isHiding = true,
        _geom =
        {
            '0':
            {
                illustGap: 20,
                illustWidth: 468
            },
            '1':
            {
                illustGap: 20,
                illustWidth: 468
            }
        };

    var self = window.Fill.Examples =
    {
        isLocking: false,

        isShown: false,

        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $("body");

            $doms.content = $doms.container.find(".content");

            $doms.sampleContainer = $doms.container.find('.example-container');

            $doms.btnToPrev = $doms.container.find('.arrow-left').on(_CLICK_, function()
            {
                self.toPrev();
            });

            $doms.btnToNext = $doms.container.find('.arrow-right').on(_CLICK_, function()
            {
                self.toNext();
            });
            
            $doms.sampleList = [];

            for(var i=1;i<=_numExamples;i++)
            {
                var $sample = $doms.sampleList[i-1] = $doms.container.find(".example-" + i);

                $sample.find('.btn-close').on(_CLICK_, function()
                {
                    self.hide();
                });

                $sample.detach();
            }

            self.toIndex(0);

            $doms.container.detach();
        },
        
        toNext: function()
        {
            var index = _currentIndex + 1;
            if(index >= _numExamples) index = 0;
            self.toIndex(index, false);
        },

        toPrev: function()
        {
            var index = _currentIndex - 1;
            if(index < 0) index = (_numExamples-1);
            self.toIndex(index, true);
        },

        toIndex: function(index, isToPrev)
        {
            if(self.isLocking) return;

            var oldIndex = _currentIndex;
            _currentIndex = index;

            var tl,
                $oldSample,
                $newSample;


            $newSample = $doms.sampleList[_currentIndex];

            var vp = Main.settings.viewport,
                geom = _geom[vp.index],
                offsetX = geom.illustWidth + geom.illustGap,
                targetX;

            if(oldIndex === null)
            {
                $newSample = $doms.sampleList[_currentIndex];
                $newSample.css('left', 0);
                $doms.sampleContainer.append($newSample);

                return;
            }

            $oldSample = $doms.sampleList[oldIndex];

            $doms.sampleContainer.append($newSample);

            if(isToPrev)
            {
                $newSample.css('left', -offsetX);
                targetX = offsetX;
            }
            else
            {
                $newSample.css('left', offsetX);
                targetX = -offsetX;
            }

            self.isLocking = true;

            tl = new TimelineMax;
            tl.to($oldSample,.5, {left:targetX});
            tl.to($newSample,.5, {left:0}, 0);

            tl.add(function()
            {
                $oldSample.detach();
                self.isLocking = false;
            });
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            this.isShown = true;

            ga("send", "pageview", "練肖話 - 範例");

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
            tl.set($doms.content, {marginTop: 100}, 0);
            tl.to($doms.content,.4, {marginTop: 0}, delay);
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
            //tl.to($doms.content, .4, {marginTop: -100}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        }
    };

}());