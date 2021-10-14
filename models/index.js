const User = require('./User')
const Post = require('./post')
const Vote = require('./Vote')

// USER
User.hasMany(Post, {
    foreignKey: 'user_id'
})

// has many votes on different posts 
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
})

User.hasMany(Vote, {
    foreignKey: 'user_id'
})

// POST
Post.hasMany(User, {
    foreignKey: 'user_id'
})

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
})

Post.belongsTo(User, {
    foreignKey: 'user_id'
})

// VOTE 
Vote.belongsTo(User, {
    foreignKey: 'user_id'
})

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
})



module.exports = { User, Post, Vote}