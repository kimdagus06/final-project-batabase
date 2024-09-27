const express = require("express");
const sqlite3 = require("sqlite3");
const path = require('path');
const bcrypt = require('bcrypt'); // For hasing password 
const { engine } = require("express-handlebars");
const session = require("express-session");
const conntectSqlite3 = require("connect-sqlite3"); // Store the sessions in a SQLite3 database file   
const SQLite3Store = conntectSqlite3(session); // Store sessions in the database 
const app = express();
const dbFile = "data.sqlite3.db";
const db = new sqlite3.Database(dbFile);
const port = 3333;

const adminUser = {
    userName: 'admin',
    emailAddress: 'admin@example.com',
    password: 'adminpassword', 
    agreeterms: '1'
};

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));

// Express middlewares
app.use(express.urlencoded({ extended: true })); // url passing
app.use(express.json());

 /**
  * 'secret' is the key used to sign and encrypt session IDs stored in cookies.
  * It ensures the integrity and security of session data between the client and server.
  * **This part shouldn't be hardcoded for security reasons (.env file)
  * 
  * Define the session 
  */
 app.use(session({
    secret: 'd384@#s#$#juihss.sijsge',
    resave: false,
    saveUninitialized: false,
    store: new SQLite3Store({db: "session-db.db"})
}));

/**
 * NOT NULL: Can't have a NULL value. So it can't be left empty.
 * UNIQUE: All values in a column are distinct from each other. So no two users can have the same email address.
 * 
 * Table one | Create Account 
 */
// Check if the admin user exists and create if it doesn't
db.get('SELECT * FROM users WHERE emailAddress = ?', [adminUser.emailAddress], (err, user) => {
    if (err) {
        console.error('Error checking for admin user:', err.message);
    } else if (!user) {
        // Hash the password before storing it
        bcrypt.hash(adminUser.password, 12, (hashErr, hash) => {
            if (hashErr) {
                console.error('Error hashing admin password:', hashErr.message);
                return;
            }
            // Insert the admin user into the database
            db.run('INSERT INTO users (userName, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', 
                [adminUser.userName, adminUser.emailAddress, hash, adminUser.agreeterms], 
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting admin user:', insertErr.message);
                    } else {
                        console.log('Admin user created successfully.');
                    }
                }
            );
        });
    }
});

/**
 * Table two | Create classes
 */
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        className TEXT NOT NULL,
        classType TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        classFormat TEXT NOT NULL,
        address TEXT NOT NULL,
        postcode TEXT
    );`, (err) => {
        if (err) {
            console.error("Error creating classes table:", err.message);
        } else {
            console.log("Classes table created successfully.");
        }
    });
});

/**
 * Table three | Create upcomings
 * Refer to this link: https://www.w3schools.com/sql/sql_join_inner.asp
 * Refer to this link: https://gent.tistory.com/376
 * 
 * Use INNER JOIN to combine data from users and classes tables based on their relationships in the upcomings table

 * Example: SELECT column_name(s)
 * FROM table1
 * INNER JOIN table2
 * ON table1.column_name = table2.column_name;
 */
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS upcomings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        classes_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (classes_id) REFERENCES classes(id)
    );`, (err) => {
        if (err) {
            console.error("Error creating upcomings table:", err.message);
        } else {
            console.log("upcomings table created successfully.");
        }
    });
});

/**
 * Session middleware
 * Update the session middleware to store the user in the session 
 */
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next(); 
});

// Refer to this link: https://coda.io/@peter-sigurdson/lab-workbook-setting-up-a-node-js-express-server-with-sqlite-and
// Refer to this link: https://www.luisllamas.es/en/how-to-use-sqlite-with-nodejs/

// -----------
// ---ROUTE---
// -----------
app.get("/", function (req, res) {
    const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        emailAddress: req.session.emailAddress,
        isAdmin: req.session.isAdmin
    }

    console.log("Home model: " + JSON.stringify(model));
    res.render("home", model);
});

app.get("/createaccount", function (req, res) {
    res.render("createaccount"); 
});

app.get("/login", function (req, res) {
    res.render("login"); 
});

app.get("/logout", function (req, res) {
    res.render("logout"); 
});

app.get("/about", function (req, res) {
    res.render("about"); 
});

app.get("/contact", function (req, res) {
    res.render("contact"); 
});

app.get("/registerclass", function (req, res) {
    res.render("registerclass"); 
});

app.get('/admin', (req, res) => {
    res.render("registerclass"); 
});

/**
 * Getting data from the tables: lab-4-v1.1 (1).pdf
 * 
 */
app.get('/upcomingclass', async (req, res) => {
    try {
        // Fetch user ID, userName, and class data from the upcomings table
        const query = `
    SELECT 
        users.userName, 
        classes.className, 
        classes.classType, 
        classes.startTime, 
        classes.endTime, 
        classes.classFormat, 
        classes.address, 
        classes.postcode
    FROM 
        upcomings
    INNER JOIN 
        users ON users.id = upcomings.user_id
    INNER JOIN 
        classes ON upcomings.classes_id = classes.id;
`;

        // Bring all data from classes 
        db.all("SELECT * FROM classes", (err, rows) => {
            if (err) {
                console.error('Error fetching classes:', err.message);
                return res.status(500).send('Server error');
            }
            
            // If no classes are found, you can handle it accordingly
            if (!rows || rows.length === 0) {
                return res.render('upcomingclass', { classes: [] }); // Render with an empty array
            }

            // Render the 'upcomingclass' view with the retrieved classes
            res.render('upcomingclass', { classes: rows });
        });
    } catch (err) {
        console.error('Error occurred:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Create Account
 * 
 * Hash Passwords with bcrypt in Node.js
 * https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
 * 
 * It's not necessary to hash all information because recovering data can be difficult.
 * Just hashing the password is sufficient.
 */
app.post('/create-account', async (req, res) => {
    const { username, emailAddress, password } = req.body;
    const agreeterms = req.body.agreeterms ? 1 : 0; // Convert checkbox to 1 (true) or 0 (false)

    try {
        const hash = await bcrypt.hash(password, 12);

        db.run('INSERT INTO users (userName, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', [userName, emailAddress, hash, agreeterms], (err) => {
            if (err) {
                console.error('Error inserting user:', err.message); // Print out an error message 
                return res.status(500).send('Server error');
            }

            console.log("New account has been created."); 

            // Redirect after a use create a new account
            res.redirect('/');
        });

    } catch (err) {
        console.error('Error hashing password:', err.message); // Print out a hash error message 
        return res.status(500).send('Error hashing password');
    }
});

/**
 * Log in 
 * This code is from 5-authentication-slides.pdf 
 */
app.post('/login-class', async (req, res) => {
    console.log("Login attempt with:", req.body); // Double check it's logged in with admin account 

    const { userName, emailAddress, password } = req.body;

    // Validate if it's the admin account 
    if (userName === adminUser.userName && emailAddress === adminUser.emailAddress) {
        const result = await bcrypt.compare(password, adminUser.password);

        if (result) {
            // Admin session data setting
            req.session.isAdmin = true;
            req.session.isLoggedIn = true;
            req.session.name = username;
            req.session.emailAddress = emailAddress;
        
            console.log("Session information: ", + JSON.stringify(req.session)); // Debugging log 
            res.redirect("/");
        }
         else {
            return res.status(401).send('Wrong password for admin');
        }
    } else {
        // Handling general users 
        db.get('SELECT * FROM users WHERE userName = ? OR emailAddress = ?', [userName, emailAddress], async (err, user) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send('Server error');
            } 
            
            if (!user) {
                console.log("User not found:", userName);
                return res.status(401).send('User not found');
            }
            
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                console.log("Successfully logged in.");
                
                req.session.user = {
                    id: user.id,
                    userName: user.userName,
                    emailAddress: user.emailAddress,
                    isAdmin: false // General users 
                };

                return res.redirect('/');
            } else {
                return res.status(401).send('Wrong password');
            }
        });
    }
});

/**
 * Log out
 * 
 */
app.post('/logout-class', async (req, res) => {
    req.session.destroy(); // Log out = Clear the session
    res.redirect('/'); // After log out a user is sent to main 
});

/**
 * class (class create)
 */
app.post('/create-class', async (req, res) => {
    const { className, classType, startTime, endTime, classFormat, address, postcode } = req.body;
    
    db.run('INSERT INTO classes (className, classType, startTime, endTime, classFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [className, classType, startTime, endTime, classFormat, address, postcode], (err) => {
        if (err) {
            console.error('Error inserting class:', err.message); // Print out an error message 
            return res.status(500).send('Server error');
        }

        console.log("New class has been created."); 

        // Redirect after creating a new class 
        res.redirect('/upcomingclass');
    });
});

app.post('/upcomingclass', async (req, res) => {
    const { user_id, classes_id } = req.body;

    db.run('INSERT INTO upcomings (user_id, classes_id) VALUES (?, ?)', [user_id, classes_id], (err) => {
        if (err) {
            console.error('Error inserting upcoming:', err.message);
            return res.status(500).send('Server Error');
        }

        console.log("Registered."); 
        res.redirect('/upcomingclass');
    });
});

/**
 * To show class information to users 
 * app.get('/class/:id', (req, res) => {
    const classId = req.params.id;
    db.get('SELECT * FROM classes WHERE id = ?', [classId], (error, classDetails) => {
        if (error) {
            console.error('Error fetching class details:', error.message);
            return res.status(500).send('Server error');
        }
        res.render('classDetail', { class: classDetails });
    });
});
 */

/* Start a port */
app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 