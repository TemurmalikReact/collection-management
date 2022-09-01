import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hooks";
import classNames from "classnames";
import styles from "./Collection.module.scss";

function Collection() {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const local_id = stored_id ? stored_id.userId : "";

  const message = useMessage();
  const { id } = useParams();
  const { error, loading, request, clearError } = useHttp();

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  const [collection, setCollection] = useState({
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

  const findCollection = useCallback(async () => {
    try {
      const data = await request(`/api/collections/${id}`, "GET");
      setCollection(data);
    } catch (e) {
      console.log(e);
    }
  }, [id, request]);

  useEffect(() => {
    findCollection();
  }, [findCollection]);

  const [owner, setOwner] = useState("");

  const getOwner = useCallback(
    async (id) => {
      const data = await request(`/api/users/${id}`, "GET");
      setOwner(data);
    },
    [request]
  );

  useEffect(() => {
    getOwner(collection.owner_id);
  }, [collection.owner_id, getOwner]);

  if (loading) {
    return (
      <h1 className="row" style={{ padding: "0 50px" }}>
        Loading...
      </h1>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.column}>
        <div className={styles.collection}>
          <div className={styles.image}>
            <img
              alt=""
              src="https://i.pinimg.com/originals/15/f6/a3/15f6a3aac562ee0fadbbad3d4cdf47bc.jpg"
            />
          </div>
          <div className={styles.content}>
            <p className={styles.content__text}>
              <span className={styles.title}>{collection.name}</span>
              <span className={styles.theme}>
                <b>Theme:</b> {collection.theme}
              </span>
            </p>
            <div className={styles.content__navbar}>
              <span className={styles.content__navbar_date}>
                31,831 views - Oct 25, 2017
              </span>
              <div className={styles.content__navbar_likes}>
                <div className="blue-text">
                  <i className="material-icons">thumb_up</i> 500K
                </div>
                <div className="grey-text text-lighten-1">
                  <i className="material-icons">thumb_down</i> 500
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <img
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                alt=""
              />
              <div className={styles.content}>
                <div className={styles.content_item}>
                  <span className={styles.content_text}>
                    <b>{owner.userName} </b>
                    <span>30 items</span>
                  </span>
                  <li className="btn-floating waves-effect waves-light red btn">
                    <i className="material-icons">delete</i>
                  </li>
                </div>
                <div className={styles.content_item}>
                  <div className={styles.content_description}>
                    {collection.description} <br /> {collection.description} <br /> <br /> <br />
                    {collection.description} <br /> {collection.description} 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.items}>items</div>
    </div>
  );
}

export default Collection;
