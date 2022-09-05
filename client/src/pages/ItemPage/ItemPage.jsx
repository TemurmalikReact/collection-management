import classNames from "classnames";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hooks";
import css from "./ItemPage.module.scss";
import Preloader from "../Preloader/Preloader";
import { Modal } from "../Modal/Modal.";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ItemPage() {
  const { id } = useParams();

  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

  const { logout, auth } = useContext(AuthContext);

  const message = useMessage();
  const { error, loading, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  const [redirect, setRedirect] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onModalOpen = useCallback(() => {
    setModalOpen((prev) => !prev);
  }, []);

  const [owner, setOwner] = useState("");

  const getOwner = useCallback(
    async (id) => {
      const data = await request(`/api/users/${id}`, "GET");
      setOwner(data);
    },
    [request]
  );

  const [parent, setParent] = useState("");

  const getParent = useCallback(
    async (id) => {
      const data = await request(`/api/collections/${id}`, "GET");
      setParent(data);
    },
    [request]
  );

  const [item, setItem] = useState({
    name: "",
    tags: [],
    owner_id: "",
    parent_id: "",
    required_number: [],
    required_title: [],
    required_description: [],
    required_date: [],
    required_checkbox: [],
    comments: [],
    likes: [],
  });

  const [modalItem, setModalItem] = useState({
    name: "",
    tags: [],
    owner_id: "",
    parent_id: "",
    required_number: [],
    required_title: [],
    required_description: [],
    required_date: [],
    required_checkbox: [],
    comments: [],
    likes: [],
  });

  const [tag, setTag] = useState("");

  const changeTagHandler = (e) => {
    setTag(e.target.value);
  };

  const addTag = useCallback(() => {
    if (!modalItem.tags.includes(tag) && tag) {
      setModalItem({ ...modalItem, tags: [tag, ...modalItem.tags] });
      setTag("");
    }
  }, [modalItem, tag]);

  const deleteTag = useCallback(
    (index) => {
      setModalItem({
        ...modalItem,
        tags: modalItem.tags.filter((_, i) => i !== index),
      });
    },
    [modalItem]
  );

  const modalItemHandler = useCallback(
    (e) => {
      setModalItem({
        ...modalItem,
        [e.target.name]: e.target.value,
      });
    },
    [modalItem]
  );

  const modalExtraHandler = useCallback(
    (e, required_item) => {
      setModalItem({
        ...modalItem,
        [required_item]: modalItem[required_item].map((item) =>
          item.name === e.target.name
            ? {
                ...item,
                value: e.target.value,
              }
            : item
        ),
      });
    },
    [modalItem]
  );

  const changeExtraCheckbox = useCallback(
    (e, required_item) => {
      setModalItem({
        ...modalItem,
        [required_item]: modalItem[required_item].map((item) =>
          item.name === e.target.name
            ? {
                ...item,
                value: !item.value,
              }
            : item
        ),
      });
    },
    [modalItem]
  );

  const findItem = useCallback(async () => {
    try {
      const data = await request(`/api/items/${id}`, "GET");
      setItem(data);

      setModalItem(data);
    } catch (e) {
      console.log(e);
    }
  }, [id, request]);

  const updateItem = useCallback(async () => {
    await request(`/api/items/update`, "POST", {
      ...modalItem,
    });

    console.log(modalItem);
    findItem();
  }, [findItem, modalItem, request]);

  const deleteItem = useCallback(async () => {
    try {
      await request("/api/items/delete", "DELETE", { id });
      setRedirect(true);
    } catch (e) {
      console.log(e);
    }
  }, [id, request]);

  useEffect(() => {
    findItem();
  }, [findItem]);

  useEffect(() => {
    getOwner(item.owner_id);
    getParent(item.parent_id);
  }, [item, getOwner, item.parent_id, getParent]);

  if (redirect) {
    return <Redirect to={`/collection/${item.parent_id}`} />;
  }
  return (
    <>
      <Preloader loading={loading || !parent.name || !owner.userName} />
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
        <Modal toggle={onModalOpen} open={modalOpen} action={updateItem}>
          <div className={classNames(css.modal__input)}>
            <label>Item Name</label>
            <input
              className={css.input}
              onChange={(e) => modalItemHandler(e)}
              type="text"
              name="name"
              value={modalItem.name}
            />
          </div>
          <div className={classNames(css.modal__input, css.tags)}>
            <div className={css.tags__wrapper}>
              {modalItem.tags.map((tag_item, i) => (
                <div className={css.tags__item} onClick={() => deleteTag(i)}>
                  <div className={css.tags__text}>{tag_item}</div>
                  <i className={classNames(css.tags__icon, "material-icons")}>
                    close
                  </i>
                </div>
              ))}
            </div>
            <div className={css.tags__main}>
              <input
                className={css.input}
                value={tag}
                onChange={(e) => changeTagHandler(e)}
                type="text"
                name="tags"
                id="tags"
                placeholder="Add tag to your item"
              />
              <button onClick={addTag} className="btn">
                +
              </button>
            </div>
          </div>
          <div className={classNames(css.modal__input, css.horizontal)}>
            {modalItem.required_number.map((required_item) => (
              <div className={css.input_field}>
                <label>{required_item.name}</label>
                <input
                  className={css.input}
                  onChange={(e) => modalExtraHandler(e, "required_number")}
                  type="text"
                  name={required_item.name}
                  value={required_item.value}
                />
              </div>
            ))}
          </div>
          <div className={classNames(css.modal__input, css.horizontal)}>
            {modalItem.required_title.map((required_item) => (
              <div className={classNames(css.input_field)}>
                <label>{required_item.name}</label>
                <input
                  className={css.input}
                  onChange={(e) => modalExtraHandler(e, "required_title")}
                  type="text"
                  name={required_item.name}
                  value={required_item.value}
                />
              </div>
            ))}
          </div>
          {modalItem.required_description.map((required_item) => (
            <div className={classNames(css.modal__input)}>
              <label>{required_item.name}</label>
              <input
                className={css.input}
                onChange={(e) => modalExtraHandler(e, "required_description")}
                type="text"
                name={required_item.name}
                value={required_item.value}
              />
            </div>
          ))}
          <div className={classNames(css.modal__input, css.horizontal)}>
            {modalItem.required_date.map((required_item) => (
              <div className={css.input_field}>
                <label>{required_item.name}</label>
                <input
                  className={css.input}
                  onChange={(e) => modalExtraHandler(e, "required_date")}
                  type="date"
                  name={required_item.name}
                  value={required_item.value}
                />
              </div>
            ))}
          </div>
          <div className={classNames(css.modal__input, css.horizontal)}>
            {modalItem.required_checkbox.map((item) => (
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
          </div>
        </Modal>
        <div className={css.main}>
          <div className={css.main__row}>
            <span>Collection:</span>
            <p>{parent.name}</p>
          </div>
          <div className={css.main__row}>
            <span>Created by:</span>
            <p>{owner.userName}</p>
          </div>
          <div className={css.main__row}>
            <span>Name:</span>
            <p>{item.name}</p>
          </div>
          <div className={css.main__row}>
            <span>Tags:</span>
            {item.tags.map((tag) => (
              <span className={css.tag}>#{tag}</span>
            ))}
          </div>
          {item.required_number.map((item) => (
            <div className={classNames(css.main__row)}>
              <span>{item.name}:</span>
              <p>{item.value}</p>
            </div>
          ))}
          {item.required_title.map((item) => (
            <div className={classNames(css.main__row)}>
              <span>{item.name}:</span>
              <p>{item.value}</p>
            </div>
          ))}
          {item.required_description.map((item) => (
            <div className={classNames(css.main__row)}>
              <span>{item.name}:</span>
              <p>{item.value}</p>
            </div>
          ))}
          {item.required_date.map((item) => (
            <div className={css.main__row}>
              <span>{item.name}:</span>
              <p>{item.value}</p>
            </div>
          ))}
          {item.required_checkbox.map((item) => (
            <div className={classNames(css.main__row)}>
              <p>
                {item.name}:
                <i className="material-icons">
                  {item.value ? "check" : "close"}
                </i>
              </p>
            </div>
          ))}
          <div className={classNames(css.main__row, css.check)}>
            <div>
              <button
                disabled={
                  user_id !== owner._id &&
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
                  user_id !== owner._id &&
                  owner &&
                  !owner.role.includes("ADMIN")
                }
                onClick={deleteItem}
                className="btn-floating waves-effect waves-light red btn"
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemPage;
