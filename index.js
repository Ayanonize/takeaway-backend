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

        var query = "SELECT * FROM `items` WHERE active = 'true' ORDER BY id DESC";
    }

    else {
        var query = "SELECT * FROM `items`";

    }
    console.log(query)
    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


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


app.get('/coupon/create', (req, res) => {

    let code = req.query.code;
    let use_limit = req.query.use_limit;
    let discount = req.query.discount;
    let active = req.query.active;

    var query = "SELECT * FROM `coupon` WHERE code = '" + code + "'";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        if (Results.length == 0) {

            var query = "INSERT INTO `coupon`(`code`, `use_limit`, `used` ,  `discount`, `active`) VALUES ('" + code.toUpperCase() + "' , '" + use_limit + "' , '0' , '" + discount + "' , '" + active + "')";
            con.query(query, (err, Results) => {
                console.log(query)
                res.send({ success: true });
            })

        }



        else {
            res.send({ success: false });

        }


    })

})


app.get('/coupon/get', (req, res) => {

    var query = "SELECT * FROM `coupon`";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        if (Results.length != 0) {

            res.send({ success: true, data: Results });

        }



        else {
            res.send({ success: false });

        }


    })

})

app.get('/coupon/getOne/:code', (req, res) => {

    let code = req.params.code

    var query = "SELECT * FROM `coupon` WHERE code = '" + code.toUpperCase() + "' AND active = 'true'";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        if (Results.length != 0) {

            let used = Results[0].used + 1;
            console.log(Results[0])
            console.log(used)
            if (Results[0].active == 'true' && used >= Results[0].use_limit) {
                var query = "UPDATE `coupon` SET `used`='" + used + "' , `active`='false' WHERE code = '" + code + "'";
            }

            else {
                var query = "UPDATE `coupon` SET `used`='" + used + "' WHERE code = '" + code + "'";
            }

            con.query(query)
            console.log(query)

            res.send({ success: true, data: Results[0] });

        }



        else {
            res.send({ success: false });

        }


    })

})

app.get('/coupon/delete/:code', (req, res) => {

    let code = req.params.code

    var query = "DELETE FROM `coupon` WHERE code = '" + code.toUpperCase() + "'";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });
        res.send({ success: true, data: Results[0] });


    })

})

app.get('/order/create', (req, res) => {

    let name = req.query.name
    let email = req.query.email
    let phone = req.query.phone
    let address = req.query.address
    let quantity = req.query.quantity
    let state = req.query.state
    let city = req.query.city
    let discount = req.query.discount
    let product_id = req.query.product_id
    let price = req.query.price


    var query = "INSERT INTO `orders`(`name`, `email`, `address`, `state`, `city`, `phone`, `product_id`, `quantity`, `discount` , `price`) VALUES ('" + name + "' , '" + email + "' , '" + address + "' , '" + state + "' , '" + city + "' , '" + phone + "' , '" + product_id + "' , '" + quantity + "' , '" + discount + "' , '" + price + "')";

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });
        res.send({ success: true });


    })

})

app.get('/order/get', (req, res) => {


    var filter = req.query.filter;

    console.log("filter: " + filter);

    if (filter == 'pending') {

        var query = "SELECT * FROM `orders` WHERE status = 'pending' ORDER BY id Desc";
    }

    else if (filter == 'cancelled') {
        var query = "SELECT * FROM `orders` WHERE status = 'cancelled' ORDER BY id Desc";

    }

    else if (filter == 'delevered') {

        var query = "SELECT * FROM `orders` WHERE status = 'delevered' ORDER BY id Desc";
    }

    else if (filter == undefined) {
        var query = "SELECT * FROM `orders` ORDER BY id Desc";
    }

    con.query(query, (err, Results) => {
        if (err) res.send({ success: false });


        if (Results.length != 0) {

            res.send({ success: true, data: Results });

        }



        else {
            res.send({ success: false });

        }


    })

})


app.listen(port, () => console.log(`TakeAwat app api is listining at this port listening on port http://localhost:${port}`))

