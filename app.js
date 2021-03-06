var express = require('express');
var request = require('request');
var app = express();

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('search');
});


var resultData = {
    'search': []
};
var favData = {
    'search': []
};

app.get('/results', function (req, res) {
    var query = req.query.search;
    var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=bae2fed8';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            data.Search.forEach(function (table) {
                var imdbID = table.imdbID;
                var Fullurl = 'https://www.omdbapi.com/?i=' + imdbID + '&apikey=bae2fed8';
                request(
                    Fullurl,
                    function (error1, response1, body1) {
                        if (!error1 && response1.statusCode == 200) {
                            var data1 = JSON.parse(body1)
                            data1["classname"] = "fa fa-heart-o";
                            resultData.search.push(data1);

                        }
                    });
            });

            res.render('results', {
                resultData: resultData
            });
            resultData = {
                'search': []
            };
        }
    });
});
var favData = {
    'search': []
};
app.get('/result', function (req, res) {

    res.render('results', {
        resultData: resultData
    });
});

function resultTravel(id) {
    for (i = 0; i < resultData.search.length; i++) {
        if (id == resultData.search[i].imdbID) {

            if (resultData.search[i].classname = 'fa fa-heart-o') {
                resultData.search[i].classname = 'fa fa-heart'
            }
            //else{
            //     resultData.search[i].classname = 'fa fa-heart'
            // }

        }
    }
}
app.get('/favorites', function (req, res) {
    var query = req.query.fav;

    var count = 1;
    var Fullurl = 'https://www.omdbapi.com/?i=' + query + '&apikey=bae2fed8';
    request(Fullurl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            var id = data.imdbID;

            if (favData.search.length == 0) {

                resultTravel(id)
                favData.search.push(data);
            } else {
                for (i = 0; i < favData.search.length; i++) {
                    cluster = favData.search[i].imdbID;
                    if (cluster == query) {
                        favData.search.splice(i, i)
                        count = 0;
                    }
                }
                if (count == 1) {
                    resultTravel(id)
                    favData.search.push(data);
                }
            }
        }
    });
    res.render('results', {
        resultData: resultData
    });
});
app.get('/favMaovies', function (req, res) {

    res.render('favourite', {
        resultsData: favData
    });
});

app.get('/remove', function (req, res) {
    var query = req.query.fav;

    for (i = 0; i < favData.search.length; i++) {
        cluster = favData.search[i].imdbID;
        if (favData.search[0].imdbID == query) {
            favData.search.splice(i, 1)
        }
        if (cluster == query) {
            favData.search.splice(i, i)
        }

    }
    res.render('favourite', {
        resultsData: favData
    });
});
app.listen(3000, function () {
    console.log('Movie app started on port: http://localhost:3000');
});