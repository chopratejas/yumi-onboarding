const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/api/generate-plan', require('./api/generatePlan'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
