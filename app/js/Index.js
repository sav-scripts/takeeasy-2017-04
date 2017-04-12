(function ()
{
    var $doms = {},
        _isInit = false,
        _isLocking = false,
        _lastQuery,
        _sampleImage;

    var self = window.Index =
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
                        {url: "_index.html", startWeight: 0, weight: 100, dom: null}
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

        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#index");

        $doms.btnParticipate = $doms.container.find(".button-1").on(_CLICK_, function()
        {
            ga("send", "event", "首頁", "點擊按鈕", "練肖畫");

            Main.loginFB("/Participate", function()
            {
                SceneHandler.toHash("/Participate");
            });
        });

        $doms.btnFill = $doms.container.find(".button-2").on(_CLICK_, function()
        {
            ga("send", "event", "首頁", "點擊按鈕", "練肖話");

            Main.loginFB("/Entries", function()
            {
            SceneHandler.toHash("/Fill");
            });
        });

        $doms.btnVote = $doms.container.find(".button-3").on(_CLICK_, function()
        {
            ga("send", "event", "首頁", "點擊按鈕", "投票");

            Main.loginFB("/Entries", function()
            {
                SceneHandler.toHash("/Entries");
            });
        });

        setupThumbView();

        $doms.container.detach();
    }

    function setupThumbView()
    {
        $doms.thumbContainer = $doms.container.find(".thumb-block");

        $doms.sampleThumb = $doms.thumbContainer.find(".thumb-image");
        //$doms.sampleSerial = $doms.thumbContainer.find(".sample-serial");
        $doms.sampleAuthor = $doms.thumbContainer.find(".author-name");

        $doms.arrowLeft = $doms.thumbContainer.find('.arrow-left').on("mousedown", function()
        {
            requestOne_2(-1);
        });
        $doms.arrowRight = $doms.thumbContainer.find('.arrow-right').on("mousedown", function()
        {
            requestOne_2(1);
        });

        requestOne_2(0);

        function requestOne_2(plusCount)
        {
            if(_isLocking) return;
            _isLocking = true;

            var params =
            {
                "keyword": '',
                "search_type": "user_name",
                "status": "approved",
                "sort_type": "date",
                "page_index": 0,
                "page_size": 1
            };

            if(_lastQuery)
            {
                var index = parseInt(_lastQuery.page_index) + plusCount;
                if(index >= parseInt(_lastQuery.num_pages)) return;
                if(index < 0) return;

                params.page_index = index;
            }

            ApiProxy.callApi("entries_search", params, 'entries_search.serial', function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _lastQuery = response;
                    if(response.data.length > 0)
                    {
                        applyThumbData_v2();
                    }
                }

            });
        }

        function applyThumbData_v2()
        {
            var dataObj = _lastQuery.data[0];

            var image = document.createElement('img');

            $(image).css("position", "absolute").css("left", 0).css("top", 0).attr("width", "100%").attr("height", "100%");


            image.onload = function()
            {
                var oldImage = _sampleImage;

                //$doms.sampleSerial.text(dataObj.serial);
                //$doms.sampleSerial.text((parseInt(dataObj.serial) + 10000).toString().substr(1));
                $doms.sampleAuthor.text('作者：'+dataObj.name);

                _sampleImage = image;

                TweenMax.from(_sampleImage,.4, {opacity: 0, onComplete:function()
                {
                    if(oldImage) $(oldImage).detach();
                }});
                $doms.sampleThumb.append(_sampleImage);

                _isLocking = false;
                updateArrow();
            };

            image.src = dataObj.thumb_url;
        }
    }

    function updateArrow()
    {
        var index = parseInt(_lastQuery.page_index);

        $doms.arrowLeft.toggleClass("hidding", (index <= 0));
        $doms.arrowRight.toggleClass("hidding", (index >= (parseInt(_lastQuery.num_pages)-1)));
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        ga('send', 'pageview', '首頁');

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