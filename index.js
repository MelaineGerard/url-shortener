const express = require('express'),
    app = express(),
    port = 8000,
    Twig = require('twig'),
    bodyParser = require("body-parser"),
    { v4: uuidv4 } = require('uuid'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    return res.render('index.twig')
})

app.post('/create', (req, res) => {
    if(req.body.url && req.body.url.startsWith('http')){
        let uuid = uuidv4();
        config['urls'][uuid] = req.body.url
        fs.writeFileSync('config.json', JSON.stringify(config, null, 4));

        return res.json({
            shortenUrl: `${config.url}/${uuid}`,
            url: req.body.url
        })
    }
    return res.redirect('/')
})


app.get('/:uuid', (req, res) => {
    let data = config['urls'][req.params.uuid]
    if(data) {
        return res.redirect(data)
    }
    return res.redirect("/")
})

app.listen(port, () => {
    console.log(`Listenning on port ${port}`);
})