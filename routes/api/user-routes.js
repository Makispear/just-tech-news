const router = require('express').Router();
const { User } = require('../../models');
const user404Message = 'No user found with this id'

// get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        return res.status(500).json(err);
    });
});

// get 1 user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: user404Message});
        }
        return res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json(err);
    });
});

// add user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        return res.status(500).json(err);
    });
});

// login user 
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        // return res.json({ user: dbUserData });
 
        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({message: 'Incorrect password'})
        }
        return res.json({user: dbUserData, message: 'You are now logged in!'})
    });  
});

// update one user info
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: user404Message});
            return;
        }
        return res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json(err);
    });
});

// delete one user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: user404Message});
        }
        return res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json(err);
    });
});

module.exports = router;