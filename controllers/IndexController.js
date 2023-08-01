const Category = require('../models/Category')
const Book = require('../models/Book')
const Message = require('../models/Message')
const CartItem = require('../models/Item/CartItem')
const sequelize = require('sequelize')
const {Op} = require("sequelize");

exports.getProducts = async (req, res) => {

    const defaultPage = req.query.page || 1;
    const itemsPerPage = 5; // Number of books to display per page

    const totalBooks = await Book.count()
    const skip = (defaultPage - 1) * itemsPerPage;

    const {category, minValue, maxValue, search} = req.query;

    const whereCondition = {};

    if (category && +category !== 1) {
        console.log(category)
        whereCondition.categoryId = category;
    }

    if (minValue && maxValue) {
        whereCondition.price = {
            [Op.between]: [minValue, maxValue]
        };
    }

    if (search) {
        whereCondition.name = {
            [Op.like]: `%${search}%`
        };
    }


    req.user.getBooks({
        where: whereCondition, order: [['createdAt', 'DESC']], include: {
            model: Category
        },
        limit: itemsPerPage, offset: skip
    })
        .then(books => {
            Category.findAll().then(categories => {
                const cart = req.cart
                cart.getCartItems({include: [{model: Book}]})
                    .then(cartItems => {
                        if (req.path === '/products') {
                            res.render('products', {
                                title: 'Products', path: req.path, books, categories, cartItems,
                                params: req.query,
                                page: defaultPage,
                                limit: Math.floor(Math.ceil(totalBooks / itemsPerPage)),
                            })
                        } else {
                            res.render('list-products', {
                                title: 'Products', path: req.path, books, categories, cartItems,
                                params: req.query,
                                page: defaultPage,
                                limit: Math.floor(Math.ceil(totalBooks / itemsPerPage)),
                            })
                        }
                    })
            })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}


exports.postCart = (req, res) => {
    const {bookId} = req.params
    let quantity = 1
    req.user.getCart()
        .then(cart => {
            cart.getBooks({where: {id: bookId}})
                .then(books => {
                    let book
                    if (books.length > 0) {
                        book = books[0]
                    }
                    if (book) {
                        quantity = book.cartItem.quantity + 1
                        return book
                    }
                    return Book.findByPk(bookId)
                })
                .then(book => {
                    cart.addBook(book, {through: {quantity}})
                })
                .then(() => {
                    res.redirect('/products')
                })
        })
}

exports.deleteCartItem = (req, res) => {
    const {cartItemId} = req.params
    CartItem.findOne({where: {BookId: cartItemId}})
        .then((cartItem) => {
            return cartItem.destroy()
        })
        .then(() => {
            res.redirect('/')
        })
        .catch(er => {
            console.log(er)
        })
}


exports.getOrderPage = (req, res) => {
    const cart = req.cart
    cart.getCartItems({include: [{model: Book}]})
        .then(cartItems => {
            res.render('order', {title: 'Order page', cartItems});
        })
}


exports.changeCount = (req, res) => {
    const {cartItemId} = req.params
    const {change_count} = req.query
    CartItem.update({quantity: sequelize.literal(`quantity + ${change_count}`)}, {where: {id: cartItemId}})
        .then(() => {
            res.redirect('/order')
        })
        .catch(er => console.log(er))
}

exports.getProductPage = (req, res) => {
    const {bookId} = req.params
    const cart = req.cart
    cart.getCartItems({include: [{model: Book}]})
        .then(cartItems => {
            Book.findByPk(bookId, {include: [{model: Category}]})
                .then(book => {
                    res.render('product_detail', {title: 'Product page', cartItems, book});
                })
                .catch(er => console.log(er))
        })
}

exports.sendMessage = (req, res) => {
    const {email, phoneNumber, message, name, companyName} = req.body
    Message.create({email, phoneNumber, message, name, companyName})
        .then(() => {
            res.redirect('/')
        })
        .catch((er) => {
            console.log(er)
        })
}
