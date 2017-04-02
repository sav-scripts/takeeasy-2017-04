/**
 * Created by sav on 2016/7/22.
 */
(function(){

    var _fakeData =
    {
        "participate":
        {
            error: '',
            serial: '00001'
        },

        "entries_search":
        {
            error: "",
            data:[

                {
                    "serial": "0088",
                    "status": "approved",
                    "name": "John",
                    "num_votes": "31231",
                    "thumb_url": "http://xxxx.xx/thumbxxx.jpg",
                    "url":  "http://xxxx.xx/imagexxx.jpg",
                    "description": "bablalalala"
                }
            ],
            num_pages: 13,
            page_index: 3,
            page_size: 10
        }
    };

    var _apiExtension = ".php",
        _apiPath = "../api/";

    window.ApiProxy =
    {
        callApi: function(apiName, params, fakeDataName, cb)
        {
            var apiUrl = _apiPath + apiName + _apiExtension,
                method = "POST";

            //if(!fakeDataName) fakeDataName = apiName;

            if(Main.settings.useFakeData && fakeDataName)
            {
                if(fakeDataName === true) fakeDataName = apiName;

                var response = _fakeData[fakeDataName];

                if(fakeDataName == 'entries_search')
                {
                    response.page_index = params.page_index;
                    response.data = [];

                    var pageIndex = params.page_index,
                        startIndex = pageIndex * params.page_size,
                        index,
                        numEntries = 123,
                        i;

                    for(i=0;i<params.page_size;i++)
                    {
                        index = startIndex + i;

                        response.data.push
                        ({
                            "serial": index,
                            "name": "name " + index,
                            "num_votes": parseInt(Math.random()*3000),
                            "description": 'description ' + index,
                            "thumb_url": "./images/participate-upload-title-girl.png",
                            "url": "./images/participate-upload-title-girl.png"
                        });

                        if(index >= (numEntries-1)) break;
                    }
                }
                else if(fakeDataName == 'entries_search.single')
                {
                    response.page_index = params.page_index;
                    response.data[0].serial = response.page_index;
                }

                complete(response);
            }
            else
            {
                $.ajax
                ({
                    url: apiUrl,
                    type: method,
                    data: params,
                    dataType: "json"
                })
                .done(complete)
                .fail(function ()
                {
                    //alert("無法取得伺服器回應");
                    complete({error:"無法取得伺服器回應"});
                });
            }

            function complete(response)
            {
                if(cb) cb.call(null, response);
            }
        }
    };

}());