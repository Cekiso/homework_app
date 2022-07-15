const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


module.exports = function name(app, db) {
    
    app.get('/api/test', function(req, res) {
        res.json({
            name: 'Student'
        });
    });
}

