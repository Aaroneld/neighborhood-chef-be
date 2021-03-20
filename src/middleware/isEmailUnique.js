const db = require('../../data/dbConfig');

function isEmailUnique(req, res, next) {
    if (req.body.email) {
        const { email } = req.body;

        db('Users')
            .where({ email })
            .first()
            .then((user) => {
                if (user) {
                    res.status(422).json({ message: 'email already taken' });
                } else {
                    next();
                }
            });
    } else {
        next();
    }
}

module.exports = {
    isEmailUnique,
};
