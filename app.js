const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const schoolRoutes = require('./routes/schoolRoutes');
app.use('/', schoolRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
