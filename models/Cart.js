const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const Cart = sequelize.define('Cart', {
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    }
})


module.exports = Cart