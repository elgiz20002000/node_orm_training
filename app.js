var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let sequelize = require("./util/database");

var indexRouter = require("./routes/index");
let adminRouter = require("./routes/admin");
var app = express();

const Categories = require("./datas/category.json");

const User = require("./models/User");
const Book = require("./models/Book");
const Cart = require("./models/Cart");
const CartItem = require("./models/Item/CartItem");
const Order = require("./models/Order");
const Category = require("./models/Category");
const fetchCartData = require('./util/cart')
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((er) => console.log(er));
});

app.use(fetchCartData);

app.use("/", indexRouter);

app.use("/admin", adminRouter);



// catch 404 and forward to error handler
app.use("*", (req, res) => {
    const cart = req.cart
    cart.getCartItems({include:[{model:Book}]})
        .then(cartItems => {
            res.render('404', {title: '404', cartItems});
        })
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

User.hasMany(Book);
User.hasOne(Cart, {onDelete: "CASCADE"});
Cart.belongsTo(User)
Book.belongsTo(User);
Book.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Book, { through: CartItem });
Cart.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(Cart)
Book.belongsTo(Category,{onDelete: "CASCADE", onUpdate: 'CASCADE'});
Category.hasMany(Book, {onDelete: "CASCADE", onUpdate: 'CASCADE'});
Book.hasMany(CartItem);
CartItem.belongsTo(Book);

sequelize
    .sync({ alter: true })
    // .sync({force: true})
    .then(() => User.findByPk(1))
    .then((user) => {
        if (!user) {
            return User.create({
                name: "elgiz",
            });
        }
        return user;
    })
    .then(async (user) => {
        const cart = await Cart.findByPk(user.id)
        if (!cart) {
            user.createCart()
        }

    })
    .then(async () => {

        if (!((await Category.findAll()).length)) {
            Category.bulkCreate(
                Categories.categories.map((item) => ({
                    name: item,
                }))
            );
        }
    })
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
