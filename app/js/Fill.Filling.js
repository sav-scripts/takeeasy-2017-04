(function ()
{
    var $doms = {},
        _isHiding = true,
        _numWorks = 4,
        _minInputLength = 4,
        _currentIndex = null,
        _illustList = [],
        _isRuleConfirmed = false,
        _isFillReady = false,
        _geom =
        {
            '0':
            {
                illustGap: 20,
                illustWidth: 464
            },
            '1':
            {
                illustGap: 20,
                illustWidth: 464
            }
        };

    var self = window.Fill.Filling =
    {
        isLocking: false,

        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $container.parent();

            $doms.btnToRule = $doms.container.find(".btn-to-rule").on(_CLICK_, function()
            {
                SceneHandler.toHash("/Rule");
            });

            $doms.workContainer = $doms.container.find(".works");

            for(var i=1;i<=_numWorks;i++)
            {
                var illust = _illustList[i - 1] = new Fill.Illust(i, $doms.container.find(".work-" + i));

                illust.$container.detach();
            }

            $doms.btnToPrev = $doms.container.find('.arrow-left').on(_CLICK_, function()
            {
                self.toPrev();
            });

            $doms.btnToNext = $doms.container.find('.arrow-right').on(_CLICK_, function()
            {
                self.toNext();
            });


            $doms.btnToSample = $doms.container.find(".btn-to-sample").on(_CLICK_, function()
            {
                ga("send", "event", "練肖話 - 輸入畫面", "按鈕點擊", "看範例");

                Fill.Examples.show();
            });

            $doms.btnSend = $doms.container.find(".btn-send").on("click", function()
            {
                ga("send", "event", "練肖話 - 輸入畫面", "按鈕點擊", "完成送出");

                if(!_isFillReady)
                {
                    alert("請輸入填空內容");
                }
                else if(!_isRuleConfirmed)
                {
                    alert("您必須同意我們的活動辦法");
                }
                else
                {
                    Fill.setSendingIllust(_illustList[_currentIndex]);
                    Fill.toStep("form");
                }
            });

            $doms.ruleCheckbox = $doms.container.find("#filling-checkbox").on("change", function()
            {
                self.update();
            });

            self.toIndex(0);

            $doms.container.detach();
        },

        toNext: function()
        {
            var index = _currentIndex + 1;
            if(index >= _numWorks) index = 0;
            self.toIndex(index, false);
        },

        toPrev: function()
        {
            var index = _currentIndex - 1;
            if(index < 0) index = (_numWorks-1);
            self.toIndex(index, true);
        },

        toIndex: function(index, isToPrev, instantSet)
        {
            if(self.isLocking) return;
            if(_currentIndex === index) return;

            var oldIndex = _currentIndex;
            _currentIndex = index;

            var illust,
                tl,
                oldIllust,
                newIllust;

            var vp = Main.settings.viewport,
                geom = _geom[vp.index],
                offsetX = geom.illustWidth + geom.illustGap,
                targetX;


            if(oldIndex !== null) oldIllust = _illustList[oldIndex];
            newIllust = _illustList[_currentIndex];

            if(instantSet || oldIndex === null)
            {
                newIllust.$container.css('left', 0);
                $doms.workContainer.append(newIllust.$container);

                if(oldIllust)
                {
                    oldIllust.close();
                    oldIllust.$container.detach();
                }

                newIllust.open();

                self.update();

                return;
            }

            $doms.workContainer.append(newIllust.$container);

            if(isToPrev)
            {
                newIllust.$container.css('left', -offsetX);
                targetX = offsetX;
            }
            else
            {
                newIllust.$container.css('left', offsetX);
                targetX = -offsetX;
            }

            self.isLocking = true;

            oldIllust.close();

            self.update();

            tl = new TimelineMax;
            tl.to(oldIllust.$container,.5, {left:targetX});
            tl.to(newIllust.$container,.5, {left:0}, 0);

            tl.add(function()
            {
                newIllust.open();
                oldIllust.$container.detach();
                self.isLocking = false;
            });
        },



        update: function()
        {
            var illust = _illustList[_currentIndex];

            //console.log(illust.getInputString());

            _isFillReady = (illust.getInputString().length >= _minInputLength);
            _isRuleConfirmed = $doms.ruleCheckbox[0].checked;

            var activeBtnSend = (_isFillReady && _isRuleConfirmed);

            $doms.btnSend.toggleClass("disactivated", !activeBtnSend);
        },

        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga("send", "pageview", "練肖話 - 輸入畫面");

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0, marginTop:50});
            tl.to($doms.container, .4, {autoAlpha: 1, marginTop: 0}, delay);
            tl.add(function ()
            {
                if (cb) cb.apply();

                if(!Fill.Examples.isShown)
                {
                    Fill.Examples.show();
                }
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

