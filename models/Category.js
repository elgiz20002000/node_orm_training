const sequelize = require('../util/database')
const Sequelize = require('sequelize')


const Category = sequelize.define('Category', {
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    name:Sequelize.STRING
})


module.exports = Category