import classNames from "classnames";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";

export function Collection({
  small,
  collection: { name, description, theme, owner_id, _id, item_length },
  deleteCollection,
}) {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

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
    <div className={classNames('col', 'm6')}>
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
            </span>{" "}
            <br />
            {item_length !== undefined && (
              <span>
                <b>Items:</b> <span>{item_length}</span>
              </span>
            )}
          </p>
          <div className="card-bottom grey-text">
            <span>
              <img
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                alt=""
              />
              {owner.userName}
            </span>
            <button
              disabled={user_id !== owner_id && (owner && !owner.role.includes("ADMIN"))}
              className="btn red btn-floating"
              onClick={deleteCollection}
            >
              <i aria-disabled className="material-icons small">
                delete_forever
              </i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
