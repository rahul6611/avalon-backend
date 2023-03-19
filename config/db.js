const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Avalon', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conected MONGODB !!');
    }).catch((err) => {
        console.log(err);
    });
    // mongoose.set('strictQuery', false);