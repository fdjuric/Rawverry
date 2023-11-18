
const checkPermission = (requiredRole) => {
    return (req, res, next) => {
        const user = req.session.passport?.user; 
        
        /*console.log(requiredRole);
        if(requiredRole.includes(user.role)){
        console.log("Access");
        } */
        
        // Access user data from the session
        if (user && requiredRole.includes(user.role)) {
            next(); // Proceed to the next middleware or route handler
        } else if (user == null){

            res.render('404notfound');
        }else {
            res.status(403).send('Insufficient permissions'); // Or handle permission denial
        }
    };
};

module.exports = { checkPermission };