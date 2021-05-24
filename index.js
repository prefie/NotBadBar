import express from 'express';
import path from 'path';
import hbs from "express-handlebars";

const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

app.set("view engine", "hbs");

app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
    })
);

app.use('/visualisation', express.static('visualisation'));

app.get("/", (_, res) => {
    res.redirect('/main');
});

app.get('/game', (req, res) => {
    res.render('game');
});

app.get('/main', (req, res) => {
    res.render('start');
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
