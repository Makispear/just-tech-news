const User = require('./User')
const Post = require('./post')
const Vote = require('./Vote')
const Comment = require('./comment')

// USER ==============================
User.hasMany(Post, {
    foreignKey: 'user_id'
})
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
})
User.hasMany(Vote, {
    foreignKey: 'user_id'
})
User.hasMany(Comment, {
    foreignKey: 'user_id'
})

// POST ==============================
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
})
Post.belongsTo(User, {
    foreignKey: 'user_id'
})
Post.hasMany(Comment, {
    foreignKey: 'post_id'
})

// VOTE ==============================
Vote.belongsTo(User, {
    foreignKey: 'user_id'
})
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
})

// COMMENT ==============================
Comment.belongsTo(User, {
    foreignKey: 'user_id'
})
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
})




module.exports = { User, Post, Vote, Comment}