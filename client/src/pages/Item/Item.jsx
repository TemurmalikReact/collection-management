import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hooks";
import Preloader from "../Preloader/Preloader";
import css from "./Item.module.scss";

function Item({ item: { name, tags, owner_id, _id, deleteItem } }) {
  const message = useMessage();
  const { error, loading, request, clearError } = useHttp();

  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const user_id = stored_id ? stored_id.userId : "";

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
  }, [owner_id, getOwner]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className={css.item}>
      <Link to={`/item/${_id}`}>
        <div className={css.image}>
          <img
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
            alt=""
          />
        </div>
        <div className={css.content}>
          <div className={css.tags}>
            {tags.map((tag) => (
              <div className={css.tags__portion}>#{tag}</div>
            ))}
          </div>
          <div className={css.content__title}>{name}</div>
          <div className={css.content__owner}>{owner.userName}</div>
        </div>
      </Link>
      <div className={css.icon}>
        <button
          onClick={deleteItem}
          disabled={
            user_id !== owner_id && owner && !owner.role.includes("ADMIN")
          }
          className="btn-floating btn red"
        >
          <i className="material-icons">delete</i>
        </button>
      </div>
    </div>
  );
}

export default Item;
