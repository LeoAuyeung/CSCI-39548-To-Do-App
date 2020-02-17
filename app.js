const express = require('express')
const Handlebars = require("handlebars"); // https://www.npmjs.com/package/handlebars
const exphbs = require('express-handlebars') // https://www.npmjs.com/package/express-handlebars
var fs = require('fs');

const app = express()
app.use(express.urlencoded({ extended: false })); // necessary for HTML form submission to express
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

app.post('/submit', function (req, res) {
    console.log(req.body.name);
    res.send('You sent the data "' + req.body.name + '".');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
