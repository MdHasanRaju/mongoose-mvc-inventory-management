const express = require('express'); 
const router = express.Router();
const productController = require("../controllers/product.controller");

router.route("/bulk-update").patch(productController.bulkUpdateProducts)
router.route("/bulk-delete").delete(productController.bulkDeleteProducts)

router.route("/")
.get(productController.getProducts)
.post(productController.createProduct)  

router.route("/:id")
.patch(productController.updateProductById)
.delete(productController.deleteProductById)


module.exports = router;