const Product = require("../models/Product");
const {
  getProductsServices,
  createProductService,
  updateProductByIdService,
  bulkUpdateProductService,
  deleteProductByIdService,
  bulkDeleteProductService,
  getExistingProductByIdService,
} = require("../services/product.services");

exports.getProducts = async (req, res, next) => {
  try {
    // save or create
    // const result = await Product
    // .where("name").equals(/\w/)
    // .where("quantity").gt(100).lt(500)
    // .limit(2).sort({quantity: -1})
    // const products = await getProductsServices(req.query.limit);

    // {price: {$gt: 50}}
    // {price: {gt: '50'}}

    // sort, page, limit => exclude
    let filters = { ...req.query };
    const excludeFields = ["page", "limit", "sort"];
    excludeFields.forEach((field) => delete filters[field]); 

    // gt, lt, gte, lte
    let filterString = JSON.stringify(filters);
    filterString = filterString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    
    filters = JSON.parse(filterString);

    const queries = {};
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); 
      queries.sortBy = sortBy;
    }

    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' '); 
      queries.fields = fields; 
    }

    if(req.query.page) {
      const {page = 1, limit = 10} = req.query;
      // 50 products
      // each page 10 products
      // page 1 => 1-10
      // page 2 => 11-20
      // page 3 => 21-30  => page 3 => skip 1-20 => 3-1 => 2*10
      // page 4 => 21-30  => page 4 => skip 1-30 => 4-1 => 3*10
      // page 5 => 41-50  => page 5 => skip 1-40 => 5-1 => 4*10
      const skip = (page -1)*parseInt(limit);
      queries.skip = skip
      queries.limit = parseInt(limit)  
    }

    const products = await getProductsServices(filters, queries);

    res.status(200).json({
      status: "Success",
      message: "data is found successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "data is not found",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // save or create
    const result = await createProductService(req.body);
    result.logger();

    res.status(200).json({
      status: "Success",
      message: "data inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "data is not inserted",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    // update the product
    const { id } = req.params;
    const result = await updateProductByIdService(id, req.body);

    res.status(200).json({
      status: "Success",
      message: "data updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "data is not updated",
      error: error.message,
    });
  }
};

exports.bulkUpdateProducts = async (req, res, next) => {
  try {
    // bulk update the product
    const result = await bulkUpdateProductService(req.body);

    res.status(200).json({
      status: "Success",
      message: "data is updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "data is not updated",
      error: error.message,
    });
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    // bulk update the product
    const { id } = req.params;
    const existingProduct = await getExistingProductByIdService(id);
    console.log(existingProduct?._id, id);

    if (existingProduct?._id != id) {
      return res.status(400).json({
        status: "fail",
        error: "couldn't find the product.",
      });
    }

    const result = await deleteProductByIdService(id);

    // if (!result.deletedCount) {
    // return res.status(400).json({
    //   status:"fail",
    //   error:"couldn't delete the product."
    // })
    // }

    res.status(200).json({
      status: "Success",
      message: "data is deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "data is not deleted",
      error: error.message,
    });
  }
};

exports.bulkDeleteProducts = async (req, res, next) => {
  try {
    // bulk delete the products
    const result = await bulkDeleteProductService(req.body.ids);

    res.status(200).json({
      status: "Success",
      message: "  successfully deleted the given products.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "could'n delete the given products.",
      error: error.message,
    });
  }
};
