const jwt = require("jsonwebtoken")

module.exports = function name(app, db) {
    app.get('/api/test', function(req, res) {
        res.json({
            name: 'Student'
        });
    });
}