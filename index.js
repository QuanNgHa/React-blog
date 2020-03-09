const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(5000);

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://QN:1234@react-blog-xiuyz.gcp.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, }).then(() => console.log('DB Connected'))
    .catch(err => console.error(err));
