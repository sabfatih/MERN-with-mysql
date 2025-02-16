import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });
  const name = req.body.title;
  const price = req.body.price;
  const file = req.files.file;
  const fileSize = file.data.length;
  const fileExt = path.extname(file.name);
  const fileName = file.md5 + fileExt;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedFileTypes = [".png", ".jpg", ".jpeg"];

  if (!allowedFileTypes.includes(fileExt.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid image type" });
  }
  if (fileSize > 5000000) {
    return res.status(422).json({ msg: "Image must be less than 5MB" });
  }

  file.mv(`./public/images/${fileName}`, async (e) => {
    if (e) {
      return res.status(500).json({ msg: e.message });
    }

    try {
      await Product.create({
        name: name,
        price: price,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Product created successfully" });
    } catch (error) {
      console.log(e.message);
    }
  });
};

const updateProduct = async (req, res) => {
  const foundProduct = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!foundProduct) {
    return res.status(404).json({ msg: "Product not found" });
  }

  const file = req.files?.file;
  let fileName = "";
  if (!file) {
    fileName = foundProduct.image;
  } else {
    const fileSize = file.data.length;
    const fileExt = path.extname(file.name);
    fileName = file.md5 + fileExt;
    const allowedFileTypes = [".png", ".jpg", ".jpeg"];

    if (!allowedFileTypes.includes(fileExt.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid image type" });
    }
    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Image must be less than 5MB" });
    }

    file.mv(`./public/images/${fileName}`, (e) => {
      if (e) {
        return res.status(500).json({ msg: e.message });
      }

      fs.unlinkSync(`./public/images/${foundProduct.image}`);
    });
  }

  const name = req.body.title;
  const price = req.body.price;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  console.log("updateProduct ~ fileName", fileName);
  try {
    await Product.update(
      {
        name,
        price,
        image: fileName,
        url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const foundProduct = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!foundProduct) {
    return res.status(404).json({ msg: "Product not found" });
  }

  try {
    const filePath = `./public/images/${foundProduct.image}`;
    fs.unlinkSync(filePath);

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
