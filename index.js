const mysql = require('mysql');
const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "take-away"
});


const app = express()
app.use(cors({
    origin: '*'
}));
const port = 5000

app.get('/user/create', (req, res) => {

    let username = req.query.fname + req.query.lname;
    let email = req.query.email
    let phone = req.query.phone
    let password = req.query.password
    let address = req.query.address


    var query = "SELECT * FROM `user` WHERE email = '" + email + "'"

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        if (Results[0]) {

            res.send({ success: false });

        }

        else {
            var query = "INSERT INTO `user`(`name`, `email`, `password`, `phone`, `address`) VALUES ('" + username + "','" + email + "','" + password + "','" + phone + "','" + address + "')"
            con.query(query)
            res.send({ success: true });

        }

    })

})


app.get('/user/get', (req, res) => {

    let email = req.query.email
    let password = req.query.password
    console.log(email)
    console.log(password)
    var query = "SELECT * FROM `user` WHERE email = '" + email + "' AND password = '" + password + "'"
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        console.log(Results)
        if (Results[0]) {

            let raw_Data = Results[0];
            let token = jwt.sign(JSON.stringify(raw_Data), 'Token')
            res.send({ success: true, token: token });

        }

        else {
            res.send({ success: false });

        }
    })

})


app.get('/item/get', (req, res) => {

    instock = req.query.instock

    if (instock == 'true') {

        var query = "SELECT * FROM `items` WHERE active = 'true'";
    }

    else {
        var query = "SELECT * FROM `items`";

    }
    console.log(query)
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        console.log(Results.length)
        if (Results.length != 0) {

            let raw_Data = Results;

            res.send({ success: true, data: raw_Data });

        }



        else {
            res.send({ success: false });

        }
    })

})


app.get('/item/update/', (req, res) => {

    id = req.query.id
    title = req.query.title
    description = req.query.description
    img = req.query.img
    price = req.query.price
    active = req.query.active


    var query = "UPDATE `items` SET `title`='" + title + "',`description`='" + description + "',`img`='" + img + "',`price`='" + price + "',`active`='" + active + "' WHERE id = '" + id + "'";

    console.log(query)
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        console.log(Results.length)
        if (Results.length != 0) {


            res.send({ success: true });

        }



        else {
            res.send({ success: false });

        }
    })

})


app.get('/item/getOne/:id', (req, res) => {

    let id = req.params.id;

    var query = "SELECT * FROM `items` WHERE id = '" + id + "'";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        console.log(Results.length)
        if (Results.length != 0) {
            console.log(Results)
            let raw_Data = Results[0];

            res.send({ success: true, data: raw_Data });

        }



        else {
            res.send({ success: false });

        }


    })

})


app.get('/item/create', (req, res) => {

    let title = req.query.title
    let description = req.query.description
    let img = req.query.img
    let price = req.query.price
    let active = req.query.active

    var query = "INSERT INTO `items`(`title`, `description`, `img`, `price`, `active`) VALUES ('" + title + "','" + description + "','" + img + "','" + price + "','" + active + "')";

    console.log(query)
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        res.send({ success: true });


    })

})

app.get('/item/delete', (req, res) => {

    let id = req.query.id

    var query = "DELETE FROM `items` WHERE id = '" + id + "'";

    console.log(query)
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        res.send({ success: true });


    })

})


app.get('/user/getAdmin', (req, res) => {

    let email = req.query.email;
    let password = req.query.password;

    var query = "SELECT * FROM `user` WHERE email = '" + email + "' AND password = '" + password + "' AND admin = 'true'";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });

        console.log(Results.length)
        if (Results.length != 0) {

            let raw_Data = Results[0];
            let token = jwt.sign(JSON.stringify(raw_Data), 'Token')
            res.send({ success: true, token: token });

        }



        else {
            res.send({ success: false });

        }


    })

})

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

