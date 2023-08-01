var express = require('express');
var router = express.Router();
const Book = require('../models/Book')
const Category = require('../models/Category')

const {getProducts, postCart, deleteCartItem, getOrderPage, changeCount, getProductPage, sendMessage} = require('../controllers/IndexController')


/* GET home page. */
router.get('/', function (req, res, next) {
    const cart = req.cart
      cart.getCartItems({include:[{model:Book}]})
        .then(cartItems => {
            Book.findAll({include:[{model:Category}]})
                .then(books => {
                    console.log(books)
                    res.render('index', {title: 'Main page',
                        cartItems,
                        books
                    });
                })
                .catch(er => console.log(er))
        })

});

router.get('/contact', function (req, res, next) {
    const cart = req.cart
      cart.getCartItems({include:[{model:Book}]})
        .then(cartItems => {
            res.render('contact', {title: 'Contact', cartItems});
        })

});
router.get('/about', function (req, res, next) {
    const cart = req.cart
      cart.getCartItems({include:[{model:Book}]})
        .then(cartItems => {
            res.render('about', {title: 'About', cartItems});
        })
});

router.get('/product_detail/:bookId',getProductPage)

router.get('/order', getOrderPage)
router.get('/products', getProducts);
router.get('/list-products', getProducts);

router.post('/send-message', sendMessage)
router.post('/cart/:bookId', postCart)
router.post('/cart-delete/:cartItemId', deleteCartItem)
router.post('/change-quantity/:cartItemId', changeCount)


module.exports = router;
