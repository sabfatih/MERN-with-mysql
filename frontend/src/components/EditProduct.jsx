import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const apiURL = "http://localhost:5000/products";
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const { id } = useParams();

  const getProductById = async () => {
    const product = (await axios.get(`${apiURL}/${id}`)).data;
    setTitle(product.name);
    setPrice(product.price);
    setFile(product.image);
    setPreview(product.url);
  };

  useEffect(() => {
    getProductById();
  }, []);

  const navigate = useNavigate();

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("price", price);

            try {
              await axios.patch(
                `http://localhost:5000/products/${id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              navigate("/products");
            } catch (e) {
              console.log(e.message);
            }
          }}
        >
          <div className="field">
            <label className="label">Product Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="title"
                placeholder="Name"
                autoComplete="off"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Product Price</label>
            <div className="control">
              <input
                type="text"
                className="input"
                name="price"
                placeholder="(IDR) e.g. 10000"
                autoComplete="off"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose File</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
