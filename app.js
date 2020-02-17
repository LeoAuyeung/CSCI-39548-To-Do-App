const express = require('express')
const Handlebars = require("handlebars"); // https://www.npmjs.com/package/handlebars
const exphbs = require('express-handlebars') // https://www.npmjs.com/package/express-handlebars
var http = require('http')
var fs = require('fs');

const app = express()
const port = 3000

// app.use(express.static('public')); // used to host 'public' folder as static HTML

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var source = "To-do list:" +
    `<ul>
        {{#each .}}
            {{#if completed}}
            <li><del>{{name}}</del></li>
            {{else}}
            <li>{{name}}</li>
            {{/if}}
        {{/each}}
    </ul>`
var template = Handlebars.compile(source);

app.get('/', async function (req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        // if (err) throw err;
        const html = template(JSON.parse(data));
        res.render('home', {
            body: html
        });
    })
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
