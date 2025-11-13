const bcrypt = require('bcryptjs');


let users = [];
let nextUserId = 1;
const SALT_ROUNDS = 10;

exports.register = async (username, password) => {
    if (users.find(u => u.username === username)) {
        return null; 
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
        id: nextUserId++,
        username,
        password: hashedPassword, 
        profileImageUrl: null
    };
    users.push(newUser);
    
    
    const { password: _, ...safeUser } = newUser;
    return safeUser;
};

exports.login = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
};


exports.findById = (id) => {
    return users.find(u => u.id === parseInt(id));
};

exports.updateProfile = (id, updates) => {
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;
    
    
    if (updates.profileImageUrl) {
        users[userIndex].profileImageUrl = updates.profileImageUrl;
    }
    
    
    const { password: _, ...safeUser } = users[userIndex];
    return safeUser;
};

exports.deleteProfile = (id) => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== parseInt(id));
    return users.length < initialLength;
};