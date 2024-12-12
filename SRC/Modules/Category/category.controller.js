import { errorHandlerClass } from "../../utils/error-class.utils.js";
import {Category} from "../../../DB/Models/category.model.js"

export const createCategory = async(req, res, next) => {
    const { name } = req.body;
    const duplicate = await Category.findOne({ name });
    if (duplicate) {
      return next(new errorHandlerClass('name already exists.', 400));
    }

    //prepare category object
    const newCategory = new Category({
      name
    });
    // Save to the database
    await newCategory.save();
  
    res.status(201).json({
        status : "success",
        message : "category created successfully",
        date: newCategory.created});
}

////////////////////////////// get category///////////////////////////////////////
export const getCategory = async(req, res, next) => {
    const {_id} = req.params;
    const category = await Category.findById(_id).populate;
    if(!category){
        return next(new errorHandlerClass('category not found',404,'category not found'));
    }
    res.json({
        status: "success",
        data: category
    })
}
////////////////////////////// get all categories///////////////////////////////////////
export const getallCategories = async(req, res, next) => {
  const categories = await Category.find();
  if(categories.length === 0){
      return next(new errorHandlerClass('No categories found',404,'No categories found'));
  }
  res.json({
      status: "success",
      data: categories
  })
}
//////////////////////////// update category/////////////////////////////////
export const updateCategory = async(req, res , next) => { 
    //console.log(req.file);
    const {_id}= req.params ;
    const category = await Category.findById(_id);
    console.log("category",category);
    
    if(!category){
        return next(new errorHandlerClass('category not found',404,'category not found'));
    }
    const {name} = req.body ;
    if(name){
        category.name = name;
    }
      // save the category with the new changes
      await category.save();
    
      res.status(200).json({
        status: "success",
        message: "category updated successfully",
        data: category,
      });
    };

////////////////////////////delete category//////////////////////////
export const deleteCategory = async(req,res,next) =>{
  const {_id} = req.params;
  const category = await Category.findByIdAndDelete(_id);
  if(!category){
    return next(new errorHandlerClass('category not found',404,'category not found'));
  }

  res.json({
    status: "success",
    message: "category deleted successfully",
    data: category
  })
}