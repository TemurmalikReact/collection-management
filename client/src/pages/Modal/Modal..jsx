import classNames from "classnames";
import css from "./Modal.module.scss";

export function Modal({ children, open, toggle, action }) {
  return (
    <>
      <div className={classNames(css.modal, open ? css.open : null)}>
        <i className={classNames(css.icon, 'material-icons')} onClick={toggle}>
          close
        </i>
        {children} <br />
        <button
          onClick={() => {
            action();
            toggle();
          }}
          className="btn"
        >
          Save
        </button>
      </div>
      <div
        onClick={toggle}
        className={classNames(css.backdrop, open ? css.open : null)}
      />
    </>
  );
}
