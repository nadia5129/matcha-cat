import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

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

// set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// --- MENU DATA OBJECT ---
const menuData = {
    "hot-latte": {
        name: "Hot Latte",
        price: "$4.00",
        image: "hot_latte.png",
        description: "A classic espresso drink made with steamed milk and a shot of espresso."
    },
    "iced-latte": {
        name: "Iced Latte",
        price: "$4.50",
        image: "iced-latte.png",
        description: "A refreshing iced espresso drink made with a milk of your choice and a shot of espresso."
    },
    "hot-americano": {
        name: "Hot Americano",
        price: "$3.50",
        image: "hot_americano.png",
        description: "A strong and bold espresso drink made with a shot of espresso and hot water."
    },
    "iced-americano": {
        name: "Iced Americano",
        price: "$4.00",
        image: "iced_americano.png",
        description: "A refreshing iced espresso drink made with a shot of espresso and cold water."
    },
    "hot-matcha": {
        name: "Matcha Latte",
        price: "$4.00",
        image: "hot_matcha.png",
        description: "Deliciously smooth and creamy, our Matcha Latte is made with high-quality matcha powder and steamed milk."
    },
    "iced-matcha": {
        name: "Iced Matcha Latte",
        price: "$4.50",
        image: "iced-matcha.png",
        description: "A refreshing iced matcha drink made with high-quality matcha powder and a milk of your choice."
    },
    "butter-croissant": {
        name: "Butter Croissant",
        price: "$3.00",
        image: "butter_croissant.png",
        description: "A flaky and buttery croissant made with real butter and a hint of vanilla."
    },
    "strawberry-roll": {
        name: "Strawberry Roll",
        price: "$3.50",
        image: "strawberry-roll.png",
        description: "A delightful roll filled with fresh strawberries and a creamy filling."
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
        res.render('menu-item', { item: item });
    } else {
        res.status(404).render('404');
    }
});

// --- ORDERING LOGIC ---

app.post('/add-to-order', (req, res) => {
    const orderItem = {
        name: req.body.itemName,
        size: req.body.size || "Standard",
        milk: req.body.milk || "N/A",
        syrup: req.body.syrup || "None",
        instructions: req.body.specialInstructions || "None",
        price: "$4.00",
        timestamp: new Date().toLocaleString()
    };

    cart.push(orderItem);
    console.log("Current Cart:", cart);
    res.redirect('/review');
});

app.get('/review', (req, res) => {
    res.render('review', { order: cart });
});

// --- THE REST OF YOUR ROUTES ---

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
    res.render('account');
});

// --- RESERVATIONS ---
app.post('/reserve', async (req, res) => {
    try{
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
    res.render('confirm-create-an-account', {submission});
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
            total: (cart.length * 4.00).toFixed(2),
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
                [orderId, item.name, item.size, item.milk, item.syrup, item.instructions, parseFloat(item.price)]
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