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

/*
=========================================
        CREATE TABLE DATA
=========================================
*/

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
    { userId: 1, className: 'Swedish Painting Class', classType: 'art', classPrice: 500, classDate: '2024-10-15', startTime: '10:00', endTime: '12:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 2, className: 'Advanced Web Development', classType: 'technology', classPrice: 1500, classDate: '2024-10-16', startTime: '10:00', endTime: '17:00', classFormat: 'offline', address: '123 Developer gatan, Jönköping', postcode: '11432' },
    { userId: 3, className: 'Baking Artisan Bread', classType: 'baking', classPrice: 800, classDate: '2024-10-17', startTime: '09:00', endTime: '18:00', classFormat: 'offline', address: '12 Dashagatan, Gothenburg', postcode: '41104' },
    { userId: 4, className: 'Plant Care Basics', classType: 'plants', classPrice: 600, classDate: '2024-10-18', startTime: '09:40', endTime: '14:00', classFormat: 'offline', address: '123 ju, Developer Hall, Malmö', postcode: '21122' },
    { userId: 5, className: 'Photography 101', classType: 'photography', classPrice: 1200, classDate: '2024-10-19', startTime: '15:00', endTime: '20:00', classFormat: 'offline', address: '456 Wine and Beer Factory, Uppsala', postcode: '98456' },
    { userId: 6, className: 'Social Media Strategies', classType: 'business', classPrice: 700, classDate: '2024-10-20', startTime: '11:00', endTime: '15:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 7, className: 'Korean Language Basics', classType: 'language', classPrice: 1000, classDate: '2024-10-21', startTime: '13:00', endTime: '16:00', classFormat: 'offline', address: '789 Design St, Stockholm', postcode: '12345' },
    { userId: 8, className: 'Yoga for Beginners', classType: 'fitness', classPrice: 600, classDate: '2024-10-22', startTime: '09:00', endTime: '12:00', classFormat: 'offline', address: '321 Baker Lane, Gothenburg', postcode: '41105' },
    { userId: 9, className: 'Next step graphic design', classType: 'art', classPrice: 500, classDate: '2024-10-23', startTime: '17:00', endTime: '18:30', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 10, className: 'Introduction to AI', classType: 'technology', classPrice: 1400, classDate: '2024-10-24', startTime: '10:00', endTime: '14:00', classFormat: 'offline', address: '654 Code Way, Malmö', postcode: '21123' },
    { userId: 11, className: 'Watercolor Techniques', classType: 'art', classPrice: 800, classDate: '2024-10-25', startTime: '09:00', endTime: '12:00', classFormat: 'offline', address: '78 Artistic St, Stockholm', postcode: '11223' },
    { userId: 12, className: 'Web Design Basics', classType: 'technology', classPrice: 900, classDate: '2024-10-26', startTime: '14:00', endTime: '16:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 13, className: 'Gourmet Cooking Class', classType: 'baking', classPrice: 1100, classDate: '2024-10-27', startTime: '09:00', endTime: '17:00', classFormat: 'offline', address: '45 Chef Ave, Gothenburg', postcode: '41108' },
    { userId: 14, className: 'Flower Arrangement Workshop', classType: 'plants', classPrice: 650, classDate: '2024-10-28', startTime: '10:00', endTime: '12:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
    { userId: 15, className: 'Fitness Bootcamp', classType: 'fitness', classPrice: 500, classDate: '2024-10-29', startTime: '18:00', endTime: '20:00', classFormat: 'online', address: 'N/A', postcode: 'N/A' },
];

/* 15 feedbacks in feedback table - grade 4 */
const predefinedFeedback = [
    { contactName: 'Jérôme Landré', contactMail: 'jerome.landre@example.com', message: 'Great class! Learned a lot.', feedbacks: 'The instructor was very knowledgeable and engaging.', rating: 5 },
    { contactName: 'Elias Gustavsson', contactMail: 'happy.elias@example.com', message: 'Very informative session.', feedbacks: 'I love this platform.', rating: 5 },
    { contactName: 'Baby Kori', contactMail: 'kori@example.com', message: 'Meow, meeeow, meow.', feedbacks: 'Meow Meow!', rating: 5 },
    { contactName: 'Dasha Gustavsson', contactMail: 'dasha.gustavsson@example.com', message: 'Overall good!', feedbacks: 'The pacing was a bit fast for beginners.', rating: 5 },
    { contactName: 'Mario Marcus', contactMail: 'mario.marcus@example.com', message: 'Enjoyed it very much.', feedbacks: 'Great content, but the audio quality was poor.', rating: 4 },
    { contactName: 'Emily Helen', contactMail: 'emily.helen@example.com', message: 'It was worth for the price.', feedbacks: 'Much better than I expected and good to have a certication.', rating: 4 },
    { contactName: 'George Lucas', contactMail: 'george.lucas@example.com', message: 'Absolutely loved it!', feedbacks: 'Best class I have ever taken. Highly recommend!', rating: 5 },
    { contactName: 'Hannah Baker', contactMail: 'hannah.baker@example.com', message: 'Okay class.', feedbacks: 'Some parts were interesting, but others felt repetitive.', rating: 3 },
    { contactName: 'Moa Österling', contactMail: 'moa@example.com', message: 'Very helpful instructor.', feedbacks: 'I liked the interactive elements of the course.', rating: 4 },
    { contactName: 'Isak Arbman', contactMail: 'isak.arbman@example.com', message: 'Fantastic', feedbacks: 'The material was outdated.', rating: 4 }
];

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));

/*
=========================================
        EXPRESS MIDDLEWARES
=========================================
*/
app.use(express.urlencoded({ extended: true })); // url passing
app.use(express.json()); // Parsing request data in JSON format 

 /**
  * 'secret' is the key used to sign and encrypt session IDs stored in cookies.
  * It ensures the integrity and security of session data between the client and server.
  * 
  * Just note for studies: This part shouldn't be hardcoded for security reasons (.env file)
  * 
  * cookie: Configures session cookie settings, such as maxAge
  * name: Changed a cookes file name. otherwise, it would have been 'connect.sid'  
 */
 app.use(session({
    secret: 'd384@#s#$#juihss.sijsge',
    resave: false,
    saveUninitialized: false,
    store: new SQLite3Store({db: "session-db.db"}),
    name: 'dasha-cookies',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // Expire after 24 hours 
    }
}));

/**
 * Session middleware
 * This middleware sets up local variables that are accessible in views,
 * allowing session data (e.g., login status, user information) to be passed 
 * to templates and used when rendering responses.
 * 
 * res.locals: Holds data that will be available to the views/templates.
 * isLoggedIn: Indicates if the user is logged in (defaults to false if not).
 * name: Stores the user's name (defaults to an empty string if not available).
 * emailAddress: Stores the user's email address (defaults to an empty string if not available).
 * isAdmin: Indicates if the user has admin privileges (defaults to false if not).
 * isCreateAccountPage: Tracks if the user is on the account creation page (defaults to false if not).
 */
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.name = req.session.name || '';
    res.locals.emailAddress = req.session.emailAddress || '';
    res.locals.isAdmin = req.session.isAdmin || false;
    res.locals.isCreateAccountPage = req.session.isCreateAccountPage || false; 

    // Call the next middleware in the stack
    next();
});

/**
 * function isAdmin(req, res, next)
 * Description:
 * Middleware function. 
 * Middleware that checks if the user is logged in and has admin one.
 * If both conditions are met (login and admin), the middleware passes control to the next.
 * If the user is not logged in or not an admin, it returns a 403 response: Log in error.
 */
function isAdmin(req, res, next) {
    if (req.session.isLoggedIn && req.session.isAdmin) {
        return next();
    }

    // If not an admin or not logged in, show error
    res.status(403).send('Log in error');
}

/*
=========================================
        DATABASE TABLES
=========================================
*/
/*
 * Table one | Create users 
 * Description:
 * This code is about to users class table columns 
 * The table has the following constraints:
 * NOT NULL: Ensures that the column must have a value.
 * UNIQUE: Ensures that no two users can have the same email address.
 * 
 * 1. The `CREATE TABLE IF NOT EXISTS` checks if the "users" table exists. 
 *    If it doesn't, the table is created with the specified columns.
 * 2. After creating the table, the code checks if an admin user already exists in the table using the admin's email address.
 * 3. If the admin user does not exist:
 *    The admin's password is securely hashed using `bcrypt`.
 *    The hashed password and other user details (username, email, agreeterms) are inserted into the "users" table.
 * 4. Once the admin user is created, the function `insertPredefinedUsers()` is called to add 15 predefined users.
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

                                    insertPredefinedUsers();
                                }
                            }
                        );
                    });
                }
            });
        }
    });
});

/**
 * function insertPredefinedUsers()
 * Description:
 * This function is for making db.serialize(() function short! 
 *
 * 1. The function first checks if a user with the same `emailAddress` already exists in the database.
 * 2. If the user does not exist:
 *    The password is securely hashed using `bcrypt`.
 *    The user data (username, hashed password, email, and agreeterms) is then inserted into the "users" table.
 * bcrypt.hash: This function is used to hash the user's password before storing it in the database to ensure security. - grade 5 
 */
function insertPredefinedUsers() {
    // Insert predefined users into the database using the predefinedUsers array
    predefinedUsers.forEach(user => {
        // Check if the user already exists by email
        db.get('SELECT * FROM users WHERE emailAddress = ?', [user.emailAddress], (err, existingUser) => {
            if (err) {
                console.error('Error checking predefined user:', err.message); // Log any error during user lookup
                return;
            }
            if (!existingUser) { // If the user does not exist
                // Hash the password before storing it in the database
                bcrypt.hash(user.password, 12, (hashErr, hash) => {
                    if (hashErr) {
                        console.error('Error hashing predefined user password:', hashErr.message); // Log any error during password hashing
                        return;
                    }

                    // Insert the predefined user into the 'users' table
                    db.run('INSERT INTO users (username, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', 
                        [user.username, user.emailAddress, hash, user.agreeterms], 
                        (insertErr) => {
                            if (insertErr) {
                                console.error('Error inserting predefined user:', insertErr.message); // Log any error during user insertion
                            } else {
                                console.log(`Predefined user ${user.username} created successfully.`); // Log success after user creation
                            }
                        }
                    );
                });
            }
        });
    });
}

/**
 * Table two | Create classes 
 * Description:
 * This code is about to create class table columns 
 * 
 * The table has the following constraints:
 * NOT NULL: Ensures that the column must contain a value.
 * FOREIGN KEY (user_id) REFERENCES users(id): Each time a class is added to the database, 
 * the user who created the class must already be registered in the users table.
 * 
 * 1. The `CREATE TABLE IF NOT EXISTS` command is then used to create the new "classes" table with the specified columns and constraints.
 * 2. After the table is successfully created, the function `insertPredefinedClasses()` is called to populate the table with predefined class data.
 */
db.serialize(() => {  
        db.run(`CREATE TABLE IF NOT EXISTS classes (
            user_id INTEGER NOT NULL,
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            className TEXT NOT NULL,
            classType TEXT NOT NULL,
            classPrice INTEGER NOT NULL,
            classDate TEXT NOT NULL, 
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

  /**
   * function insertPredefinedClasses()
   * Description: 
   * This function inserts a list of predefined users into the "classes" table in the database.
   *    * This function is for making db.serialize(() function short! 
   * 
   * 1. The function check if the class already exists by className and startTime to avoid duplicates
   * 2. If the class does not exist inserts into the "classes" table.
   * 3. If the class exists then prints out className and startTime already exist in the database. 
   */
  function insertPredefinedClasses() {
    predefinedClasses.forEach(cls => {
        db.get('SELECT * FROM classes WHERE className = ? AND startTime = ?', [cls.className, cls.startTime], (err, existingClass) => {
            if (err) {
                console.error('Error checking predefined class:', err.message);
                return;
            }
  
            if (!existingClass) { // If class does not exist, insert it
                db.run('INSERT INTO classes (user_id, className, classType, classPrice, classDate, startTime, endTime, classFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    [cls.userId, cls.className, cls.classType, cls.classPrice, cls.classDate, cls.startTime, cls.endTime, cls.classFormat, cls.address, cls.postcode], 
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
 * This table is to create feedback table columns 
 * rating INT CHECK (rating BETWEEN 1 AND 5): Allow users to give feedback to classes 
 *
*/
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contactName TEXT NOT NULL,
        contactMail TEXT NOT NULL,
        message TEXT NOT NULL,
        feedbacks TEXT, 
        rating INT CHECK (rating BETWEEN 1 AND 5)
    );`, (err) => {
        if (err) {
            console.error("Error creating feedback table:", err.message);
        } else {
            console.log("Feedback table created successfully.");
            // Call the function to insert predefined feedback right after table creation
            insertPredefinedFeedback();
        }
    });
});

/**
 * function insertPredefinedFeedback()
 * Description:
 * 1. This function checks if predefined feedback already exists in the database by comparing `contactName` and `contactMail`.
 * 2. If the feedback does not exist, it inserts the predefined feedback into the "feedback" table.
 * 3. If feedback already exists, it logs a message indicating that feedback for that user is already in the database.
 */
function insertPredefinedFeedback() {
    predefinedFeedback.forEach(fed => {
        // Check if the feedback already exists to avoid duplicates
        db.get('SELECT * FROM feedback WHERE contactName = ? AND contactMail = ?', [fed.contactName, fed.contactMail], (err, existingFeedback) => {
            if (err) {
                console.error('Error checking predefined feedback:', err.message);
                return;
            }
  
            if (!existingFeedback) { // If feedback does not exist, insert it
                db.run('INSERT INTO feedback (contactName, contactMail, message, feedbacks, rating) VALUES (?, ?, ?, ?, ?)', 
                    [fed.contactName, fed.contactMail, fed.message, fed.feedbacks, fed.rating], 
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting predefined feedback:', insertErr.message);
                        } else {
                            console.log(`Predefined feedback from "${fed.contactName}" created successfully.`);
                        }
                    }
                );                
            } else {
                console.log(`Feedback from "${fed.contactName}" with email "${fed.contactMail}" already exists in the database.`);
            }
        });
    });
}

/*
=========================================
               ROUTES
=========================================
*/
/**
 * app.get("/", (req, res) =>
 * Description: 
 * Handles GET request for the / page (main)
 * Passes session data (isLoggedIn, name, email, etc.) to the view (home.ejs).
 * Logs the model if the user is not logged in.
 */
app.get("/", (req, res) => {
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
    
    res.render("home", model);
});

app.get("/createaccount", (req, res) => {
    res.render("createaccount", { isCreateAccountPage: true });
});

app.get("/login", (req, res) => {
    res.render("login", { isLoginPage: true });
});

app.get("/logout", (req, res) => {
    res.render("logout"); 
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/registerclass", (req, res) => {
    res.render("registerclass"); 
});

/**
 * app.get('/admin', isAdmin, (req, res) =>
 * Description:
 * It's about "Hidden page" if a user log in with admin, it checks 
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
 * app.get('/upcomingclass', async (req, res) =>
 * Description: 
 * 1. Handles upcoming class listing with pagination.
 * 2. Joins 'classes' and 'users' tables to display class info along with user details.
 * 3. Pagination - grade 4
 * 4. Set ? because the page number shouldn't fix. It expends based on the number of pages. More item = more pages. 
 * 
 * Learned from this link: https://www.w3schools.com/sql/sql_join_inner.asp
 * Learned from this link: https://gent.tistory.com/376
 * Learned from: lab-4-v1.1 (1).pdf
 */
app.get('/upcomingclass', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page
        const limit = 4; // Number of items per page
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

            if (!rows || rows.length === 0) {
                return res.render('upcomingclass', { 
                    classes: [], 
                    page, 
                    nextPage: null, 
                    pageMinus1: page > 1 ? page - 1 : null, 
                    showPrev: false, 
                    showNext: false,
                    totalPages: 0
                });
            }

            // Get total count for pagination
            db.get(`SELECT COUNT(*) as count FROM classes`, (err, countRow) => {
                if (err) {
                    console.error('Error fetching class count:', err.message);
                    return res.status(500).send('Server error');
                }

                const totalClasses = countRow.count; // Total number of classes
                const totalPages = Math.ceil(totalClasses / limit); // Total pages / Math.ceil: Rounds the given number up. 
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

/**
 * app.get('/detail/:id', (req, res)
 * Description:
 * This is for each detail page. When a user clicks one of cards in the upcoming classes page, 
 * it brings saved data from the database.
 * 
 * INNER JOIN is used to combine users and classes tables.
 * In this case, it joins the 'classes' table and the 'users' table using the 'user_id' from the 'classes' table and the 'id' from the 'users' table.
 */
app.get('/detail/:id', (req, res) => {
    const classId = req.params.id; // Get the class ID from the URL

    const query = `
        SELECT classes.*, users.username 
        FROM classes 
        INNER JOIN users ON classes.user_id = users.id 
        WHERE classes.id = ?`;

    db.get(query, [classId], (err, row) => {
        if (err) {
            console.error('Error fetching class detail:', err.message);
            return res.status(500).send('Server error');
        }

        if (!row) {
            // If no class is found, send a 404 error
            return res.status(404).send('Class not found');
        }

        // Render the class detail page with the fetched data
        // classDetail is a descriptive name for the data being passed to the view, making it clear what data it hold
        // It doesn't get data from the database if it's just detail.
        res.render('detail', {classDetail: row});
    });
});

/**
 * app.post('/create-account', async (req, res)
 * Description:
 * This function is about Create Account page
 * Hash Passwords with bcrypt in Node.js
 * Learned from this link: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
 * 
 * 1. Handles user account creation on the Create Account page.
 * 2. Validates input fields to ensure all required information is provided.
 * 3. Checks if the email already exists in the database to prevent duplicates. Because email is more unique 
 * 4. Hashes the password using bcrypt for security.
 * 5. Inserts the new user into the database with hashed password and other details.
 * 6. Redirects to the login page upon successful account creation.
 * 
 * Just note for studies: It's not necessary to hash all information because recovering data can be difficult. Just hashing the password is sufficient.
 */
app.post('/create-account', (req, res) => {
    // Just node for studies: Can access username, emailAddress, password, and agreeterms easily without using long expressions 
    // like req.body.username, req.body.emailAddress, req.body.password, and req.body.agreeterms, one by one.
    const { username, emailAddress, password, agreeterms } = req.body;

    // Input validation
    if (!username || !emailAddress || !password || !agreeterms) {
        return res.status(400).send("All fields are required");
    }

    db.get('SELECT * FROM users WHERE emailAddress = ?', [emailAddress], (err, existingUser) => {
        if (err) {
            console.error('Error checking for existing user:', err.message);
            return res.status(500).send('Internal server error');
        }

        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        // Password hashing / it is 12, but normally 10 numbers (Read it from Google)
        bcrypt.hash(password, 12, (hashErr, hash) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr.message);
                return res.status(500).send('Internal server error');
            }

            // Insert new user into the database
            db.run('INSERT INTO users (username, emailAddress, password, agreeterms) VALUES (?, ?, ?, ?)', 
                [username, emailAddress, hash, agreeterms], 
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting new user:', insertErr.message);
                        return res.status(500).send('Internal server error');
                    }

                    console.log(`User ${username} created successfully.`);
                    res.redirect('/login');
                }
            );
        });
    });
});

/**
 * app.post('/login-class', async (req, res)
 * Description:
 * 1. Login-class to check user inputs: username, emailaddress, password.
 * 2. Compare them if it's actually registered in the database.
 * 3. Handle two different account types: Admin/General users 
 * 
 * Learned from this link: 5-authentication-slides.pdf 
 */
app.post('/login-class', async (req, res) => {
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
 * app.post('/logout-class', async (req, res)
 * Description:
 * 1. Log Out = clear the session
 * 2. It clears the session and redirects a user to the home page. 
 */
app.post('/logout-class', async (req, res) => {
    req.session.destroy(); // destroy() helps to clear the session
    res.redirect('/');
});

/**
 * app.post('/upcomingclass', async (req, res) =>
 * Description:
 * 1. Handles the POST request for the upcoming class feature.
 * 2. Inserts the user ID and class ID into the "upcomings" table (displaying them in cards)
 */
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

/**
 * app.post('/create-class', async (req, res) =>
 * Description:
 * 1. Handles the POST request to create a new class.
 * 2. Insert a new class to the database. It will display in upcoming page, thus redirect a user to the upcoming class page.
 */
app.post('/create-class', async (req, res) => {
    const userId = req.session.userId; // Bring user id from the session 

    // Check if user ID is present
    if (!userId) {
        console.error('User ID is required.');
        return res.redirect('/login'); // Redirect to login if user ID is missing
    }

    const { className, classType, classPrice, classDate, startTime, endTime, classFormat, address, postcode } = req.body;

    // Create a class including user_id
    db.run('INSERT INTO classes (user_id, className, classType, classPrice, classDate, startTime, endTime, classFormat, address, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, className, classType, classPrice, classDate, startTime, endTime, classFormat, address, postcode], (err) => {
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
 * app.delete('/admin/delete-user/:id', isAdmin, (req, res) =>
 * Description:
 * 1. This function is about deleting a user from the user management table.
 * 2. It works with main.js code.
 * 3. Find a user by searching for user id.
 * 
 * Learned from this link: https://forum.freecodecamp.org/t/delete-a-record-from-database-using-node-js-express-js/454100
 * Learned from this link: lab-6-v1.0 (3).pdf
 */
app.delete('/admin/delete-user/:id', isAdmin, (req, res) => {
    const userId = req.params.id;

    // Remove the user from the database
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (this.changes === 0) {
            console.log("No user found with the given ID.");
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log("User deleted from the database.");
        return res.json({ success: true, message: 'User deleted successfully' });
    });
});

/*
=========================================
        START A PORT
=========================================
*/
app.listen (port, () => {
    console.log('Server up on port '+port+'...');
}); 