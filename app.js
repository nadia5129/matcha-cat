import express from 'express';
const app = express();

import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 3003;

app.set('view engine', 'ejs');

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

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

// --- ORDER HISTORY ---
const allOrders = []; // New array for permanent history

// --- CART STORAGE ---
let cart = []; // Stores current order items

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
        size: req.body.size || "Standard", // Pastries won't have a size
        milk: req.body.milk || "N/A",
        syrup: req.body.syrup || "None",
        instructions: req.body.specialInstructions || "None",
        price: "$4.00", // In a real app, you'd calculate this based on size/syrup
        timestamp: new Date().toLocaleString()
    };

    cart.push(orderItem);
    console.log("Current Cart:", cart);
    
    // Redirect to the review page to see the added item
    res.redirect('/review');
});

app.get('/review', (req, res) => {
    // We pass the cart array to the review page
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
    // You must pass the cart data here so the EJS file can "see" it
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
const accountSubmissions = [];

app.get('/create-an-account', (req, res) => {
    res.render('create-an-account');
});

app.post('/submit', (req, res) => {
    const submission = {
        username: req.body.username,
        firstName: req.body.fname,
        lastName: req.body.lname,
        phone: req.body.phone,
        birthday: req.body.birthday,
        email: req.body.email,
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
    // Get the index from the hidden input field in our form
    const index = req.body.itemIndex;

    // Check if the index exists and is within the bounds of our cart array
    if (index !== undefined && index >= 0 && index < cart.length) {
        // .splice(startingIndex, numberOfItemsToRemove)
        cart.splice(index, 1);
        console.log(`Item at index ${index} removed. Remaining items: ${cart.length}`);
    }

    // Redirect the user back to the review page to see the updated list
    res.redirect('/review');
});

// --- PLACE ORDER ROUTE ---
app.post('/place-order', (req, res) => {
    const finalOrder = {
        customerName: req.body.nameOnCard,
        email: req.body.email,
        items: [...cart], // Creates a snapshot of the current cart
        total: (cart.length * 4.00).toFixed(2), // Simple math for now
        timestamp: new Date().toLocaleString()
    };

    allOrders.push(finalOrder); // Saves it to your "Admin" history
    cart = []; // Empties the cart for the next customer

    res.render('confirmation', { orderDetails: finalOrder });
});

app.get('/admin-orders', (req, res) => {
    res.render('admin-orders', { orders: allOrders });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});