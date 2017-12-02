const to_json = require('xmljson').to_json;
const fs = require("fs");

fs.readFile("./data/map.osm", "utf8", function (err, xml) {
    to_json(xml, function (error, data) {
        const stream = fs.createWriteStream('map.html');
        stream.once('open', function (fd) {
            const html = `
<!DOCTYPE html>
<html>
    <header>
        <meta charset="UTF-8">
        <title>osm-to-aframe</title>
        <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
    </header>
    <body>
    <a-scene></a-scene>
    <script class="inline-storage" type="application/json">${JSON.stringify(data)}</script>
    <script type="text/javascript" src="front.js"></script>
    </body>
</html>
            `;
            stream.end(html);
        });
    });
});


