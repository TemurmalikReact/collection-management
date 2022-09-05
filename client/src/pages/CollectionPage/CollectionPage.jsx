import classNames from "classnames";
import { useContext } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hooks";
import Item from "../Item/Item";
import { Modal } from "../Modal/Modal.";
import Preloader from "../Preloader/Preloader";
import css from "./CollectionPage.module.scss";

function CollectionPage() {
  const { id } = useParams();

  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

  const message = useMessage();
  const { error, loading, request, clearError } = useHttp();

  const { logout, auth } = useContext(AuthContext);

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  const [redirect, setRedirect] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onModalOpen = useCallback(() => {
    setModalOpen((prev) => !prev);
  }, []);

  const [owner, setOwner] = useState({});

  const getOwner = useCallback(
    async (id) => {
      const data = await request(`/api/users/${id}`, "GET");
      setOwner(data);
    },
    [request]
  );

  const [itemForm, setItemForm] = useState({
    name: "",
    tags: [],
    owner_id: user_id,
    parent_id: id,
    required_number: [],
    required_title: [],
    required_description: [],
    required_date: [],
    required_checkbox: [],
    comments: [],
    likes: [],
  });

  const changeHandler = useCallback(
    (e) => {
      setItemForm({ ...itemForm, name: e.target.value });
    },
    [itemForm]
  );

  const changeExtraHandler = useCallback(
    (e, required_item) => {
      setItemForm({
        ...itemForm,
        [required_item]: itemForm[required_item].map((item) =>
          item.name === e.target.name
            ? {
                ...item,
                value: e.target.value,
              }
            : item
        ),
      });
    },
    [itemForm]
  );

  const changeExtraCheckbox = useCallback(
    (e, required_item) => {
      setItemForm({
        ...itemForm,
        [required_item]: itemForm[required_item].map((item) =>
          item.name === e.target.name
            ? {
                ...item,
                value: !item.value,
              }
            : item
        ),
      });
    },
    [itemForm]
  );

  const [tag, setTag] = useState("");

  const changeTagHandler = (e) => {
    setTag(e.target.value);
  };

  const addTag = useCallback(() => {
    if (!itemForm.tags.includes(tag) && tag) {
      setItemForm({ ...itemForm, tags: [tag, ...itemForm.tags] });
      setTag("");
    }
  }, [itemForm, tag]);

  const deleteTag = useCallback(
    (index) => {
      setItemForm({
        ...itemForm,
        tags: itemForm.tags.filter((_, i) => i !== index),
      });
    },
    [itemForm]
  );

  const [collection, setCollection] = useState({
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

  const [modalCollection, setModalCollection] = useState({
    name: "",
    description: "",
    theme: "",
  });

  const modalCollectionHandler = useCallback(
    (e) => {
      setModalCollection({
        ...modalCollection,
        [e.target.name]: e.target.value,
      });
    },
    [modalCollection]
  );

  const findCollection = useCallback(async () => {
    try {
      const data = await request(`/api/collections/${id}`, "GET");
      setCollection(data);

      setModalCollection({
        name: data.name,
        description: data.description,
        theme: data.theme,
      });
    } catch (e) {
      console.log(e);
    }
  }, [id, request]);

  const updateCollection = useCallback(async () => {
    await request(`/api/collections/update`, "POST", {
      ...modalCollection, _id: id
    });

    findCollection();
  }, [findCollection, id, modalCollection, request]);

  const deleteCollection = useCallback(async () => {
    try {
      await request("/api/collections/delete", "DELETE", { id });
      await request("/api/items/delete-all", "DELETE", { id });
      setRedirect(true);
    } catch (e) {
      console.log(e);
    }
  }, [id, request]);

  useEffect(() => {
    findCollection();
  }, [findCollection]);

  const [toggleCreate, setToggleCreate] = useState(false);

  const onToggleCreate = () => {
    setToggleCreate((prev) => !prev);
  };

  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const data = await request("/api/items", "GET");
      setItems(data.filter((item) => item.parent_id === id));

      setItemForm({
        name: "",
        tags: [],
        owner_id: user_id,
        parent_id: id,
        required_number: collection.addition_number.map((item) => ({
          name: item,
          value: "",
        })),
        required_title: collection.addition_title.map((item) => ({
          name: item,
          value: "",
        })),
        required_description: collection.addition_description.map((item) => ({
          name: item,
          value: "",
        })),
        required_date: collection.addition_date.map((item) => ({
          name: item,
          value: "2000-01-01",
        })),
        required_checkbox: collection.addition_checkbox.map((item) => ({
          name: item,
          value: false,
        })),
        comments: [],
        likes: [],
      });
    } catch (e) {
      console.log(e);
    }
  }, [collection, id, request, user_id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    getOwner(collection.owner_id);
  }, [collection.owner_id, getOwner]);

  const createItem = useCallback(async () => {
    try {
      await request(`/api/items/create`, "POST", { ...itemForm });

      fetchItems();
    } catch (e) {
      console.log(e);
    }
  }, [fetchItems, itemForm, request]);

  const deleteItem = useCallback(
    async (id) => {
      await request(`/api/items/delete`, "DELETE", { id });

      fetchItems();
    },
    [fetchItems, request]
  );

  if (redirect) {
    return <Redirect to="/your-collections" />;
  }

  return (
    <>
    <Preloader loading={loading} />
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
            {owner && owner.role && owner.role.includes("ADMIN") && (
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
      <div className={css.row}>
        <Modal toggle={onModalOpen} open={modalOpen} action={updateCollection}>
          <div className={classNames(css.modal__input)}>
            <label>Collection Name</label>
            <input
              className={css.input}
              onChange={(e) => modalCollectionHandler(e)}
              value={modalCollection.name}
              type="text"
              name="name"
            />
          </div>
          <div className={classNames(css.modal__input)}>
            <label>Collection Description</label>
            <textarea
              onKeyUp={(e) => modalCollectionHandler(e)}
              type="text"
              name="description"
            >
              {collection.description}
            </textarea>
          </div>
          <div className={classNames(css.modal__input)}>
            <label>Collection Theme</label>
            <input
              className={css.input}
              onChange={(e) => modalCollectionHandler(e)}
              value={modalCollection.theme}
              type="text"
              name="theme"
            />
          </div>
        </Modal>
        <div className={css.collection}>
          <div className={css.wrapper}>
            <div className={css.image}>
              <img
                alt=""
                src="https://i.pinimg.com/originals/15/f6/a3/15f6a3aac562ee0fadbbad3d4cdf47bc.jpg"
              />
            </div>
            <div className={css.content}>
              <p className={css.content__text}>
                <span className={css.title}>{collection.name}</span>
                <span className={css.theme}>
                  <b>Theme:</b> {collection.theme} <br />
                  <b>Items: </b> {items.length} <br />
                </span>
              </p>
              {/* <div className={css.navbar}>
              <span className={css.navbar__date}>
                31,831 views - Oct 25, 2017
              </span>
              <div className={css.navbar__likes}>
                <div className="blue-text">
                  <i className="material-icons">thumb_up</i> 500K
                </div>
                <div className="grey-text text-lighten-1">
                  <i className="material-icons">thumb_down</i> 500
                </div>
              </div>
            </div> */}
              <div className={css.extra}>
                <div className={css.image}>
                  <img
                    src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                    alt=""
                  />
                </div>
                <div className={css.footer}>
                  <div className={css.footer__row}>
                    <span className={css.footer__text}>
                      <b className={css.owner}>{owner.userName} </b>
                      <span className={css.length}></span>
                    </span>
                    <div className={css.footer__action}>
                      <button
                        disabled={
                          user_id !== collection.owner_id &&
                          owner &&
                          !owner.role.includes("ADMIN")
                        }
                        onClick={onModalOpen}
                        className="btn-floating waves-effect waves-light btn"
                      >
                        <i className="material-icons">edit</i>
                      </button>
                      <button
                        disabled={
                          user_id !== collection.owner_id &&
                          owner &&
                          !owner.role.includes("ADMIN")
                        }
                        onClick={deleteCollection}
                        className="btn-floating waves-effect waves-light red btn"
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </div>
                  </div>
                  <div className={css.footer__row}>
                    <div className={css.footer__description}>
                      {collection.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css.items}>
          <div className={classNames(css.add, toggleCreate ? css.open : null)}>
            <div
              className={classNames(
                css.add__name,
                css.add__input,
              )}
            >
              <input
                onChange={(e) => changeHandler(e)}
                value={itemForm.name}
                type="text"
                name="name"
                id="name"
                placeholder="Name"
              />
            </div>
            <div className={css.tags}>
              {itemForm.tags.map((tag, i) => (
                <div className={css.tags__item} onClick={() => deleteTag(i)}>
                  <div className={css.tags__text}>{tag}</div>
                  <i className={classNames(css.tags__icon, "material-icons")}>
                    close
                  </i>
                </div>
              ))}
            </div>
            <div className={classNames(css.tag, css.add__input)}>
              <input
                value={tag}
                onChange={(e) => changeTagHandler(e)}
                type="text"
                name="tags"
                placeholder="Add tag"
              />
              <button onClick={() => addTag()} className="btn">
                +
              </button>
            </div>
            {itemForm.required_number.map((item) => (
              <div className={classNames(css.add__input, "input-field")}>
                <label htmlFor={item.name}>{item.name}</label>
                <input
                  value={item.value}
                  type="number"
                  name={item.name}
                  id={item.name}
                  onChange={(e) => changeExtraHandler(e, "required_number")}
                />
              </div>
            ))}
            {itemForm.required_title.map((item) => (
              <div className={classNames(css.add__input, "input-field")}>
                <label htmlFor={item.name}>{item.name}</label>
                <input
                  value={item.value}
                  type="text"
                  name={item.name}
                  id={item.name}
                  onChange={(e) => changeExtraHandler(e, "required_title")}
                />
              </div>
            ))}
            {itemForm.required_description.map((item) => (
              <div className={classNames(css.add__input, "input-field")}>
                <label htmlFor={item.name}>{item.name}</label>
                <input
                  value={item.value}
                  type="text"
                  name={item.name}
                  id={item.name}
                  onChange={(e) =>
                    changeExtraHandler(e, "required_description")
                  }
                />
              </div>
            ))}
            {itemForm.required_date.map((item) => (
              <div className={css.add__input}>
                <label>{item.name}</label>
                <input
                  value={item.value}
                  type="date"
                  name={item.name}
                  id={item.name}
                  onChange={(e) => changeExtraHandler(e, "required_date")}
                />
              </div>
            ))}
            {itemForm.required_checkbox.map((item) => (
              <div>
                <label>
                  <input
                    onChange={(e) =>
                      changeExtraCheckbox(e, "required_checkbox")
                    }
                    type="checkbox"
                    name={item.name}
                    checked={item.value}
                  />
                  <span>{item.name}</span>
                </label>
              </div>
            ))}
            <br />
            <button className="btn" onClick={createItem}>
              Submit
            </button>
          </div>
          <button
            disabled={
              user_id !== collection.owner_id &&
              owner &&
              !owner.role.includes("ADMIN")
            }
            onClick={onToggleCreate}
            className={classNames(css.add__button)}
          >
            {toggleCreate ? "Hide" : "Create Item"}
          </button>
          <div className={css.items__link}>
            {items.map((item) => (
              <Item deleteItem={() => deleteItem(item._id)} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CollectionPage;
