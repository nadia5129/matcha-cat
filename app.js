import express from 'express';
const app = express();

const PORT = 3003;

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});