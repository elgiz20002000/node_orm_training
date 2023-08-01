const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const User = sequelize.define('User', {
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    name: Sequelize.STRING
})


module.exports = User