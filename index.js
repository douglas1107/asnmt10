const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('static'));

app.use(express.json());

const blobRoutes = require('./routes/blobRoutes');
app.use('/blobs', blobRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
