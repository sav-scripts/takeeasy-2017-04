(function ()
{
    var $doms = {},
        _isInit = false,
        _currentStep = 'upload',
        _stepDic;

    var self = window.Entries =
    {
        firstEntrySerial: null,

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
                        {url: "_entries.html", startWeight: 0, weight: 100, dom: null}
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

        toStep: function(step)
        {
            if(step == _currentStep) return;

            _stepDic[_currentStep].hide();

            _currentStep = step;
            self.Title.update(_currentStep);

            if(_currentStep == "vote")
            {
                CommonForm.setMode("vote");
            }

            _stepDic[_currentStep].show();
        },

        resize: function ()
        {
            var viewport = Main.settings.viewport;
            self.List.resize(viewport);
        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#entries");


        _stepDic =
        {
            "list": self.List,
            "vote": CommonForm
        };



        self.Title.init($doms.container.find(".content-title"));
        self.List.init($doms.container.find(".content-list"));

        self.Reviewing.init($("#entries-reviewing"));
        self.Unapproved.init($("#entries-unapproved"));
        self.VoteSuccess.init($("#entries-vote-success"));
        self.ShareSuccess.init($("#entries-share-success"));


        $doms.container.detach();
    }



    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        _currentStep = 'list';
        self.Title.update(_currentStep);
        //self.Title.show();
        self.List.show(0, cb);

        //self.Unapproved.show();
    }

    function hide(cb)
    {
        _stepDic[_currentStep].hide(0, function()
        {
            $doms.container.detach();
            cb.apply();
        });

        //self.Title.hide(0, function()
        //{
        //    $doms.container.detach();
        //    cb.apply();
        //});
    }

}());



(function ()
{
    var $doms = {},
        _isHiding = true;

    window.Entries.Title =
    {
        init: function ($container)
        {
            $doms.container = $container;
            $doms.parent = $container.parent();

            $doms.container.detach();
        },
        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            $doms.parent.append($doms.container);

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0, marginLeft:-100});
            tl.to($doms.container, .4, {autoAlpha: 1, marginLeft: 0}, delay);
            tl.add(function ()
            {
                if(cb) cb.apply();
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
                if(cb) cb.apply();
            });

        },

        update: function(step)
        {
            $doms.container.toggleClass("form-mode", step == 'vote');
        }
    };

}());



