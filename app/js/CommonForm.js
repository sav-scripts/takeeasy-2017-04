(function ()
{
    var $doms = {},
        _isHiding = true,
        _isInit = false,
        _currentMode = null,
        _votingSerial,
        _lastUserName = null,
        _ss,
        _gaCategory;

    var self = window.CommonForm =
    {
        init: function ()
        {
            _isInit = true;

            $doms.parent = $("#scene-container");
            $doms.container = $('#common-form');

            $doms.desc = $doms.container.find('.desc');

            $doms.eulaContentContainer = $doms.container.find(".content-container");

            _ss = new SimpleScroller($doms.eulaContentContainer[0], null, 0, Modernizr.touchevents).update(true);

            $doms.fields =
            {
                name: $doms.container.find(".field-name"),
                phone: $doms.container.find(".field-phone"),
                email: $doms.container.find(".field-email"),
                ruleCheck: $doms.container.find('#eula-checkbox')
            };

            $doms.btnSend = $doms.container.find(".btn-send").on("click", function()
            {
                trySend();
            });

            $doms.container.detach();
        },
        show: function (delay, cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            if(_currentMode == 'participate')
            {
                ga('send', 'pageview', '練肖畫 - 表單');
            }
            else if(_currentMode == 'fill')
            {
                ga('send', 'pageview', '練肖話 - 表單');
            }
            else if(_currentMode == 'vote')
            {
                ga('send', 'pageview', '作品瀏覽及投票 - 表單');
            }

            $doms.parent.append($doms.container);

            self.resize();

            reset();

            if (delay === undefined) delay = 0;

            var tl = new TimelineMax;
            tl.set($doms.container, {autoAlpha: 0});
            tl.to($doms.container, .4, {autoAlpha: 1}, delay);
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
            tl.to($doms.container, .4, {autoAlpha: 0}, delay);
            tl.add(function ()
            {
                $doms.container.detach();
                if (cb) cb.apply();
            });

        },

        setVotingSerial: function(serial)
        {
            _votingSerial = serial;
        },

        setMode: function(mode)
        {
            _currentMode = mode;

            $doms.desc.toggleClass('participate', false);
            $doms.desc.toggleClass('vote', false);
            $doms.desc.toggleClass('fill', false);

            $doms.desc.toggleClass(mode, true);

            if(mode == 'participate')
            {
                _gaCategory = "parttime_form";
            }
            else if(mode == 'vote')
            {
                _gaCategory = "artworks_form";
            }
            else if(mode == 'fill')
            {
                _gaCategory = "copywork_form";
            }

            return self;
        },

        getLastUserName: function()
        {
            return _lastUserName;
        },

        resize: function()
        {
            if(_isInit && _isHiding == false)
            {
                var vp = Main.settings.viewport;

                if(vp.changed)
                {
                    var containerHeight = $doms.eulaContentContainer.height(),
                        containerWidth = $doms.eulaContentContainer.width();
                    _ss.containerSize(null, containerHeight).scrollBound(containerWidth - 21, 0, 0, containerHeight - 38).update(true);
                }
            }
        }
    };

    function reset()
    {
        $doms.fields.name.val('');
        $doms.fields.phone.val('');
        $doms.fields.email.val('');
        $doms.fields.ruleCheck[0].checked = false;
    }

    function trySend()
    {
        var formObj = checkForm();
        //var formObj = {};

        if(formObj)
        {
            var canvas, imageData;

            if(_currentMode == "participate")
            {
                ga('send', 'event', '練肖畫 - 表單', "按鈕點擊", '確認送出');

                canvas = Participate.UploadStep.getRawCanvas();

                if(canvas)
                {
                    imageData = canvas.toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, "");

                    formObj.image_data = imageData;
                    formObj.description = Participate.UploadStep.getDescriptionInput();

                    Loading.progress('資料傳輸中 ... 請稍候').show();

                    ApiProxy.callApi("participate", formObj, true, function(response)
                    {
                        if(response.error)
                        {
                            ga('send', 'event', '練肖畫 - 表單', "資料送出失敗", response.error);
                            alert(response.error);
                        }
                        else
                        {
                            ga('send', 'event', '練肖畫 - 表單', "資料送出成功", response.serial);
                            Participate.Success.setShareEntrySerial(response.serial);
                            Participate.Success.show();
                        }

                        Loading.hide();
                    });

                }
                else
                {
                    alert('lack image data');
                }

            }
            else if(_currentMode == 'vote')
            {
                ga('send', 'event', '作品瀏覽及投票 - 表單', "按鈕點擊", '確認送出');

                if(!_votingSerial)
                {
                    alert('lack voting serial');
                }
                else
                {
                    formObj.serial = _votingSerial;

                    Loading.progress('資料傳輸中 ... 請稍候').show();


                    ApiProxy.callApi("entries_vote", formObj, true, function(response)
                    {
                        if(response.error)
                        {
                            ga('send', 'event', '作品瀏覽及投票 - 表單', "資料送出失敗", response.error);
                            alert(response.error);
                        }
                        else
                        {
                            ga('send', 'event', '作品瀏覽及投票 - 表單', "資料送出成功", _votingSerial);
                            Entries.VoteSuccess.setShareEntrySerial(_votingSerial);
                            Entries.VoteSuccess.setShareImageUrl(response.share_url);
                            Entries.VoteSuccess.show();
                        }

                        Loading.hide();
                    });
                }
            }
            else if(_currentMode == 'fill')
            {
                ga('send', 'event', '練肖話 - 表單', "按鈕點擊", '確認送出');

                var obj = Fill.getSendingCanvas();

                if(obj.canvas)
                {
                    formObj.image_data = obj.canvas.toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, "");
                    formObj.comic_data = obj.illustCanvas.toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, "");

                    formObj.contents = Fill.getDescription();
                    formObj.illust_index = Fill.getIllustIndex();

                    Loading.progress('資料傳輸中 ... 請稍候').show();

                    ApiProxy.callApi("filling_attending", formObj, true, function(response)
                    {
                        if(response.error)
                        {
                            ga('send', 'event', '練肖話 - 表單', "資料送出失敗", response.error);

                            alert(response.error);
                        }
                        else
                        {
                            ga('send', 'event', '練肖話 - 表單', "資料送出成功");

                            Fill.Success.setShareImageUrl(response.share_url);
                            Fill.Success.show();
                        }

                        Loading.hide();
                    });

                }
                else
                {
                    alert('lack image data');
                }
            }
            else
            {
                alert("unsupported mode");
            }
        }
    }

    function checkForm()
    {
        var formObj={};
        var dom;

        if(!$doms.fields.ruleCheck.prop("checked"))
        {
            alert('您必須同意 "授權主辦單位使用本人個人資料" 才能參加活動');
            return;
        }

        dom = $doms.fields.name[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的名稱'); dom.focus(); return;
        }else formObj.name = dom.value;

        dom = $doms.fields.phone[0];
        if(!PatternSamples.phone.test(dom.value))
        {
            alert('請輸入正確的手機號碼'); dom.focus(); return;
        }
        else formObj.phone = dom.value;

        dom = $doms.fields.email[0];
        if(!PatternSamples.email.test(dom.value))
        {
            alert('請輸入您的電子郵件信箱'); dom.focus(); return;
        }
        else formObj.email = dom.value;

        formObj.fb_uid = Main.settings.fbUid;
        formObj.fb_token = Main.settings.fbToken;

        _lastUserName = formObj.name;

        //formObj.paint_data = CanvasProxy.getBase64JPEG();

        return formObj;

    }

}());