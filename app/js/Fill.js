(function ()
{
    var $doms = {},
        _isInit = false,
        _currentStep = 'select',
        //_currentStep = 'filling',
        _defaultStep = _currentStep,
        _sendingIllust = null,
        _rawShareImage = null,
        _stepDic;

    var self = window.Fill =
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
                        {url: "_fill.html", startWeight: 0, weight: 82, dom: null}
                    ];


                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    _rawShareImage = document.createElement('img');
                    _rawShareImage.onload = function()
                    {
                        Loading.progress(100);
                        build(templates);
                        _isInit = true;
                        Loading.hide();
                        cb.apply(null);
                    };

                    _rawShareImage.src = './misc/share.fill.raw.jpg';


                }, true);
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
                $doms.container.detach();
                CommonForm.setMode("fill");
            }
            else
            {
                $("#scene-container").append($doms.container);
            }

            _stepDic[_currentStep].show();
        },


        setSendingIllust: function(illust)
        {
            _sendingIllust = illust;
        },

        getSendingCanvas: function()
        {
            if(_sendingIllust)
            {

                var illustGeom =
                {
                    x: 322,
                    y: 197,
                    width: 544,
                    height: 406
                };

                var illustCanvas = _sendingIllust.getOutputCanvas();

                var canvas = Helper.imageToCanvas(_rawShareImage, _rawShareImage.width, _rawShareImage.height);
                var ctx = canvas.getContext("2d");

                ctx.drawImage(illustCanvas, illustGeom.x, illustGeom.y, illustGeom.width, illustGeom.height);

                //Main.testCanvas(canvas);

                return {canvas: canvas, illustCanvas: illustCanvas};
            }
            else
            {
                return null;
            }
        },

        getIllustIndex: function()
        {
            if(_sendingIllust)
            {
                return _sendingIllust.index;
            }
            else
            {
                return null;
            }
        },

        getDescription: function()
        {

            if(_sendingIllust)
            {
                return _sendingIllust.getInputString();
            }
            else
            {
                return null;
            }
        },

        resize: function ()
        {
            if(_isInit)
            {
                if(_stepDic[_currentStep] && _stepDic[_currentStep].resize) _stepDic[_currentStep].resize();
            }
        }
    };


    function build(templates)
    {
        _stepDic =
        {
            "select": self.Select,
            "filling": self.Filling,
            "form": CommonForm
        };

        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#fill");

        self.Select.init($doms.container.find(".select-step"));
        self.Filling.init($doms.container.find(".filling-step"));
        self.Examples.init($("#fill-examples"));
        self.Success.init($("#fill-success"));
        self.ShareSuccess.init($("#fill-share-success"));


        $doms.container.detach();
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        if(Main.settings.viewport.index == 0)
        {
            _currentStep = 'filling';
        }
        else
        {
            _currentStep = _defaultStep;
        }

        _stepDic[_currentStep].show(0, cb);
    }

    function hide(cb)
    {
        self.Examples.hide();

        _stepDic[_currentStep].hide(0, function()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());