const router = require('express').Router()
const { Comment } = require('../../models/')
const comment404Message = 'No comment found with this id'

// get all comment 
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// add a comment 
router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// delete a comment 
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            return res.status(404).json({message: comment404Message})
        }
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json(err)
    })
})

module.exports = router