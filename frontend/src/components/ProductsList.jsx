import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const apiURL = "http://localhost:5000/products";
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const response = await axios.get(apiURL);
    setProducts(response.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container mt-5">
      <Link to={"/add-product"} className="button is-primary my-3">
        Add Product
      </Link>
      <div className="columns is-multiline">
        {products.map((product, i) => {
          return (
            <div key={i} className="column is-one-quarter">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3 is-clipped">
                    <img src={product.url} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{product.name}</p>
                      <p className="subtitle is-6">{product.price}</p>
                    </div>
                  </div>
                </div>

                <footer className="card-footer">
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="card-footer-item"
                  >
                    Edit
                  </Link>
                  <a
                    className="card-footer-item"
                    onClick={async (e) => {
                      try {
                        await axios.delete(`${apiURL}/${product.id}`);
                        getProducts();
                      } catch (error) {
                        console.log(e.message);
                      }
                    }}
                  >
                    Delete
                  </a>
                </footer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
