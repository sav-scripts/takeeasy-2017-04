(function(){

    window.Fill.Illust = function(index, $container)
    {
        this.init(index, $container);
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    window.Fill.Illust.prototype =
    {
        index: null,
        illustratorIndex: null,
        image:null,
        $container: null,
        $input: null,
        $inputBound: null,
        $btnSend: null,
        textCanvas: null,
        textCtx: null,
        _oldInputText: '',
        _isOpen: false,
        _defaultText: '請任選以下詞語來練肖話:有才、厭世、耍廢、正妹、鄉民、天真、生火、神人。',

        init: function(index, $container)
        {
            var self = this;

            this.index = index;

            this.$container = $container;

            this.$textHolder = $container.find(".text-holder");

            this.$image = $container.find(".raw-image");
            this.image = this.$image[0];

            this.$input = $container.find(".input-field").on("input", function()
            {
                //self.$input.val(text);
                //self.$btnSend.toggleClass("disactivated", text.length == 0);
                self.textToCanvas();

                Fill.Filling.update();

            });

            this.$container.on('click', function(event)
            {
                if(event.target != self.$input[0])
                {
                    //self._isOpen? self.close(): self.open();
                    self.$input.focus();
                }
            });

            this._oldInputText = this.$input.val();

            this.$input.val('');
            self.textToCanvas();
        },

        open: function()
        {
            if(this._isOpen) return;
            this._isOpen = true;

            this.$container.toggleClass("open-mode", true);
            //this.$inputBound.toggleClass("open-mode", true);

            this.$input.focus();

            this.textToCanvas();
        },

        close: function()
        {
            if(!this._isOpen) return;
            this._isOpen = false;

            this.$container.toggleClass("open-mode", false);

            //this.$inputBound.toggleClass("open-mode", (this.$input.val().length > 0));
        },

        createTextCanvas: function()
        {
            var $textCanvas = this.$container.find(".text-canvas");

            this.textCanvas = $textCanvas[0];


            this.textCanvas.startLeft = this.textCanvas.finalLeft = parseInt($textCanvas.css('left'));
            this.textCanvas.startTop = this.textCanvas.finalTop = parseInt($textCanvas.css('top'));

            $textCanvas[0].width = parseInt($textCanvas.css("width"));
            $textCanvas[0].height = parseInt($textCanvas.css("height"));

            this.textCtx = $textCanvas[0].getContext("2d");
        },

        textToCanvas: function()
        {
            var $textarea = this.$input;

            if(!this.textCtx) this.createTextCanvas();

            var text = this.$input.val(),
                width = this.textCanvas.width,
                height = this.textCanvas.height,
                fontSize = parseInt(this.$textHolder.css("font-size")),
                lineHeight = parseInt(this.$textHolder.css("line-height")),
                fontFamily = $textarea.css("font-family"),
                isHorizontalInput = true;

            //console.log(lineHeight);

            if(text.length == 0)
            {
                this.textCtx.fillStyle = 'rgba(0,0,0,.3)';
                text = this._defaultText;
            }
            else
            {
                this.textCtx.fillStyle = '#000000';
            }

            if(this._oldText === text) return;
            this._oldText = text;

            this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

            var i,
                ctx = this.textCtx,
                startX,
                startY,
                letter;

            ctx.font = fontSize + "px " + fontFamily;

            if(isHorizontalInput)
            {
                startX = 0;
                startY = fontSize;
            }
            else
            {
                startX = width - fontSize - 2;
                startY = fontSize - 3;
            }

            var string = '';

            for(i=0;i<text.length;i++)
            {
                //console.log(text[i].charCodeAt(0));
                var charCode = text[i].charCodeAt(0);

                string += text[i];

                this.$textHolder[0].innerHTML = string.replaceAll(' ', '&nbsp;');

                var stringWidth = this.$textHolder.width();

                if(charCode == 10)
                {
                    string = string.substr(0, string.length-1);
                    //console.log(string);
                    printString(string, startX, startY);
                    string = '';

                    startX = 0;
                    startY += lineHeight;
                }
                else if(stringWidth > width)
                {
                    i--;
                    string = string.substr(0, string.length-1);
                    //console.log(string);
                    printString(string, startX, startY);
                    string = '';

                    startX = 0;
                    startY += lineHeight;
                }

            }

            if(string.length > 0) printString(string, startX, startY);

            function printString(string, x, y)
            {
                //console.log("printing: " + string + ", " + y);
                ctx.fillText(string, x, y);
            }
        },

        getInputString: function()
        {
            var text = this.$input.val();
            if(text === this._defaultText) text = '';
            return text;
        },

        getOutputCanvas: function()
        {
            //var size =
            //{
            //    0: {w: 472, h:354},
            //    1: {w:347, h:261}
            //};

            //var index = Main.settings.viewport.index;

            //var w = size[index].w,
            //    h = size[index].h;
            var w = this.image.width,
                h = this.image.height;

            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;

            var ctx = canvas.getContext("2d");

            ctx.drawImage(this.image, 0, 0, w, h);
            ctx.drawImage(this.textCanvas, this.textCanvas.finalLeft, this.textCanvas.finalTop);

            //$(canvas).css("z-index", 6000).css("position", "absolute");
            //$("body").append(canvas);

            //Main.testCanvas(canvas);

            return canvas;
        }
    }

}());