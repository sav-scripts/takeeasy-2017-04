(function ()
{
    var $doms = {},
        _isInit = false,
        _fillSelections,
        _fillAuthors,
        _viewportIndex = null;

    var self = window.Winners =
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
                        {url: "_winners.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    ApiProxy.callApi("get_filling_selections", {}, 'get_filling_selections', function(response)
                    {
                        if(response.error)
                        {
                            alert(response.error);
                        }
                        else
                        {
                            _fillSelections = response.selections;
                            _fillAuthors = response.authors? response.authors: [];
                        }

                        build(templates);
                        _isInit = true;
                        cb.apply(null);

                    });


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
                var oldViewportIndex = _viewportIndex,
                    vp = Main.settings.viewport;

                _viewportIndex = vp.index;
                var isChanged = oldViewportIndex != _viewportIndex;

                if(isChanged)
                {
                    if(vp.index == 0)
                    {
                        $doms.fillContainer.selectionToIndex(0, 0);
                    }
                    else
                    {
                        $doms.fillContainer.selectionToIndex(0, 0);
                    }
                }
            }
        }
    };

    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#winners");

        setupFillSelection();

        $doms.tabParticipate = $doms.container.find(".tab-participate").on(_CLICK_, function()
        {
            alert('得獎名單尚未出爐, 敬請期待');
        });

        $doms.tabFill = $doms.container.find(".tab-fill").on(_CLICK_, function()
        {

        });

        $doms.container.detach();
    }

    function setupFillSelection()
    {
        var _maxNumSelections = 10,
            _numSelections,
            _currentFillIndex = 0,
            _offsetUnit;

        $doms.fillContainer = $doms.container.find(".fills-container");

        $doms.fillContent = $doms.fillContainer.find(".content");

        $doms.fillArrowLeft = $doms.container.find(".fill-arrow-left").on(_CLICK_, function()
        {
            var index = _currentFillIndex - 1;
            if(index < 0) index = _numSelections-1;
            selectionToIndex(index);
        });

        $doms.fillArrowRight = $doms.container.find(".fill-arrow-right").on(_CLICK_, function()
        {
            var index = _currentFillIndex + 1;
            if(index >= _numSelections) index = 0;
            selectionToIndex(index);
        });

        $doms.fillThumbs = [];

        var i, obj;

        _numSelections = _fillSelections.length;

        for(i=0;i<_maxNumSelections;i++)
        {
            obj = _fillSelections[i];

            setupThumb(i, obj);

        }

        updateArrows();

        $doms.fillContainer.selectionToIndex = selectionToIndex;

        function setupThumb(index, imageUrl)
        {

            var $dom = $doms.fillThumbs[index] = $doms.fillContainer.find(".item:nth-child("+(index+1)+")");

            if(imageUrl)
            {
                $dom.toggleClass('hidding', false).css('background-image', 'url('+imageUrl+')');
            }
            else
            {
                $dom.toggleClass('hidding', true);
            }

            var authorName = _fillAuthors[index]? _fillAuthors[index]: 'some author name';
            authorName = "作者: " + authorName;

            $dom.find(".author-name").html(authorName);
        }

        function selectionToIndex(index, duration)
        {
            //if(index == _currentFillIndex) return;

            var $dom = $doms.fillThumbs[0];
            _offsetUnit = $dom.width() + parseInt($dom.css("margin-right")) + 4;

            if(duration === undefined) duration = .5;

            _currentFillIndex = index;

            var offset = - (_currentFillIndex * _offsetUnit);

            TweenMax.killTweensOf($doms.fillContent);
            TweenMax.to($doms.fillContent,duration,{marginLeft: offset});

            updateArrows();
        }

        function updateArrows()
        {
            $doms.fillArrowLeft.toggleClass("hidding", (_currentFillIndex == 0));
            $doms.fillArrowRight.toggleClass("hidding", (_currentFillIndex == (_numSelections-1)));
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