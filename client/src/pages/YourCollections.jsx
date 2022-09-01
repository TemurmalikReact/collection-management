import { Route, Redirect, Switch, Link, NavLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hooks";
import "./YourCollections.css";

function Collection({
  collection: { name, description, theme, owner_id, _id },
  deleteCollection,
}) {
  const { request } = useHttp();

  const [owner, setOwner] = useState("");

  const getOwner = useCallback(
    async (id) => {
      const data = await request(`/api/users/${id}`, "GET");
      setOwner(data);
    },
    [request]
  );

  useEffect(() => {
    getOwner(owner_id);
  }, [getOwner, owner_id]);

  return (
    <div className="col s12 m4">
      <div className="card hoverable">
        <div className="card-image">
          <img
            alt=""
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
          />
          <Link to={`/collection/${_id}`}>
            <li className="btn-floating halfway-fab waves-effect waves-light blue btn-large">
              <i className="material-icons edit">link</i>
            </li>
          </Link>
        </div>
        <div className="card-content">
          <span className="card-title">{name}</span>
          <p className="card-text">
            {description} <br /> <br />
            <span>
              <b>Theme:</b> <span>{theme}</span>
            </span>
          </p>
          <div className="card-bottom grey-text">
            <span>
              <img
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                alt=""
              />
              {owner.userName}
            </span>
            <i onClick={deleteCollection} className="material-icons small">
              delete_forever
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

function YourCollections() {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const local_id = stored_id ? stored_id.userId : "";

  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    theme: "",
    owner_id: local_id,
    required_number: [],
    required_title: [],
    required_description: [],
    required_date: [],
    required_checkbox: [],
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExtraInput = (input) => {
    if (form[input].length < 3) {
      setForm({
        ...form,
        [input]: [
          ...form[input],
          {
            value: "",
            id: Math.random(),
          },
        ],
      });
    }
  };

  const changeExtraInput = (e, id) => {
    setForm({
      ...form,
      [e.target.name]: form[e.target.name].map((item) => ({
        ...item,
        value: id === item.id ? e.target.value : item.value,
      })),
    });
  };

  const [collections, setCollections] = useState([]);

  const fetchCollections = useCallback(async () => {
    try {
      const data = await request("/api/collections", "GET");
      setCollections(data);
    } catch (e) {
      console.log(e);
    }
  }, [request]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = useCallback(async () => {
    try {
      const finalForm = {
        ...form,
        required_number: form.required_number
          .map((item) => item.value)
          .filter((item) => item),
        required_title: form.required_title
          .map((item) => item.value)
          .filter((item) => item),
        required_description: form.required_description
          .map((item) => item.value)
          .filter((item) => item),
        required_date: form.required_date
          .map((item) => item.value)
          .filter((item) => item),
        required_checkbox: form.required_checkbox
          .map((item) => item.value)
          .filter((item) => item),
      };

      await request("/api/collections/create", "POST", { ...finalForm });

      fetchCollections();

      setForm({
        name: "",
        description: "",
        theme: "",
        owner_id: local_id,
        required_number: [],
        required_title: [],
        required_description: [],
        required_date: [],
        required_checkbox: [],
      });
    } catch (e) {
      console.log(e);
    }
  }, [fetchCollections, form, local_id, request]);

  const deleteCollection = useCallback(
    async (id) => {
      try {
        await request("/api/collections/delete", "DELETE", { id });
        fetchCollections();
      } catch (e) {
        console.log(e);
      }
    },
    [fetchCollections, request]
  );

  return (
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
                        value={form.name}
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
                        value={form.description}
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
                        value={form.theme}
                      />
                      <label htmlFor="theme">Theme</label>
                    </div>
                  </div>
                  <div className="row" style={{ display: "flex" }}>
                    {form.required_number.map((item) => (
                      <div key={item.id} className="input-field col s12">
                        <input
                          type="text"
                          id={item.id}
                          value={item.value}
                          name="required_number"
                          onChange={(e) => changeExtraInput(e, item.id)}
                        />
                        <label htmlFor={item.id}>Additional Number</label>
                      </div>
                    ))}
                  </div>
                  <div className="row" style={{ display: "flex" }}>
                    {form.required_title.map((item) => (
                      <div key={item.id} className="input-field col s12">
                        <input
                          type="text"
                          id={item.id}
                          value={item.value}
                          name="required_title"
                          onChange={(e) => changeExtraInput(e, item.id)}
                        />
                        <label htmlFor={item.id}>Additonal Title Name</label>
                      </div>
                    ))}
                  </div>
                  <div className="row" style={{ display: "flex" }}>
                    {form.required_description.map((item) => (
                      <div key={item.id} className="input-field col s12">
                        <input
                          type="text"
                          id={item.id}
                          value={item.value}
                          name="required_description"
                          onChange={(e) => changeExtraInput(e, item.id)}
                        />
                        <label htmlFor={item.id}>
                          Additonal Description Name
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="row" style={{ display: "flex" }}>
                    {form.required_date.map((item) => (
                      <div key={item.id} className="input-field col s12">
                        <input
                          type="text"
                          id={item.id}
                          value={item.value}
                          name="required_date"
                          onChange={(e) => changeExtraInput(e, item.id)}
                        />
                        <label htmlFor={item.id}>Additonal Date Name</label>
                      </div>
                    ))}
                  </div>
                  <div className="row" style={{ display: "flex" }}>
                    {form.required_checkbox.map((item) => (
                      <div key={item.id} className="input-field col s12">
                        <input
                          type="text"
                          id={item.id}
                          value={item.value}
                          name="required_checkbox"
                          onChange={(e) => changeExtraInput(e, item.id)}
                        />
                        <label htmlFor={item.id}>Additonal Checkbox Name</label>
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <h6>
                        Add attributes that items in this Collection should have
                      </h6>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn blue"
                        onClick={() => addExtraInput("required_number")}
                      >
                        Number
                      </button>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn blue"
                        onClick={() => addExtraInput("required_title")}
                      >
                        Title
                      </button>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn blue"
                        onClick={() => addExtraInput("required_description")}
                      >
                        Description
                      </button>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn blue"
                        onClick={() => addExtraInput("required_date")}
                      >
                        Date
                      </button>
                      <button
                        style={{ marginRight: "10px" }}
                        className="btn blue"
                        onClick={() => addExtraInput("required_checkbox")}
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
  );
}

export default YourCollections;
