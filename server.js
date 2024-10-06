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

/* Set admin account for checking - grade 3 */
const adminUser = {
    username: 'admin',
    emailAddress: 'admin@example.com',
    password: 'adminpassword', 
    agreeterms: '1'
};

/* 15 users in users table - grade 3 */
const predefinedUsers = [
    { username: 'Kim Gustavsson', emailAddress: 'user1@example.com', password: 'user1password', agreeterms: '1' },
    { username: 'Kori Kimsson', emailAddress: 'user2@example.com', password: 'user2password', agreeterms: '1' },
    { username: 'Elias Gustavsson', emailAddress: 'user3@example.com', password: 'user3password', agreeterms: '1' },
    { username: 'Zoey Park', emailAddress: 'user4@example.com', password: 'user4password', agreeterms: '1' },
    { username: 'Alen Park', emailAddress: 'user5@example.com', password: 'user5password', agreeterms: '1' },
    { username: 'Mikael Svensson', emailAddress: 'user6@example.com', password: 'user6password', agreeterms: '1' },
    { username: 'Sofia Lindström', emailAddress: 'user7@example.com', password: 'user7password', agreeterms: '1' },
    { username: 'Oliver Nordin', emailAddress: 'user8@example.com', password: 'user8password', agreeterms: '1' },
    { username: 'Lina Andersson', emailAddress: 'user9@example.com', password: 'user9password', agreeterms: '1' },
    { username: 'Noah Olofsson', emailAddress: 'user10@example.com', password: 'user10password', agreeterms: '1' },
    { username: 'Emma Eriksson', emailAddress: 'user11@example.com', password: 'user11password', agreeterms: '1' },
    { username: 'Felix Persson', emailAddress: 'user12@example.com', password: 'user12password', agreeterms: '1' },
    { username: 'Freja Karlsson', emailAddress: 'user13@example.com', password: 'user13password', agreeterms: '1' },
    { username: 'William Björk', emailAddress: 'user14@example.com', password: 'user14password', agreeterms: '1' },
    { username: 'Elin Jansson', emailAddress: 'user15@example.com', password: 'user15password', agreeterms: '1' },
];
  
/* 15 classes in class table - grade 3 */
const predefinedClasses = [
    { userId: 1, className: 'Swedish Painting Class', classType: 'art', classPrice: 500, startTime: '10:00', endTime: '12:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 2, className: 'Advanced Web Development', classType: 'technology', classPrice: 1500, startTime: '10:00', endTime: '17:00', classFormat: 'offline', address: '123 Developer gatan, Jönköping', postcode: '11432' },
    { userId: 3, className: 'Baking Artisan Bread', classType: 'baking', classPrice: 800, startTime: '09:00', endTime: '18:00', classFormat: 'offline', address: '12 Dashagatan, Gothenburg', postcode: '41104' },
    { userId: 4, className: 'Plant Care Basics', classType: 'plants', classPrice: 600, startTime: '09:40', endTime: '14:00', classFormat: 'offline', address: '123 ju, Developer Hall, Malmö', postcode: '21122' },
    { userId: 5, className: 'Photography 101', classType: 'photography', classPrice: 1200, startTime: '15:00', endTime: '20:00', classFormat: 'offline', address: '456 Wine and Beer Factory, Uppsala', postcode: '98456' },
    { userId: 6, className: 'Social Media Strategies', classType: 'business', classPrice: 700, startTime: '11:00', endTime: '15:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 7, className: 'Korean Language Basics', classType: 'language', classPrice: 1000, startTime: '13:00', endTime: '16:00', classFormat: 'offline', address: '789 Design St, Stockholm', postcode: '12345' },
    { userId: 8, className: 'Yoga for Beginners', classType: 'fitness', classPrice: 600, startTime: '09:00', endTime: '12:00', classFormat: 'offline', address: '321 Baker Lane, Gothenburg', postcode: '41105' },
    { userId: 9, className: 'Digital Art Techniques', classType: 'art', classPrice: 500, startTime: '17:00', endTime: '18:30', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 10, className: 'Introduction to AI', classType: 'technology', classPrice: 1400, startTime: '10:00', endTime: '14:00', classFormat: 'offline', address: '654 Code Way, Malmö', postcode: '21123' },
    { userId: 11, className: 'Watercolor Techniques', classType: 'art', classPrice: 800, startTime: '09:00', endTime: '12:00', classFormat: 'offline', address: '78 Artistic St, Stockholm', postcode: '11223' },
    { userId: 12, className: 'Web Design Basics', classType: 'technology', classPrice: 900, startTime: '14:00', endTime: '16:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 13, className: 'Gourmet Cooking Class', classType: 'baking', classPrice: 1100, startTime: '09:00', endTime: '17:00', classFormat: 'offline', address: '45 Chef Ave, Gothenburg', postcode: '41108' },
    { userId: 14, className: 'Flower Arrangement Workshop', classType: 'plants', classPrice: 650, startTime: '10:00', endTime: '12:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 15, className: 'Fitness Bootcamp', classType: 'fitness', classPrice: 500, startTime: '18:00', endTime: '20:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
];

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
  * Note: This part shouldn't be hardcoded for security reasons (.env file)
  * 
  * Define the session 
  */
 app.use(session({
    secret: 'd384@#s#$#juihss.sijsge',
    resave: false,
    saveUninitialized: false,
    store: new SQLite3Store({db: "session-db.db"}),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours 
    }
}));

/**
 * Session middleware
 * This middleware sets up local variables to hold session information
 * that can be accessed in views rendered in response to requests.
 */
app.use((req, res, next) => {
    // Check if the user is logged in; default to false if not
    res.locals.isLoggedIn = req.session.isLoggedIn || false;

    // Store the user's name in a local variable; default to an empty string if not available
    res.locals.name = req.session.name || '';

    // Store the user's email address in a local variable; default to an empty string if not available
    res.locals.emailAddress = req.session.emailAddress || '';

    // Check if the user is an admin; default to false if not
    res.locals.isAdmin = req.session.isAdmin || false;

    res.locals.isCreateAccountPage = req.session.isCreateAccountPage || false; 

    // Call the next middleware in the stack
    next();
});

/**
 * function isAdmin(req, res, next)
 * Description: 
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function isAdmin(req, res, next) {
    if (req.session.isLoggedIn && req.session.isAdmin) {
        return next(); // If a user log in with admin account it goes to next 
    }
    res.status(403).send('Log in error');
}

// -----------
// ---CREATE--
// ---TABLE---
// -----------

/**
 * Table one | Create users  
 * Create predefined 5 users and create a users table if it doens't exist 
 * 
 * NOT NULL: Can't have a NULL value. So it can't be left empty.
 * UNIQUE: All values in a column are distinct from each other. So no two users can have the same email address.
 * 
 */
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        emailAddress TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        agreeterms INTEGER NOT NULL
    );`, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table created successfully.");
            
            // Check if the admin user exists
            db.get('SELECT * FROM users WHERE emailAddress = ?', [adminUser.emailAddress], (err, user) => {
                if (err) {
                    console.error('Error checking for admin user:', err.message);
                } else if (!user) { // If admin user does not exist
                    // Hash the password before storing it
                    bcrypt.hash(adminUser.password, 12, (hashErr, hash) => {
                        if (hashErr) {
                            console.error('Error hashing admin password:', hashErr.message);
                            return;
                        }

                        // Insert the admin user into the database
                        db.run('INSERT INTO users (username, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', 
                            [adminUser.username, adminUser.emailAddress, hash, adminUser.agreeterms], 
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

            // I need to make it as a function like predefinedClasses this code is too long 
            // Insert predefined users into the database
            // Using predefinedUsers global variable 
            predefinedUsers.forEach(user => {
                // Check if the user already exists by email
                db.get('SELECT * FROM users WHERE emailAddress = ?', [user.emailAddress], (err, existingUser) => {
                    if (err) {
                        console.error('Error checking predefined user:', err.message);
                        return;
                    }
                    if (!existingUser) { // If user does not exist
                        // Hash the password before storing it
                        bcrypt.hash(user.password, 12, (hashErr, hash) => {
                            if (hashErr) {
                                console.error('Error hashing predefined user password:', hashErr.message);
                                return;
                            }

                            // Insert the predefined user into the database
                            db.run('INSERT INTO users (username, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', 
                                [user.username, user.emailAddress, hash, user.agreeterms], 
                                (insertErr) => {
                                    if (insertErr) {
                                        console.error('Error inserting predefined user:', insertErr.message);
                                    } else {
                                        console.log(`Predefined user ${user.username} created successfully.`);
                                    }
                                }
                            );
                        });
                    }
                });
            });
        }
    });
});

/**
 * function insertPredefinedUsers() {
    
}
 */

/**
 * Table two | Create classes
 * Create predefined 5 classes and create a classes table if it doens't exist 
 */
db.serialize(() => {
    // Drop the classes table if it exists
    db.run(`DROP TABLE IF EXISTS classes`, (err) => {
        if (err) {
            console.error('Error dropping classes table:', err.message);
        } else {
            console.log("Classes table dropped successfully.");
        }
  
        // Create the classes table
        db.run(`CREATE TABLE IF NOT EXISTS classes (
            user_id INTEGER NOT NULL,
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            className TEXT NOT NULL,
            classType TEXT NOT NULL,
            classPrice INTEGER NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            classFormat TEXT NOT NULL,
            address TEXT NOT NULL,
            postcode TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`, (err) => {
            if (err) {
                console.error("Error creating classes table:", err.message);
            } else {
                console.log("Classes table created successfully.");
                
                // Insert predefined classes after the table is created
                // Simplify code lines by using function
                insertPredefinedClasses();
            }
        });
    });
  });

  /**
   * 
   */
  function insertPredefinedClasses() {
    predefinedClasses.forEach(cls => {
        // Check if the class already exists by className and startTime to avoid duplicates
        db.get('SELECT * FROM classes WHERE className = ? AND startTime = ?', [cls.className, cls.startTime], (err, existingClass) => {
            if (err) {
                console.error('Error checking predefined class:', err.message);
                return;
            }
  
            if (!existingClass) { // If class does not exist, insert it
                db.run('INSERT INTO classes (user_id, className, classType, classPrice, startTime, endTime, classFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    [cls.userId, cls.className, cls.classType, cls.classPrice, cls.startTime, cls.endTime, cls.classFormat, cls.address, cls.postcode], 
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting predefined class:', insertErr.message);
                        } else {
                            console.log(`Predefined class "${cls.className}" created successfully.`);
                        }
                    }
                );                
            } else {
                console.log(`Class "${cls.className}" at ${cls.startTime} already exists in the database.`);
            }
        });
    });
  }

/**
 * Table three | Create feedback - grade 4
 * Description:
 * rating INT CHECK (rating BETWEEN 1 AND 5): Allow users to give feedback to classes 
*/
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
    );`, (err) => {
        if (err) {
            console.error("Error creating feedback table:", err.message);
        } else {
            console.log("feedback table created successfully.");
        }
    });
});

// -----------
// ---ROUTE---
// -----------
app.get("/", function (req, res) {
    const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        emailAddress: req.session.emailAddress,
        isAdmin: req.session.isAdmin,
        isCreateAccountPage: req.session.isCreateAccountPage
    }

    if (!req.session.isLoggedIn) {
        console.log("Home model (not logged in):", model);
    }
    // console.log("Home model: " + JSON.stringify(model));
    
    res.render("home", model);
});

app.get('/createaccount', (req, res) => {
    req.session.isCreateAccountPage = true; // Set this session variable
    res.render('createaccount', { isCreateAccountPage: true }); // Ensure this points to your correct view
});

app.get('/login', (req, res) => {
    res.render('login', { isLoginPage: true });
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

/**
 * Hidden page
 * When an admin account is logged in it checks
 */
app.get('/admin', isAdmin, (req, res) => {
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).send('Server error.');
        }
        res.render('admin', { users }); // All user data to admin 
    });
});

/**
 * app.get('/upcomingclass', async (req, res)
 * Description: 
 * 1. 
 * 2. Pagination 
 * 
 * Refer to this link: https://www.w3schools.com/sql/sql_join_inner.asp
 * Refer to this link: https://gent.tistory.com/376
 * Getting data from the tables: lab-4-v1.1 (1).pdf
 */
app.get('/upcomingclass', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page
        const limit = 10; // Number of items per page
        const offset = (page - 1) * limit; // Calculate offset for SQL query

        const query = `
            SELECT classes.*, users.username 
            FROM classes 
            INNER JOIN users ON classes.user_id = users.id 
            LIMIT ? OFFSET ?`;

        db.all(query, [limit, offset], (err, rows) => {
            if (err) {
                console.error('Error fetching classes:', err.message);
                return res.status(500).send('Server error');
            }

            // Get total count for pagination
            db.get(`SELECT COUNT(*) as count FROM classes`, (err, countRow) => {
                if (err) {
                    console.error('Error fetching class count:', err.message);
                    return res.status(500).send('Server error');
                }

                const totalClasses = countRow.count; // Total number of classes
                const totalPages = Math.ceil(totalClasses / limit); // Total pages
                const nextPage = page < totalPages ? page + 1 : null; // Calculate next page number
                const pageMinus1 = page > 1 ? page - 1 : null; // Calculate previous page number

                // Determine if "Previous" and "Next" buttons should be shown
                const showPrev = page > 1;
                const showNext = nextPage !== null;

                res.render('upcomingclass', { 
                    classes: rows, 
                    page, 
                    nextPage, 
                    pageMinus1, 
                    showPrev, 
                    showNext,
                    totalPages // Pass totalPages to the template
                });
            });
        });
    } catch (err) {
        console.error('Error occurred:', err.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/detail", function (req, res) {
    res.render("detail"); 
});

/**
 * app.post('/create-account', async (req, res)
 * Description:
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

        db.run('INSERT INTO users (username, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', [username, emailAddress, hash, agreeterms], (err) => {
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
 * app.post('/login-class', async (req, res)
 * Description:
 * Login-class 
 * This code is from 5-authentication-slides.pdf 
 */
app.post('/login-class', async (req, res) => {
    console.log("Login attempt with:", req.body);
  
    const { username, emailAddress, password } = req.body;
  
    // Validate if it's the admin account
    if (username === adminUser.username && emailAddress === adminUser.emailAddress) {
        // Get the hashed admin password from the database
        db.get('SELECT id, password FROM users WHERE emailAddress = ?', [adminUser.emailAddress], async (err, user) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send('Server error');
            }
  
            if (!user) {
                console.log("Admin not found");
                return res.status(401).send('Admin user not found');
            }
  
            // Compare provided password with hashed password in the database
            const result = await bcrypt.compare(password, user.password);
            
            if (result) {
                // Admin session data setting
                req.session.isAdmin = true;
                req.session.isLoggedIn = true;
                req.session.userId = user.id; // Set user ID for admin
                req.session.name = username;
                req.session.emailAddress = emailAddress;
  
                console.log("Session information: " + JSON.stringify(req.session));
                res.redirect("/");
            } else {
                return res.status(401).send('Wrong password for admin');
            }
        });
    } else {
        // Handle regular user login
        db.get('SELECT id, * FROM users WHERE username = ? AND emailAddress = ?', [username, emailAddress], async (err, user) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send('Server error');
            }
  
            if (!user) {
                console.log("User not found");
                return res.status(401).send('User not found');
            }
  
            // Compare provided password with hashed password in the database
            const result = await bcrypt.compare(password, user.password);
            
            if (result) {
                req.session.isLoggedIn = true;
                req.session.userId = user.id; // Set user ID for regular user
                req.session.name = user.username;
                req.session.emailAddress = user.emailAddress;
  
                console.log("Session information: " + JSON.stringify(req.session));
                res.redirect("/");
            } else {
                return res.status(401).send('Wrong password for user');
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

app.post('/registerclass', async (req, res) => {
    const { user_id, classes_id } = req.body;

    db.run('INSERT INTO upcomings (users_id, classes_id) VALUES (?, ?)', [user_id, classes_id], (err) => {
        if (err) {
            console.error('Error inserting upcoming:', err.message);
            return res.status(500).send('Server Error');
        }

        console.log("Registered."); 
        res.redirect('/upcomingclass');
    });
});

app.post('/create-class', async (req, res) => {
    const userId = req.session.userId; // Bring user id from the session 

    // Check if user ID is present
    if (!userId) {
        console.error('User ID is required.');
        return res.redirect('/login'); // Redirect to login if user ID is missing
    }

    const { className, classType, classPrice, startTime, endTime, classFormat, address, postcode } = req.body;

    // Create a class including user_id
    db.run('INSERT INTO classes (user_id, className, classType, classPrice, startTime, endTime, classFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, className, classType, classPrice, startTime, endTime, classFormat, address, postcode], (err) => {
        if (err) {
            console.error('Error creating a class:', err.message);
            return res.status(500).send('Server error'); // Send a server error response
        } 

        res.redirect('/upcomingclass'); // Redirect to upcoming classes
    });
});

app.post('/admin/edit-user/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    const { username, emailAddress } = req.body;

    db.run('UPDATE users SET username = ?, emailAddress = ? WHERE id = ?', [username, emailAddress, userId], (err) => {
        if (err) {
            console.error('Error updating user:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        console.log("User information has been updated.");
        return res.json({ success: true });
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