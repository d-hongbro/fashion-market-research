var http = require('http');
var url = require('url');
var querystring = require('querystring');

///////////////////////////////////////////////////////////////
var remoteUrl = 'your_remote_server_base_url_without_http.com';
///////////////////////////////////////////////////////////////

http.createServer(function (request, response) {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

    pathName = url.parse(request.url).pathname;
    query = url.parse(request.url).query;

    if (query != null) {
        pathName += '?' + query;
    }

    console.log('Remote URL : ' + remoteUrl + pathName);

    var options = {
        host: remoteUrl,
        path: pathName,
        method: request.method
    };

    http.request(options, function (res) {
        res.setEncoding('utf8');
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            response.writeHead(200, { 'Content-type': 'text/json' });
            response.write(str);
            response.end();
        });
    }).end();


}).listen(7000, function () {
    console.log('\n=============================================================');
    console.log('================== Running at port 7000 ======================');
    console.log('=============================================================\n');
});