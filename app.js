import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3003;

app.set('view engine', 'ejs');

// Pages
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/menu-item', (req, res) => {
  res.render('menu-item');
});

app.get('/deals', (req, res) => {
  res.render('deals');
});

app.get('/reservation', (req, res) => {
  res.render('reservation');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

app.get('/account', (req, res) => {
  res.render('account');
});

app.get('/create-an-account', (req, res) => {
  res.render('create-an-account');
});

app.get('/review', (req, res) => {
  res.render('review');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// array to store account submit for create-an-account.ejs
const accountSubmissions = [];
// store it
app.post('/submit', (req, res) => {
  let username = req.body.username;
  let firstName = req.body.fname;
  let lastName = req.body.lname;
  let phone = req.body.phone;
  let birthday = req.body.birthday;
  let email = req.body.email;

  const submission = {
    username,
    firstName,
    lastName,
    phone,
    birthday,
    email,
    timestamp: new Date().toLocaleString()
  };
  accountSubmissions.push(submission);

  res.render('confirm-create-an-account', { submission });
});
app.get('/confirm-create-an-account', (req, res) => {
  res.render('confirm-create-an-account', { submission: null });
});

app.get('/admin-create-an-account', (req, res) => {
  res.render('admin-create-an-account', { submissions: accountSubmissions });
});