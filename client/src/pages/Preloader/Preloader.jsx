import classNames from "classnames";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hooks";
import css from "./Preloader.module.scss";
import preloader from "../../img/preloader.gif";

function Preloader() {
  return <img className={css.preloader} src={preloader} alt="" />;
}

export default Preloader;
