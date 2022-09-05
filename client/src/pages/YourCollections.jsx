import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hooks";
import "./YourCollections.css";
import Preloader from "./Preloader/Preloader";
import { Collection } from "./Collection/Collection";

function YourCollections() {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

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

  const [collectionForm, setCollectionForm] = useState({
    name: "",
    description: "",
    theme: "",
    owner_id: user_id,
    addition_number: [],
    addition_title: [],
    addition_description: [],
    addition_date: [],
    addition_checkbox: [],
  });

  const changeHandler = (e) => {
    setCollectionForm({ ...collectionForm, [e.target.name]: e.target.value });
  };

  const addExtra = (input) => {
    if (collectionForm[input].length < 3) {
      setCollectionForm({
        ...collectionForm,
        [input]: [
          ...collectionForm[input],
          {
            value: "",
            id: Math.random(),
          },
        ],
      });
    }
  };

  const changeExtraHandler = (e, id) => {
    setCollectionForm({
      ...collectionForm,
      [e.target.name]: collectionForm[e.target.name].map((item) => ({
        ...item,
        value: id === item.id ? e.target.value : item.value,
      })),
    });
  };

  const [collections, setCollections] = useState([]);

  const fetchCollections = useCallback(async () => {
    try {
      const data = await request("/api/collections", "GET");
      setCollections(data.filter((collect) => collect.owner_id === user_id));
    } catch (e) {
      console.log(e);
    }
  }, [request, user_id]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = useCallback(async () => {
    try {
      const finalcollectionForm = {
        ...collectionForm,
        addition_number: collectionForm.addition_number.map(
          (item) => item.value
        ),
        addition_title: collectionForm.addition_title.map((item) => item.value),
        addition_description: collectionForm.addition_description.map(
          (item) => item.value
        ),
        addition_date: collectionForm.addition_date.map((item) => item.value),
        addition_checkbox: collectionForm.addition_checkbox.map(
          (item) => item.value
        ),
      };

      await request("/api/collections/create", "POST", {
        ...finalcollectionForm,
      });

      fetchCollections();

      setCollectionForm({
        name: "",
        description: "",
        theme: "",
        owner_id: user_id,
        addition_number: [],
        addition_title: [],
        addition_description: [],
        addition_date: [],
        addition_checkbox: [],
      });
    } catch (e) {
      console.log(e);
    }
  }, [fetchCollections, collectionForm, user_id, request]);

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
          </ul>
        </div>
      </nav>

      <div className="row" style={{ padding: "0 50px" }}>
        <h3>Your Collections</h3>
        <div className="row">
          {collections.map((collection) => (
            <Collection
              key={collection._id}
              collection={collection}
              deleteCollection={() => deleteCollection(collection._id)}
            />
          ))}
        </div>
        <div style={{ marginRight: "50px", padding: "0 12px" }}>
          <div>
            <div className="card">
              <div className="card-content">
                <div className="row">
                  <div className="col s12">
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          onChange={changeHandler}
                          id="name"
                          name="name"
                          type="text"
                          value={collectionForm.name}
                        />
                        <label htmlFor="name">Collection Name</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          onChange={changeHandler}
                          id="description"
                          name="description"
                          type="text"
                          value={collectionForm.description}
                        />
                        <label htmlFor="description">Description</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          onChange={changeHandler}
                          id="theme"
                          name="theme"
                          type="text"
                          value={collectionForm.theme}
                        />
                        <label htmlFor="theme">Theme</label>
                      </div>
                    </div>
                    <div className="row" style={{ display: "flex" }}>
                      {collectionForm.addition_number.map((item) => (
                        <div key={item.id} className="input-field col s12">
                          <input
                            type="text"
                            id={item.id}
                            value={item.value}
                            name="addition_number"
                            onChange={(e) => changeExtraHandler(e, item.id)}
                          />
                          <label htmlFor={item.id}>Additional Number</label>
                        </div>
                      ))}
                    </div>
                    <div className="row" style={{ display: "flex" }}>
                      {collectionForm.addition_title.map((item) => (
                        <div key={item.id} className="input-field col s12">
                          <input
                            type="text"
                            id={item.id}
                            value={item.value}
                            name="addition_title"
                            onChange={(e) => changeExtraHandler(e, item.id)}
                          />
                          <label htmlFor={item.id}>Additonal Title Name</label>
                        </div>
                      ))}
                    </div>
                    <div className="row" style={{ display: "flex" }}>
                      {collectionForm.addition_description.map((item) => (
                        <div key={item.id} className="input-field col s12">
                          <input
                            type="text"
                            id={item.id}
                            value={item.value}
                            name="addition_description"
                            onChange={(e) => changeExtraHandler(e, item.id)}
                          />
                          <label htmlFor={item.id}>
                            Additonal Description Name
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="row" style={{ display: "flex" }}>
                      {collectionForm.addition_date.map((item) => (
                        <div key={item.id} className="input-field col s12">
                          <input
                            type="text"
                            id={item.id}
                            value={item.value}
                            name="addition_date"
                            onChange={(e) => changeExtraHandler(e, item.id)}
                          />
                          <label htmlFor={item.id}>Additonal Date Name</label>
                        </div>
                      ))}
                    </div>
                    <div className="row" style={{ display: "flex" }}>
                      {collectionForm.addition_checkbox.map((item) => (
                        <div key={item.id} className="input-field col s12">
                          <input
                            type="text"
                            id={item.id}
                            value={item.value}
                            name="addition_checkbox"
                            onChange={(e) => changeExtraHandler(e, item.id)}
                          />
                          <label htmlFor={item.id}>
                            Additonal Checkbox Name
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <h6>
                          Add attributes that items in this Collection should
                          have
                        </h6>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn blue"
                          onClick={() => addExtra("addition_number")}
                        >
                          Number
                        </button>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn blue"
                          onClick={() => addExtra("addition_title")}
                        >
                          Title
                        </button>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn blue"
                          onClick={() => addExtra("addition_description")}
                        >
                          Description
                        </button>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn blue"
                          onClick={() => addExtra("addition_date")}
                        >
                          Date
                        </button>
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn blue"
                          onClick={() => addExtra("addition_checkbox")}
                        >
                          Checkbox
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <button
                          disabled={loading}
                          onClick={createCollection}
                          className="btn-large"
                        >
                          Create Your Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YourCollections;
