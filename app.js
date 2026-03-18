import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = 3003;

// --- DATABASE CONNECTION ---
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

// --- MIDDLEWARE ---
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: 'matchacat',
  resave: false,
  saveUninitialized: false
}));

// Global Variables for EJS (Available in all templates)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Auth Guard Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', './views');

// --- DATA & LOGIC ---

const menuData = {
  "hot-latte": { name: "Hot Latte", price: "$4.00", image: "hot-latte.png", description: "A classic espresso drink made with steamed milk and a shot of espresso.", category: "coffee" },
  "iced-latte": { name: "Iced Latte", price: "$4.50", image: "iced-latte.png", description: "A refreshing iced espresso drink made with a milk of your choice and a shot of espresso.", category: "coffee" },
  "hot-americano": { name: "Hot Americano", price: "$3.50", image: "hot-americano.png", description: "A strong and bold espresso drink made with a shot of espresso and hot water.", category: "coffee" },
  "iced-americano": { name: "Iced Americano", price: "$4.00", image: "iced-americano.png", description: "A refreshing iced espresso drink made with a shot of espresso and cold water.", category: "coffee" },
  "mocha": { name: "Mocha", description: "Espresso, chocolate, and steamed milk blended into a café favorite.", price: "$5.25", image: "mocha.png", category: "coffee" },
  "vanilla-latte": { name: "Vanilla Latte", description: "A smooth latte flavored with sweet vanilla for a cozy classic.", price: "$4.95", image: "hot-latte.png", category: "coffee" },
  "salted-toffee-cappuccino": { name: "Salted Toffee Cappuccino", description: "A traditional cappuccino featuring a thick, velvety foam head, swirled with rich buttery toffee and a pinch of flaky sea salt.", price: "$4.95", image: "salted-toffee-cappuccino.png", category: "coffee" },
  "midnight-orange-mocha": { name: "Midnight Orange Mocha", description: "A rich dark chocolate mocha infused with tangy blood orange and finished with a velvety espresso crema.", price: "$4.95", image: "midnight-orange-mocha.png", category: "coffee" },
  "hot-matcha": { name: "Matcha Latte", price: "$4.00", image: "hot-matcha.png", description: "Deliciously smooth and creamy, our Matcha Latte is made with high-quality matcha powder and steamed milk.", category: "matcha" },
  "iced-matcha": { name: "Iced Matcha Latte", price: "$4.50", image: "iced-matcha.png", description: "A refreshing iced matcha drink made with high-quality matcha powder and a milk of your choice.", category: "matcha" },
  "strawberry-matcha": { name: "Strawberry Matcha", description: "A layered drink with sweet strawberry milk and rich green matcha.", price: "$5.75", image: "strawberry-matcha.png", category: "matcha" },
  "lavender-matcha": { name: "Lavender Matcha", description: "Floral lavender and earthy matcha come together in a dreamy latte.", price: "$5.75", image: "lavender-matcha.png", category: "matcha" },
  "honey-matcha": { name: "Honey Matcha", description: "A lightly sweetened matcha latte with warm honey notes.", price: "$5.50", image: "honey-matcha.png", category: "matcha" },
  "brown-sugar-matcha": { name: "Brown Sugar Matcha", description: "Rich brown sugar syrup swirled into creamy matcha for extra depth.", price: "$5.95", image: "brown-sugar-matcha.png", category: "matcha" },
  "toasted-coconut-matcha-latte": { name: "Toasted Coconut Matcha Latte", description: "A creamy latte made with coconut milk and a hint of toasted coconut syrup, served hot or iced.", price: "$5.95", image: "toasted-coconut-matcha-latte.png", category: "matcha" },
  "rose-white-chocolate-matcha": { name: "Rose White Chocolate Matcha", description: "A velvety white chocolate matcha latte infused with a delicate hint of rose, finished with creamy foam and a dusting of dried rose petals.", price: "$5.95", image: "rose-white-chocolate-matcha.png", category: "matcha" },
  "butter-croissant": { name: "Butter Croissant", price: "$3.00", image: "butter-croissant.png", description: "A flaky and buttery croissant made with real butter and a hint of vanilla.", category: "pastries" },
  "strawberry-roll": { name: "Strawberry Roll", price: "$3.50", image: "strawberry-roll.png", description: "A delightful roll filled with fresh strawberries and a creamy filling.", category: "pastries" },
  "chocolate-croissant": { name: "Chocolate Croissant", description: "A flaky croissant with rich melted chocolate tucked inside.", price: "$4.50", image: "chocolate-croissant.png", category: "pastries" },
  "almond-danish": { name: "Almond Danish", description: "Buttery pastry topped with sweet almond filling and sliced almonds.", price: "$4.75", image: "almond-danish.png", category: "pastries" },
  "matcha-muffin": { name: "Matcha Muffin", description: "A soft bakery muffin with a gentle green tea flavor.", price: "$4.00", image: "matcha-muffin.png", category: "pastries" },
  "cat-paw-cookie": { name: "Cat Paw Cookie", description: "An adorable café cookie with a soft bite and sweet vanilla taste.", price: "$3.50", image: "cat-paw-cookie.png", category: "pastries" },
  "cheese-danish": { name: "Cheese Danish", description: "A golden, flaky pastry featuring a rich, buttery crust that cradles a sweet and creamy cheese filling in its center.", price: "$4.00", image: "cheese-danish.png", category: "pastries" },
  "cheddar-chive-biscuit": { name: "Cheddar Chive Biscuit", description: "A savory, crumbly golden biscuit bursting with sharp melted cheddar and flecks of fresh, aromatic chives for a perfectly buttery bite.", price: "$4.00", image: "cheddar-chive-biscuit.png", category: "pastries" }
};

function applyDeals(currentCart, context = {}) {
  let updatedCart = [...currentCart];

  const isDrink = (item) => ["coffee", "matcha"].includes(item.id.includes("matcha") ? "matcha" : "coffee");
  const isPastry = (item) => ["croissant", "roll", "danish", "cookie", "muffin", "biscuit"].some(key => item.id.includes(key));

  const drinkCount = updatedCart.filter(isDrink).length;
  const hasKeychain = updatedCart.some(i => i.id === "keychain");

  // DEAL 1: Matcha → free keychain
  if (updatedCart.some(item => item.id.includes("matcha")) && !hasKeychain) {
    updatedCart.push({ id: "keychain", name: "FREE Banana Cat Keychain", price: "$0.00", size: "-", milk: "-" });
  }

  // DEAL 2: Buy 3 drinks → free pastry
  updatedCart = updatedCart.filter(item => item.id !== "free-pastry");
  if (drinkCount >= 3 && context.freePastry) {
    updatedCart.push({ id: "free-pastry", name: `FREE ${context.freePastry} (Deal)`, price: "$0.00", size: "-", milk: "-" });
  }

  // Calculate Total
  let total = updatedCart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0);

  // DEAL 3: Student discount (5%)
  if (context.isStudent && context.orderType === "in-store") {
    total *= 0.95;
  }

  // DEAL 4: Lunch bundle ($1 off)
  if (updatedCart.filter(isDrink).length >= 1 && updatedCart.filter(isPastry).length >= 1 && context.orderType === "takeout") {
    total -= 1.00;
  }

  return { items: updatedCart, total: total.toFixed(2) };
}

// --- CART STORAGE ---
let cart = [];

// --- ROUTES ---

app.get('/', (req, res) => res.render('home'));
app.get('/menu', (req, res) => res.render('menu', { menu: menuData }));

app.get('/menu-item/:id', (req, res) => {
  const item = menuData[req.params.id];
  item ? res.render('menu-item', { item, itemId: req.params.id }) : res.status(404).render('404');
});

// Ordering Logic
app.post('/add-to-order', (req, res) => {
  const menuItem = menuData[req.body.itemId];
  if (!menuItem) return res.status(400).send('Item not found.');

  let finalPrice = parseFloat(String(menuItem.price).replace('$', ''));
  if (req.body.syrup && req.body.syrup !== 'none') finalPrice += 0.50;

  cart.push({
    id: req.body.itemId,
    name: menuItem.name,
    size: req.body.size || "Standard",
    milk: req.body.milk || "N/A",
    syrup: req.body.syrup || "none",
    instructions: req.body.specialInstructions || 'None',
    price: `$${finalPrice.toFixed(2)}`,
    image: menuItem.image
  });

  res.redirect(req.session.user ? '/review' : '/pre-order');
});

app.get('/review', (req, res) => res.render('review', { order: cart }));

app.post('/remove-from-cart', (req, res) => {
  const index = req.body.itemIndex;
  if (index >= 0 && index < cart.length) cart.splice(index, 1);
  res.redirect('/review');
});

// Simple Navigation Routes
app.get('/pre-order', (req, res) => res.render('pre-order'));
app.get('/deals', (req, res) => res.render('deals'));
app.get('/reservation', (req, res) => res.render('reservation'));
app.get('/confirmation', (req, res) => res.render('confirmation', { orderDetails: null }));

// Account & Personalized Reservations
app.get('/account', async (req, res) => {
  const user = req.session.user || null;
  let reservations = [];

  if (user) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM reservations WHERE email = ? ORDER BY date DESC',
        [user.email]
      );
      reservations = rows;
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  }
  res.render('account', { user, reservations });
});

app.get('/checkout', (req, res) => {
  // We pass 'in-store' as a default or check a query param
  // This calculates the total WITH the potential student discount
  const result = applyDeals(cart, { 
    isStudent: !!req.session.user, 
    orderType: 'in-store' 
  });

  res.render('checkout', { 
    order: result.items, 
    total: result.total // <--- This is the secret sauce
  });
});

app.post('/place-order', async (req, res) => {
  try {
    const result = applyDeals(cart, {
      isStudent: req.body.student === 'on',
      orderType: req.body.orderType,
      freePastry: req.body.freePastry
    });

    const [orderDB] = await pool.execute(
      'INSERT INTO orders (customer_name, email, total) VALUES (?, ?, ?)',
      [req.body.nameOnCard, req.body.email, result.total]
    );

    for (const item of result.items) {
      await pool.execute(
        `INSERT INTO order_items (order_id, name, size, milk, syrup, instructions, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderDB.insertId, item.name, item.size || "-", item.milk || "-", item.syrup || "none", item.instructions || "Deal", parseFloat(item.price.replace('$', ''))]
      );
    }

    const summary = { customerName: req.body.nameOnCard, email: req.body.email, items: result.items, total: result.total };
    cart = [];
    res.render('confirmation', { orderDetails: summary });
  } catch (err) {
    console.error(err);
    res.status(500).send('Order Error');
  }
});

// Auth & Registration
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [req.body.username, req.body.password]);
    if (rows.length === 0) return res.render('login', { error: 'Invalid credentials.' });
    req.session.user = rows[0];
    res.redirect('/account');
  } catch (err) { res.status(500).send('Login error'); }
});

app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));

app.get('/create-an-account', (req, res) => res.render('create-an-account'));
app.post('/submit', async (req, res) => {
  try {
    await pool.execute(
      `INSERT INTO accounts (username, first_name, last_name, phone, birthday, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.body.username, req.body.fname, req.body.lname, req.body.phone, req.body.birthday, req.body.email, req.body.password]
    );
    res.render('confirm-create-an-account', { submission: req.body });
  } catch (err) { res.status(500).send('Error creating account'); }
});

// Reservation Submission
app.post('/reserve', async (req, res) => {
  try {
    const reservation = { ...req.body, timestamp: new Date().toLocaleString() };
    await pool.query(
      `INSERT INTO reservations (fname, phone, email, date, time, size, comment) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.body.fname, req.body.phone, req.body.email, req.body.date, req.body.time, req.body.size, req.body.comment || ""]
    );
    res.render('reservation-confirmation', { reservation });
  } catch (err) { res.status(500).send('Error'); }
});

// Admin Routes
app.get('/admin-create-an-account', async (req, res) => {
  try {
    const [submissions] = await pool.query(`SELECT username, first_name AS firstName, last_name AS lastName, phone, birthday, email, created_at AS timestamp FROM accounts ORDER BY created_at DESC`);
    res.render('admin-create-an-account', { submissions });
  } catch (err) { res.status(500).send('Error loading accounts'); }
});

app.get('/admin-reservation', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations ORDER BY id DESC');
    res.render('admin-reservation', { submissions: rows });
  } catch (err) { res.status(500).send('Error loading reservations'); }
});

app.get('/admin-orders', isAuthenticated, async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders ORDER BY id DESC');
    for (let o of orders) {
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      o.items = items;
    }
    res.render('admin-orders', { orders });
  } catch (err) { res.status(500).send('Error fetching orders'); }
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));