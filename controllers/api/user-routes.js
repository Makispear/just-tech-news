const router = require('express').Router();
const { User, Post, Comment } = require('../../models/');

const user404Message = 'No user found with this id'
const user400Message = 'No user with that email address!'
const password400Message = 'Incorrect password'
const login200Message = 'You are now logged in!'

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
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: 'Vote',
                as: 'voted_posts'
            }
          ]
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
            res.status(400).json({ message: user400Message });
            return;
        }
        // return res.json({ user: dbUserData });
 
        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({message: password400Message})
        }
        return res.json({user: dbUserData, message: login200Message})
    })
    .catch(err => res.status(500).json(err))
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