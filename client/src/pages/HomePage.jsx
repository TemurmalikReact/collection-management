import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hooks";
import "./YourCollections.css";
import Preloader from "./Preloader/Preloader";
import { Collection } from "./Collection/Collection";
import Item from "./Item/Item";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

  const { logout, auth } = useContext(AuthContext);

  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  const [user, setUser] = useState(undefined);

  const getUser = useCallback(async () => {
    const data = await request(`/api/users/${user_id}`, "GET");
    setUser(data);
  }, [request, user_id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const [collections, setCollections] = useState([]);

  const fetchCollections = useCallback(async () => {
    try {
      const oollection_data = await request("/api/collections", "GET");

      const items_data = await request("/api/items", "GET");

      const dataFilter = oollection_data.map((collect) => ({
        ...collect,
        item_length: items_data.filter((item) => item.parent_id === collect._id)
          .length,
      }));

      setCollections(dataFilter);
    } catch (e) {
      console.log(e);
    }
  }, [request]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const deleteCollection = useCallback(
    async (id) => {
      try {
        await request("/api/collections/delete", "DELETE", { id });
        await request("/api/items/delete-all", "DELETE", { id });

        fetchCollections();
      } catch (e) {
        console.log(e);
      }
    },
    [fetchCollections, request]
  );

  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const data = await request("/api/items", "GET");
      setItems(data);
    } catch (e) {
      console.log(e);
    }
  }, [request]);

  const deleteItem = useCallback(
    async (id) => {
      try {
        await request("/api/items/delete", "DELETE", { id });
      } catch (e) {
        console.log(e);
      }
    },
    [request]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <nav className="white-text" style={{ padding: "0 55px" }}>
        <div className="nav-wrapper blue-text">
          <Link to="/" className="brand-logo">
            Collection-Managament
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {user_id && (
              <li>
                <Link to="/your-collections">Your Collections</Link>
              </li>
            )}
            {user && user.role && user.role.includes("ADMIN") && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            {user_id ? (
              <li className="white-text" onClick={logout}>
                Logout
              </li>
            ) : (
              <li>
                <Link to="/autentification">Sign In</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="row home" style={{ padding: "0 50px" }}>
        <div className="row">
          <h5 style={{ paddingLeft: "10px" }}>The biggest five Collections</h5>{" "}
          <br />
          {collections
            .concat()
            .sort((a, b) => b.item_length - a.item_length)
            .map((collection) => (
              <Collection
                small
                key={collection._id}
                collection={collection}
                deleteCollection={() => deleteCollection(collection._id)}
              />
            ))}
        </div>
        <div className="row">
          <h5>The Last Five Items</h5> <br />
          {items
            .concat()
            .splice(0, 5)
            .map((item) => (
              <Item
                key={item._id}
                item={item}
                deleteitem={() => deleteItem(item._id)}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Home;
