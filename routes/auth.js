function authorize(request, reply){
    if (request.method === 'POST'){
        const {action, username , password} = request.body;
        if (!username || !password){
            return reply.status(400).send('Username and password are required');
        }
        let users = JSON.parse(fs.readFileSync('users.json'));

        if(action === 'register'){
            const exists = users.some(u => u.username === username);
            if (exists) {
                return reply.status(400).send('Username already exists');
            }
            const hashed = crypto.createHash('sha256').update(password).digest('hex');
            users.push({
                username,
                password: hashed,
                rating: 600
            });
            fs.writeFileSync('user.json', JSON.stringify(users, null, 4));
            request.session.user = username;
            return reply.redirect('/dashboard');


        }
        if(action === "login"){
            const hashed = crypto.createHash('sha256').update(password).digest('hex');
            const user = users.find(u => u.username === username);
            if (user && user.password === hashed) {
                request.session.user = username;
                return reply.redirect('/dashboard');
            }
            return reply.status(401).send('Invalid credentials');

        }
    const message = request.query.message;
    return reply.view('auth', { message });
    

    }

}
function signout(request, reply){
    reply.clearCookie('sessionId', { path: '/' });
    reply.redirect("/auth?message=Signed Out");
}
function change_password(request , reply){
    if (request.method === 'POST'){
        const {username,newPass, confirmPass } = request.body;
        if (!username || !newPass || confirmPass){
        return reply.status(400).send('All feilds are required.');
    }
    if (newPass !== confirmPass){
        return reply.status(400).send('Passwords dont match.');
    }
    let users;
    try {
            users = JSON.parse(fs.readFileSync('user.json'));
        } catch (err) {
            return reply.status(400).send('User data not found. Please register first.');
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            return reply.status(404).send('Username not found.');
        }

        const hashed = crypto.createHash('sha256').update(newPassword).digest('hex');
        user.password = hashed;

        try {
            fs.writeFileSync('user.json', JSON.stringify(users, null, 4));
        } catch (err) {
            return reply.status(500).send('Error updating password. Please try again later.');
        }

        return reply.redirect('/auth?message=Password updated successfully. Please log in.');
    }
    
    }
module.exports = {
    authorize,
    change_password
}
