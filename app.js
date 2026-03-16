import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
// ask chatgpt for this option to add session into this for login and password
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = 3003;

// mysql connection pool
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 
app.use(session({
  secret:'matchacat',
  resave: false,
  saveUninitialized: false
}));

// this is the login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});
// look in the database for a row where username and password match using async and await
// then grab the information 
// if nothing came back, it mean username or pw was wrong
app.post('/login', async (req, res) => {
  try {
  const [rows] = await pool.query(
    'SELECT * FROM accounts WHERE username = ? AND password = ?',
    [req.body.username, req.body.password]
  );
  if (rows.length === 0) {
    return res.render('login', { error: 'Invalid username or password.' });
  }
  // then this mean that it pass all of that and it save the user in4 into the session
  // then direct them to account page
  req.session.user = rows[0];
  res.redirect('/account');
} catch (err) {
  console.error('Login error: ', err.message);
  return res.status(500).send('Login error: ' + err.message);

}
});
// this is log out
// wipe the session (destroy) and direct to login
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// --- MENU DATA OBJECT ---
const menuData = {
  // COFFEE
  "hot-latte": {
    name: "Hot Latte",
    price: "$4.00",
    image: "hot-latte.png",
    description: "A classic espresso drink made with steamed milk and a shot of espresso.",
    category: "coffee"
  },
  "iced-latte": {
    name: "Iced Latte",
    price: "$4.50",
    image: "iced-latte.png",
    description: "A refreshing iced espresso drink made with a milk of your choice and a shot of espresso.",
    category: "coffee"
  },
  "hot-americano": {
    name: "Hot Americano",
    price: "$3.50",
    image: "hot-americano.png",
    description: "A strong and bold espresso drink made with a shot of espresso and hot water.",
    category: "coffee"
  },
  "iced-americano": {
    name: "Iced Americano",
    price: "$4.00",
    image: "iced-americano.png",
    description: "A refreshing iced espresso drink made with a shot of espresso and cold water.",
    category: "coffee"
  },
  "mocha": {
    name: "Mocha",
    description: "Espresso, chocolate, and steamed milk blended into a café favorite.",
    price: "$5.25",
    image: "mocha.png",
    category: "coffee"
  },
  "vanilla-latte": {
    name: "Vanilla Latte",
    description: "A smooth latte flavored with sweet vanilla for a cozy classic.",
    price: "$4.95",
    image: "hot-latte.png",
    category: "coffee"
  },
  "salted-toffee-cappuccino": {
    name: "Salted Toffee Cappuccino",
    description: "A traditional cappuccino featuring a thick, velvety foam head, swirled with rich buttery toffee and a pinch of flaky sea salt.",
    price: "$4.95",
    image: "salted-toffee-cappuccino.png",
    category: "coffee"
  },
  "midnight-orange-mocha": {
    name: "Midnight Orange Mocha",
    description: "A rich dark chocolate mocha infused with tangy blood orange and finished with a velvety espresso crema.",
    price: "$4.95",
    image: "midnight-orange-mocha.png",
    category: "coffee"
  },

  // MATCHA
  "hot-matcha": {
    name: "Matcha Latte",
    price: "$4.00",
    image: "hot-matcha.png",
    description: "Deliciously smooth and creamy, our Matcha Latte is made with high-quality matcha powder and steamed milk.",
    category: "matcha"
  },
  "iced-matcha": {
    name: "Iced Matcha Latte",
    price: "$4.50",
    image: "iced-matcha.png",
    description: "A refreshing iced matcha drink made with high-quality matcha powder and a milk of your choice.",
    category: "matcha"
  },
  "strawberry-matcha": {
    name: "Strawberry Matcha",
    description: "A layered drink with sweet strawberry milk and rich green matcha.",
    price: "$5.75",
    image: "strawberry-matcha.png",
    category: "matcha"
  },
  "lavender-matcha": {
    name: "Lavender Matcha",
    description: "Floral lavender and earthy matcha come together in a dreamy latte.",
    price: "$5.75",
    image: "lavender-matcha.png",
    category: "matcha"
  },
  "honey-matcha": {
    name: "Honey Matcha",
    description: "A lightly sweetened matcha latte with warm honey notes.",
    price: "$5.50",
    image: "honey-matcha.png",
    category: "matcha"
  },
  "brown-sugar-matcha": {
    name: "Brown Sugar Matcha",
    description: "Rich brown sugar syrup swirled into creamy matcha for extra depth.",
    price: "$5.95",
    image: "brown-sugar-matcha.png",
    category: "matcha"
  },
  "toasted-coconut-matcha-latte": {
    name: "Toasted Coconut Matcha Latte",
    description: "A creamy latte made with coconut milk and a hint of toasted coconut syrup, served hot or iced.",
    price: "$5.95",
    image: "toasted-coconut-matcha-latte.png",
    category: "matcha"
  },
  "rose-white-chocolate-matcha": {
    name: "Rose White Chocolate Matcha",
    description: "A velvety white chocolate matcha latte infused with a delicate hint of rose, finished with creamy foam and a dusting of dried rose petals.",
    price: "$5.95",
    image: "rose-white-chocolate-matcha.png",
    category: "matcha"
  },

  // PASTRIES
  "butter-croissant": {
    name: "Butter Croissant",
    price: "$3.00",
    image: "butter-croissant.png",
    description: "A flaky and buttery croissant made with real butter and a hint of vanilla.",
    category: "pastries"
  },
  "strawberry-roll": {
    name: "Strawberry Roll",
    price: "$3.50",
    image: "strawberry-roll.png",
    description: "A delightful roll filled with fresh strawberries and a creamy filling.",
    category: "pastries"
  },
  "chocolate-croissant": {
    name: "Chocolate Croissant",
    description: "A flaky croissant with rich melted chocolate tucked inside.",
    price: "$4.50",
    image: "chocolate-croissant.png",
    category: "pastries"
  },
  "almond-danish": {
    name: "Almond Danish",
    description: "Buttery pastry topped with sweet almond filling and sliced almonds.",
    price: "$4.75",
    image: "almond-danish.png",
    category: "pastries"
  },
  "matcha-muffin": {
    name: "Matcha Muffin",
    description: "A soft bakery muffin with a gentle green tea flavor.",
    price: "$4.00",
    image: "matcha-muffin.png",
    category: "pastries"
  },
  "cat-paw-cookie": {
    name: "Cat Paw Cookie",
    description: "An adorable café cookie with a soft bite and sweet vanilla taste.",
    price: "$3.50",
    image: "cat-paw-cookie.png",
    category: "pastries"
  },
  "cheese-danish": {
    name: "Cheese Danish",
    description: "A golden, flaky pastry featuring a rich, buttery crust that cradles a sweet and creamy cheese filling in its center.",
    price: "$4.00",
    image: "cheese-danish.png",
    category: "pastries"
  },
  "cheddar-chive-biscuit": {
    name: "Cheddar Chive Biscuit",
    description: "A savory, crumbly golden biscuit bursting with sharp melted cheddar and flecks of fresh, aromatic chives for a perfectly buttery bite.",
    price: "$4.00",
    image: "cheddar-chive-biscuit.png",
    category: "pastries"
  }
};

// --- CART STORAGE (stays in memory - temporary) ---
let cart = [];

// --- PAGES ---

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/menu', (req, res) => {
  res.render('menu', { menu: menuData });
});

app.get('/menu-item/:id', (req, res) => {
  const itemId = req.params.id;
  const item = menuData[itemId];

  if (item) {
    res.render('menu-item', { item, itemId });
  } else {
    res.status(404).render('404');
  }
});

// --- ORDERING LOGIC ---

app.post('/add-to-order', (req, res) => {
  const itemId = req.body.itemId;
  const menuItem = menuData[itemId];

  if (!menuItem) {
    return res.status(400).send('Item not found.');
  }

  let finalPrice = parseFloat(String(menuItem.price).replace('$', ''));

  if (req.body.syrup && req.body.syrup !== 'none') {
    finalPrice += 0.50;
  }

  const orderItem = {
    id: itemId,
    name: menuItem.name,
    size: req.body.size || "Standard",
    milk: req.body.milk || "N/A",
    syrup: req.body.syrup || "none",
    instructions: req.body.keychain === 'yes' 
        ? 'Banana Cat Keychain,  ' + (req.body.specialInstructions || '') 
        : req.body.specialInstructions || 'None',
    price: `$${finalPrice.toFixed(2)}`,
    image: menuItem.image,
    timestamp: new Date().toLocaleString()
  };

  cart.push(orderItem);
  console.log("Current Cart:", cart);
 if (req.session.user) {
      return res.redirect('/review')
    }
    res.redirect('/pre-order');
});

app.get('/review', (req, res) => {
  res.render('review', { order: cart });
});

// --- THE REST OF ROUTES ---

// pre-order route
app.get('/pre-order', (req, res) => {
  res.render('pre-order');
});
// deals route
app.get('/deals', (req, res) => {
  res.render('deals');
});

app.get('/reservation', (req, res) => {
  res.render('reservation');
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { order: cart });
});

app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

app.get('/account', (req, res) => {
  // if not logged in, still show account page but as guest
  const user = req.session.user || null;
  res.render('account', { user });
});

// make a fuction to check if the user is logged in before allowing them to order

// --- RESERVATIONS ---
app.post('/reserve', async (req, res) => {
  try {
    const reservation = {
      fname: req.body.fname,
      phone: req.body.phone,
      email: req.body.email,
      date: req.body.date,
      time: req.body.time,
      size: req.body.size,
      comment: req.body.comment || "",
      timestamp: new Date().toLocaleString()
    };

    await pool.query(
      `INSERT INTO reservations (fname, phone, email, date, time, size, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reservation.fname,
        reservation.phone,
        reservation.email,
        reservation.date,
        reservation.time,
        reservation.size,
        reservation.comment
      ]
    );

    res.render('reservation-confirmation', { reservation });
  } catch (err) {
    console.error('Error saving reservation:', err);
    res.status(500).send('Error saving reservation');
  }
});

// --- ACCOUNTS ---

app.get('/create-an-account', (req, res) => {
  res.render('create-an-account');
});

// POST /submit - insert new account into MySQL
app.post('/submit', async (req, res) => {
  try {
    const sql = `INSERT INTO accounts (username, first_name, last_name, phone, birthday, email, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      req.body.username,
      req.body.fname,
      req.body.lname,
      req.body.phone,
      req.body.birthday,
      req.body.email,
      req.body.password
    ];
    const [result] = await pool.execute(sql, params);
    console.log('Account saved with ID', result.insertId);

    const submission = {
      username: req.body.username,
      firstName: req.body.fname,
      lastname: req.body.lname,
      phone: req.body.phone,
      birthday: req.body.birthday,
      email: req.body.email,
      timestamp: new Date().toLocaleString()
    };

    res.render('confirm-create-an-account', { submission });
  } catch (err) {
    console.error('Error saving account: ', err);
    res.status(500).send('Error saving account. Please try again. ');
  }
});

app.get('/confirm-create-an-account', (req, res) => {
  res.render('confirm-create-an-account', { submission: null });
});

// get /admin create-an-account, read from mysql
app.get('/admin-create-an-account', async (req, res) => {
  try {
    const [submissions] = await pool.query(`
      SELECT username, first_name AS firstName, last_name AS lastName,
             phone, birthday, email, created_at AS timestamp
      FROM accounts
      ORDER BY created_at DESC
    `);
    res.render('admin-create-an-account', { submissions });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Error loading accounts: ' + err.message);
  }
});

app.get('/admin-reservation', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservations ORDER BY id DESC');
    res.render('admin-reservation', { submissions: rows });
  } catch (err) {
    console.error('Error loading reservations:', err);
    res.status(500).send('Error loading reservations');
  }
});

// --- REMOVE FROM CART ROUTE ---
app.post('/remove-from-cart', (req, res) => {
  const index = req.body.itemIndex;

  if (index !== undefined && index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    console.log(`Item at index ${index} removed. Remaining items: ${cart.length}`);
  }

  res.redirect('/review');
});

// --- PLACE ORDER ROUTE ---
app.post('/place-order', async (req, res) => {
  try {
    const finalOrder = {
      customerName: req.body.nameOnCard,
      email: req.body.email,
      items: [...cart],
      total: cart.reduce((sum, item) => {
        return sum + parseFloat(String(item.price).replace('$', ''));
      }, 0).toFixed(2),
      timestamp: new Date().toLocaleString()
    };

    // Insert into orders table, get the new order's ID back
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_name, email, total) VALUES (?, ?, ?)',
      [finalOrder.customerName, finalOrder.email, finalOrder.total]
    );
    const orderId = result.insertId;

    // Insert each cart item linked to that order
    for (const item of cart) {
      await pool.execute(
        'INSERT INTO order_items (order_id, name, size, milk, syrup, instructions, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.name, item.size, item.milk, item.syrup, item.instructions, parseFloat(String(item.price).replace('$', ''))]
      );
    }

    cart = [];
    res.render('confirmation', { orderDetails: finalOrder });

  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).send('Something went wrong placing your order.');
  }
});

// GET /admin-orders - fetch all orders and their items from DB
app.get('/admin-orders', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders');

    for (const order of orders) {
      const [items] = await pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?', [order.id]
      );
      order.items = items;
    }

    res.render('admin-orders', { orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});