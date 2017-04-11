(function(){

    var $doms = {},
        _isOpen = false,
        _isInit = false;

    var self = window.Menu =
    {
        init: function()
        {
            $doms.container = $("#menu");
            $doms.btnIcon = $doms.container.find('.icon').on(_CLICK_, function()
            {
                _isOpen? self.close(): self.open();
            });

            $doms.cover = $doms.container.find(".cover").on(_CLICK_, function()
            {
                self.close();
            });

            $doms.buttonContainer = $doms.container.find(".button-container");


            $doms.btnIndex = $doms.container.find(".btn:nth-child(1)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Index");
            });

            $doms.btnReviewer = $doms.container.find(".btn:nth-child(2)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Reviewer");
            });

            $doms.btnParticipate = $doms.container.find(".btn:nth-child(3)").on(_CLICK_, function()
            {
                self.close();

                Main.loginFB("/Participate", function()
                {
                    SceneHandler.toHash("/Participate");
                });
            });

            $doms.btnFill = $doms.container.find(".btn:nth-child(4)").on(_CLICK_, function()
            {
                self.close();

                Main.loginFB("/Fill", function()
                {
                    SceneHandler.toHash("/Fill");
                });
            });

            $doms.btnEntries = $doms.container.find(".btn:nth-child(5)").on(_CLICK_, function()
            {
                self.close();

                Main.loginFB("/Entries", function()
                {
                    SceneHandler.toHash("/Entries");
                });
            });

            $doms.btnRule = $doms.container.find(".btn:nth-child(6)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Rule");
            });

            $doms.btnWinnerPost = $doms.container.find(".btn:nth-child(7)").on(_CLICK_, function()
            {
                //self.close();
                //SceneHandler.toHash("/Index");
            }).css('display', 'none');

            $doms.btnWinners = $doms.container.find(".btn:nth-child(8)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Winners");
            });

            _isInit = true;
        },

        open: function()
        {
            if(_isOpen) return;
            _isOpen = true;

            self.resize();

            $doms.buttonContainer.toggleClass("open-mode", true);
            $doms.cover.toggleClass("open-mode", true);
        },

        close: function()
        {
            if(!_isOpen) return;
            _isOpen = false;

            $doms.buttonContainer.toggleClass("open-mode", false);
            $doms.cover.toggleClass("open-mode", false);

        },

        resize: function()
        {
            if(_isInit)
            {
                var vp = Main.settings.viewport;
                $doms.cover.css("height", vp.height);
            }

        }
    };

}());
