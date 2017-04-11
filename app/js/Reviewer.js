(function ()
{
    var $doms = {},
        _isInit = false,
        _mobileGap = 495,
        _currentIndex = 1,
        _numReviewers = 2,
        _isLocking = false,
        _tl;

    var self = window.Reviewer =
    {
        stageIn: function (options, cb)
        {
            (!_isInit) ? loadAndBuild(execute) : execute();
            function execute(isFromLoad)
            {
                if (isFromLoad && options.cbContentLoaded) options.cbContentLoaded.call();
                show(cb);
            }

            function loadAndBuild(cb)
            {
                var templates =
                    [
                        {url: "_reviewer.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    build(templates);
                    _isInit = true;
                    cb.apply(null);
                }, 0);
            }
        },

        stageOut: function (options, cb)
        {
            hide(cb);
        },

        resize: function ()
        {
            if(_isInit)
            {
                update();
            }
        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#reviewer");

        $doms.elements = [];

        setupReviewer(1);
        setupReviewer(2);

        $doms.arrowLeft = $doms.container.find(".arrow-left").on(_CLICK_, function()
        {

            var index = _currentIndex - 1;
            if(index < 1) index = _numReviewers;
            toIndex(index);
        });

        $doms.arrowRight = $doms.container.find(".arrow-right").on(_CLICK_, function()
        {
            var index = _currentIndex + 1;
            if(index > _numReviewers) index = 1;
            toIndex(index);
        });

        function setupReviewer(index)
        {
            var $reviewer = $doms['reviewer-' + index] = $doms.container.find(".pic-" + index),
                $desc = $doms['desc-' + index] = $doms.container.find(".desc-" + index);

            $doms.elements.push($reviewer[0], $desc[0]);

            $reviewer.on(_CLICK_, function()
            {
                toIndex(index);
            });
        }


        $doms.container.detach();
    }

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
            $reviewer,
            $desc,
            offsetP,
            scale;

        if(vp.index == 0)
        {

            for(i=1;i<=2;i++)
            {
                $reviewer = $doms["reviewer-" + i];
                $desc = $doms["desc-" + i];

                offsetP = ((_mobileGap * (i-1)) + startOffset) + '%';

                //$reviewer.css('margin-left', offsetP);
                //$desc.css('margin-left', offsetP);

                scale = i == _currentIndex? 1: .9;

                TweenMax.set($reviewer, {marginLeft:offsetP, scale:scale});
                TweenMax.set($desc, {marginLeft:offsetP, scale:scale});
            }
        }
        else
        {
            for(i=1;i<=2;i++)
            {
                $reviewer = $doms["reviewer-" + i];
                $desc = $doms["desc-" + i];

                //$reviewer.css('margin-left', 0);
                //$desc.css('margin-left', 0);

                TweenMax.set($reviewer, {marginLeft:0, scale:1});
                TweenMax.set($desc, {marginLeft:0, scale:1});
            }
        }

        updateArrows();
    }

    function updateArrows()
    {
        if(Main.settings.viewport.index == 0)
        {
            $doms.arrowLeft.toggleClass('hidding', (_currentIndex == 1));
            $doms.arrowRight.toggleClass('hidding', (_currentIndex == _numReviewers));
        }
        else
        {
            $doms.arrowLeft.toggleClass('hidding', true);
            $doms.arrowRight.toggleClass('hidding', true);
        }
    }

    function toIndex(index)
    {
        if(index == _currentIndex) return;

        _currentIndex = index;

        updateArrows();

        var vp = Main.settings.viewport;

        if(vp.index == 0)
        {
            if(_tl) _tl.kill();

            var startOffset = -(_currentIndex-1) * _mobileGap,
                offset,
                offsetP,
                scale;

            for(var i=1;i<=2;i++)
            {
                var $reviewer = $doms["reviewer-" + i],
                    $desc = $doms["desc-" + i];

                offset = _mobileGap * (i-1) + startOffset;
                offsetP = offset + "%";

                scale = i == _currentIndex? 1: .9;

                _tl = new TimelineMax;
                _tl.to($reviewer,.5, {marginLeft:offsetP, scale: scale}, 0);
                _tl.to($desc,.5, {marginLeft:offsetP, scale: scale}, 0);
            }
        }
        else
        {
            //TweenMax.set($doms.elements, {marginLeft:0, scale:1});
        }
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
        tl.add(function ()
        {
            cb.apply();
        });
    }

    function hide(cb)
    {
        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());