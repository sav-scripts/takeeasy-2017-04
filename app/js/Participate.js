(function ()
{
    var $doms = {},
        _isInit = false,
        _currentStep = 'upload',
        _stepDic;

    var self = window.Participate =
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
                        {url: "_participate.html", startWeight: 0, weight: 100, dom: null}
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

            if(_currentStep == "form")
            {
                CommonForm.setMode("participate");
            }

            _stepDic[_currentStep].show();
        },

        resize: function ()
        {

        }
    };


    function build(templates)
    {
        _stepDic =
        {
            "upload": self.UploadStep,
            "form": CommonForm
        };

        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#participate");

        self.UploadStep.init($doms.container.find(".content-step-upload"));
        self.Success.init($("#participate-success"));


        $doms.container.detach();
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();



        _currentStep = 'upload';

        _stepDic[_currentStep].show(0, cb);

        //var tl = new TimelineMax;
        //tl.set($doms.container, {autoAlpha: 0});
        //tl.to($doms.container, .4, {autoAlpha: 1});
        //tl.add(function ()
        //{
        //    cb.apply();
        //});
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