const express = require('express');
const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth')
const config = require('./config/key');

app.get('/', (req, res) => {
    res.json({ "hello": "I love you BTD" });
});



mongoose.connect(config.mongoURI,
    { useNewUrlParser: true, }).then(() => console.log('DB Connected'))
    .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Use AUTH as a middleware
app.get("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role

    })
})


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    //Save information in Mongo DB
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });

})

app.post('/api/users/login', (req, res) => {
    //Find the email 
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        //comparePassword
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "Wrong password"
                })
            }
        })
        //generateToken 
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("x_auth", user.token).status(200).json({
                loginSuccess: true
            });
        });
    });
});

app.get('/api/user/logout', auth, (req, res) => {
    //user._id come from auth
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            sucess: true
        });
    });
});


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Running at ${port}`);

});

