const express = require('express');
const mongoose = require('mongoose');
//const dbURL = 'mongodb://localhost:27017/mtec';
const dbURL = 'mongodb+srv://briellat029_db_user:oXgEP7AYGrF0PkJq@cluster0.fd3goyc.mongodb.net/mtech'; 

const app = express();
const port = process.env.PORT || 3051;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(dbURL);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('DB connection error:', err);
});
db.once('open', () => {
    console.log('DB connected successfully');
});

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

app.get('/api/users', async (req, res) => {
    try {
        const { sort, order, search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        let users = User.find(query);
        
        if (sort) {
            const sortOrder = order === 'desc' ? -1 : 1;
            const sortObject = {};
            sortObject[sort] = sortOrder;
            users = users.sort(sortObject);
        }
        
        const result = await users.exec();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { firstName, lastName, email, age } = req.body;
        
        const userCount = await User.countDocuments();
        const userId = `user${String(userCount + 1).padStart(3, '0')}`;
        
        const newUser = new User({
            userId,
            firstName,
            lastName,
            email,
            age
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add user' });
        }
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { userId: userId }, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findOneAndDelete({ userId: userId });
        
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ userId: userId });
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

app.delete('/api/users/clear/all', async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).json({ message: 'All users cleared from database' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to clear users' });
    }
});

app.get('/api/debug', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const allUsers = await User.find({}).limit(10);
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        let friendsData = [];
        try {
            const db = mongoose.connection.db;
            friendsData = await db.collection('friends').find({}).limit(10).toArray();
        } catch (e) {
            friendsData = [];
        }
        
        res.status(200).json({
            userCount: userCount,
            users: allUsers,
            friendsCount: friendsData.length,
            friends: friendsData,
            collections: collections.map(c => c.name),
            dbName: mongoose.connection.db.databaseName
        });
    } catch (err) {
        res.status(500).json({ error: 'Debug failed', details: err.message });
    }
});

app.post('/api/migrate-users-to-friends', async (req, res) => {
    try {
        const usersData = await User.find({}).lean();
        
        console.log('Found users data:', usersData.length);
        console.log('Sample user:', usersData[0]);
        
        let migratedCount = 0;
        const errors = [];
        const db = mongoose.connection.db;
        
        for (const user of usersData) {
            try {
                console.log('Processing user:', user);
                
                const existingFriend = await db.collection('friends').findOne({ 
                    firstname: user.firstName,
                    lastname: user.lastName,
                    email: user.email 
                });
                
                if (!existingFriend) {
                    const friendData = {
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                        age: user.age,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    
                    await db.collection('friends').insertOne(friendData);
                    migratedCount++;
                    console.log('Successfully migrated user to friend:', user.firstName, user.lastName);
                } else {
                    console.log('Friend already exists:', user.firstName, user.lastName);
                }
            } catch (err) {
                console.log('Error migrating user:', err);
                errors.push(`Error with user ${user.userId}: ${err.message}`);
            }
        }
        
        res.status(200).json({ 
            message: `Migration completed. ${migratedCount} users migrated to friends collection`,
            totalUsers: usersData.length,
            migratedCount: migratedCount,
            errors: errors,
            success: true
        });
    } catch (err) {
        console.error('Migration failed:', err);
        res.status(500).json({ 
            error: 'Migration failed', 
            details: err.message,
            stack: err.stack,
            success: false
        });
    }
});

app.post('/api/migrate-friends', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const friendsData = await db.collection('friends').find({}).toArray();
        
        console.log('Found friends data:', friendsData.length);
        console.log('Sample friend:', friendsData[0]);
        
        let migratedCount = 0;
        const errors = [];
        
        for (const friend of friendsData) {
            try {
                console.log('Processing friend:', friend);
                
                const firstName = friend.firstname || friend.firstName;
                const lastName = friend.lastname || friend.lastName;
                const email = friend.email;
                const age = friend.age;
                
                if (!firstName || !lastName || !email || !age) {
                    errors.push(`Missing required fields for friend: ${JSON.stringify(friend)}`);
                    continue;
                }
                
                const existingUser = await User.findOne({ 
                    firstName: firstName,
                    lastName: lastName,
                    email: email 
                });
                
                if (!existingUser) {
                    const userCount = await User.countDocuments();
                    const userId = `user${String(userCount + 1).padStart(3, '0')}`;
                    
                    const newUser = new User({
                        userId: userId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        age: parseInt(age)
                    });
                    
                    await newUser.save();
                    migratedCount++;
                    console.log('Successfully migrated:', firstName, lastName);
                } else {
                    console.log('User already exists:', firstName, lastName);
                }
            } catch (err) {
                console.log('Error migrating friend:', err);
                errors.push(`Error with friend ${friend._id}: ${err.message}`);
            }
        }
        
        res.status(200).json({ 
            message: `Migration completed. ${migratedCount} friends migrated to users`,
            totalFriends: friendsData.length,
            migratedCount: migratedCount,
            errors: errors,
            success: true
        });
    } catch (err) {
        console.error('Migration failed:', err);
        res.status(500).json({ 
            error: 'Migration failed', 
            details: err.message,
            stack: err.stack,
            success: false
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, (err) => {
   if (err) console.log(err);
   console.log(`App Server listen on port: ${port}`);
});






