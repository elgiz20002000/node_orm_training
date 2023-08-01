const Book = require("../models/Book");
const Category = require("../models/Category");
const Message = require("../models/Message");

exports.addItems = (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/add-items", {
      title: "Items",
      path: "/add-items",
      edit: false,
      categories,
    });
  });
};

exports.addItem = (req, res) => {
  const { name, price, writerName, photoLink, category } = req.body;

  req.user
    .createBook({
      name,
      price,
      writerName,
      photoLink,
      CategoryId: category,
    })
    .then(() => res.redirect("/admin/books"))
    .catch((error) => console.log(error));
};

exports.getItems = (req, res) => {
  req.user
    .getBooks({
      order: [["createdAt", "DESC"]],
      include: {
        model: Category,
      },
    })
    .then((books) => {
      res.render("admin/books", {
        title: "Books page",
        path: "/books",
        books,
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteItem = (req, res) => {
  const { bookId } = req.params;
  Book.destroy({ where: { id: bookId } })
    .then(() => {
      res.redirect("/admin/books");
    })
    .catch((err) => console.log(err));
};

exports.editPage = (req, res) => {
  const { bookId } = req.params;
  Category.findAll()
    .then((categories) => {
      Book.findOne({ where: { id: bookId } })
        .then((book) => {
          res.render("admin/add-items", {
            edit: true,
            path: "",
            book,
            categories,
            title: "Edit page",
          });
        })
        .catch((er) => console.log(er));
    })
    .catch((er) => console.log(er));
};

exports.editBook = (req, res) => {
  const { bookId } = req.params;
  const { name, price, writerName, photoLink, category } = req.body;
  const product = {
    id: bookId,
    name,
    price,
    writerName,
    photoLink,
    CategoryId: category,
  };
  Book.update(product, { where: { id: bookId } })
    .then(() => {
      res.redirect("/admin/books");
    })
    .catch((er) => console.log(er));
};

exports.getMessagePage = (req, res) => {
    Message.findAll()
        .then(messages => {
            res.render('admin/messages', {
                title:"Message page",
                path:'/messages',
                messages
            })
        })
        .catch((er) => console.log(er))
}


exports.getAddCategoryPage = (req, res) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/add-category',{
                edit:false,
                title:"Category page",
                path:'/add-category',
                categories
            })
        })
        .catch(er => console.log(er))
}


exports.postCategory = (req, res) => {
    const {name} = req.body
    Category.create({name})
        .then(() => {
            res.redirect('/admin/add-category')
        })
        .catch(er => console.log(er))
}

exports.getCategoriesPage = (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('' +
                'admin/categories', {
                title:"Categories page",
                path:'/categories',
                categories
            })
        })
        .catch(er => console.log(er))
}

exports.deleteCategory = (req, res) => {
    const {cat_id} = req.params
    Category.destroy({where:{id:cat_id}})
        .then(() => {
            res.redirect('/admin/categories')
        })
        .catch(er => console.log(er))
}

exports.editCategory = (req, res) => {
    const {cat_id} = req.params
    const {name} = req.body
    Category.update({name}, {where:{id:cat_id}})
        .then(() => {
            res.redirect('/admin/categories')
        })
        .catch(er => console.log(er))
}

exports.getEditCategoryPage = (req, res) => {
    const {cat_id} = req.params
    Category.findByPk(cat_id)
        .then(category => {
            res.render('admin/add-category', {
                edit:true,
                title:"Category page",
                path:'/edit-category',
                category
            })
        })
}

