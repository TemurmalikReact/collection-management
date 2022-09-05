import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import "./User.css";

function UsersPage() {
  const stored_id = JSON.parse(localStorage.getItem("collection_userData"));
  const local_id = stored_id ? stored_id.userId : "";

  const { loading, request } = useHttp();

  const { logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  const [checkedUsers, setCheckedUsers] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const fetchUsers = useCallback(async () => {
    const data = await request("/api/users", "GET");
    setUsers(data);
  }, [request]);

  const updateUserStatus = useCallback(
    async (isBlocked) => {
      const selfSelect = checkedUsers.find((user) => user === local_id);

      if (users.length === checkedUsers.length) {
        await request("/api/users/update-status/all", "POST", {
          isBlocked,
        });
      } else {
        for (const id of checkedUsers) {
          await request("/api/users/update-status", "POST", {
            id,
            isBlocked,
          });
          await fetchUsers();
        }
      }

      if (selfSelect && isBlocked) {
        logout();
      }
    },
    [checkedUsers, users.length, local_id, request, logout, fetchUsers]
  );

  const deleteUser = useCallback(async () => {
    const selfSelect = checkedUsers.find((user) => user === local_id);

    if (users.length === checkedUsers.length) {
      await request("/api/users/delete/all", "DELETE");

      setCheckAll(false);
      setCheckedUsers([]);
    } else {
      for (const id of checkedUsers) {
        await request("/api/users/delete", "DELETE", { id });
        setCheckedUsers(checkedUsers.filter((checkedId) => checkedId !== id));
      }
      await fetchUsers();
    }

    if (selfSelect) {
      logout();
    } else {
      await fetchUsers();
    }
  }, [checkedUsers, users.length, logout, fetchUsers, local_id, request]);

  const onCheckBox = useCallback(
    (id) => {
      if (checkedUsers.includes(id)) {
        setCheckedUsers(checkedUsers.filter((checkedId) => checkedId !== id));
        setCheckAll(false);
      } else {
        setCheckedUsers([...checkedUsers, id]);
        if (users.length - 1 === checkedUsers.length) {
          setCheckAll(true);
        }
      }
    },
    [checkedUsers, users]
  );

  const onCheckAll = useCallback(() => {
    if (checkAll) {
      setCheckAll(false);
      setCheckedUsers([]);
    } else {
      setCheckAll(true);
      setCheckedUsers(users.map((user) => user._id));
    }
  }, [checkAll, users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <h1 className="row" style={{ padding: "0 50px" }}>
        Loading...
      </h1>
    );
  }

  return (
    <>
      <div className="row" style={{ padding: "0 50px" }}>
        <h1>Users</h1>
        <button
          style={{ marginRight: "15px", paddingRight: "5px" }}
          className="btn"
          onClick={() => updateUserStatus(true)}
        >
          Block
          <svg
            className="material-icons right"
            fill="#fff"
            width="27.5pt"
            height="27.5pt"
            version="1.1"
            viewBox="0 0 752 752"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="m509.2 597.99h-266.39c-11.777 0-23.07-4.6758-31.395-13.004-8.3281-8.3242-13.004-19.617-13.004-31.395v-162.79c0-11.773 4.6758-23.066 13.004-31.395 8.3242-8.3242 19.617-13.004 31.395-13.004h266.39c11.777 0 23.07 4.6797 31.395 13.004 8.3281 8.3281 13.004 19.621 13.004 31.395v162.79c0 11.777-4.6758 23.07-13.004 31.395-8.3242 8.3281-19.617 13.004-31.395 13.004zm-266.39-221.99c-3.9258 0-7.6914 1.5625-10.465 4.3359-2.7773 2.7773-4.3359 6.5391-4.3359 10.465v162.79c0 3.9258 1.5586 7.6914 4.3359 10.465 2.7734 2.7773 6.5391 4.3359 10.465 4.3359h266.39c3.9258 0 7.6914-1.5586 10.465-4.3359 2.7773-2.7734 4.3359-6.5391 4.3359-10.465v-162.79c0-3.9258-1.5586-7.6875-4.3359-10.465-2.7734-2.7734-6.5391-4.3359-10.465-4.3359z" />
              <path d="m494.4 376h-236.79c-3.9258 0-7.6875-1.5586-10.465-4.332-2.7734-2.7773-4.332-6.5391-4.332-10.465v-88.797c0-31.402 12.473-61.516 34.676-83.719s52.316-34.676 83.719-34.676h29.598c31.402 0 61.516 12.473 83.719 34.676s34.676 52.316 34.676 83.719v88.797c0 3.9258-1.5586 7.6875-4.332 10.465-2.7773 2.7734-6.543 4.332-10.465 4.332zm-221.99-29.598h207.19v-73.996c0-23.551-9.3555-46.137-26.008-62.789-16.652-16.652-39.238-26.008-62.789-26.008h-29.598c-23.551 0-46.137 9.3555-62.789 26.008-16.652 16.652-26.008 39.238-26.008 62.789z" />
              <path d="m376 479.6c-7.8477 0-15.379-3.1172-20.93-8.668-5.5508-5.5508-8.668-13.082-8.668-20.93 0-7.8516 3.1172-15.379 8.668-20.93 5.5508-5.5508 13.082-8.6719 20.93-8.6719 7.8516 0 15.379 3.1211 20.93 8.6719 5.5508 5.5508 8.6719 13.078 8.6719 20.93 0 7.8477-3.1211 15.379-8.6719 20.93-5.5508 5.5508-13.078 8.668-20.93 8.668z" />
              <path d="m361.2 464.8h29.598v59.199h-29.598z" />
            </g>
          </svg>
        </button>
        <button
          className="btn blue"
          style={{ marginRight: "15px", paddingRight: "5px" }}
          onClick={() => updateUserStatus(false)}
        >
          UnBlock
          <svg
            className="material-icons right"
            fill="#fff"
            width="27.5pt"
            height="27.5pt"
            version="1.1"
            viewBox="0 0 752 752"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="m509.2 597.99h-266.39c-11.777 0-23.07-4.6758-31.395-13.004-8.3281-8.3242-13.004-19.617-13.004-31.395v-162.79c0-11.773 4.6758-23.066 13.004-31.395 8.3242-8.3242 19.617-13.004 31.395-13.004h266.39c11.777 0 23.07 4.6797 31.395 13.004 8.3281 8.3281 13.004 19.621 13.004 31.395v162.79c0 11.777-4.6758 23.07-13.004 31.395-8.3242 8.3281-19.617 13.004-31.395 13.004zm-266.39-221.99c-3.9258 0-7.6914 1.5625-10.465 4.3359-2.7773 2.7773-4.3359 6.5391-4.3359 10.465v162.79c0 3.9258 1.5586 7.6914 4.3359 10.465 2.7734 2.7773 6.5391 4.3359 10.465 4.3359h266.39c3.9258 0 7.6914-1.5586 10.465-4.3359 2.7773-2.7734 4.3359-6.5391 4.3359-10.465v-162.79c0-3.9258-1.5586-7.6875-4.3359-10.465-2.7734-2.7734-6.5391-4.3359-10.465-4.3359z" />
              <path d="m257.61 376c-3.9258 0-7.6875-1.5586-10.465-4.332-2.7734-2.7773-4.332-6.5391-4.332-10.465v-88.797c0-31.402 12.473-61.516 34.676-83.719s52.316-34.676 83.719-34.676h29.598c31.402 0 61.516 12.473 83.719 34.676s34.676 52.316 34.676 83.719c0 5.2852-2.8203 10.172-7.3984 12.816-4.5781 2.6445-10.223 2.6445-14.801 0-4.5781-2.6445-7.3984-7.5312-7.3984-12.816 0-23.551-9.3555-46.137-26.008-62.789-16.652-16.652-39.238-26.008-62.789-26.008h-29.598c-23.551 0-46.137 9.3555-62.789 26.008-16.652 16.652-26.008 39.238-26.008 62.789v88.797c0 3.9258-1.5586 7.6875-4.3359 10.465-2.7734 2.7734-6.5391 4.332-10.465 4.332z" />
              <path d="m376 479.6c-7.8477 0-15.379-3.1172-20.93-8.668-5.5508-5.5508-8.668-13.082-8.668-20.93 0-7.8516 3.1172-15.379 8.668-20.93 5.5508-5.5508 13.082-8.6719 20.93-8.6719 7.8516 0 15.379 3.1211 20.93 8.6719 5.5508 5.5508 8.6719 13.078 8.6719 20.93 0 7.8477-3.1211 15.379-8.6719 20.93-5.5508 5.5508-13.078 8.668-20.93 8.668z" />
              <path d="m361.2 464.8h29.598v59.199h-29.598z" />
            </g>
          </svg>
        </button>
        <button
          style={{ marginRight: "15px", paddingRight: "5px" }}
          className="btn red"
          onClick={deleteUser}
        >
          Delete
          <svg
            className="material-icons right"
            fill="#fff"
            width="27.5pt"
            height="27.5pt"
            version="1.1"
            viewBox="0 0 752 752"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="m494.4 597.99h-236.79c-11.773 0-23.066-4.6758-31.395-13.004-8.3242-8.3242-13.004-19.617-13.004-31.395v-281.19c0-5.2891 2.8203-10.172 7.4023-12.816 4.5781-2.6445 10.219-2.6445 14.797 0 4.5781 2.6445 7.4023 7.5273 7.4023 12.816v281.19c0 3.9258 1.5586 7.6914 4.332 10.465 2.7773 2.7773 6.5391 4.3359 10.465 4.3359h236.79c3.9219 0 7.6875-1.5586 10.465-4.3359 2.7734-2.7734 4.332-6.5391 4.332-10.465v-281.19c0-5.2891 2.8203-10.172 7.4023-12.816 4.5781-2.6445 10.219-2.6445 14.797 0 4.5781 2.6445 7.3984 7.5273 7.3984 12.816v281.19c0 11.777-4.6758 23.07-13.004 31.395-8.3242 8.3281-19.617 13.004-31.391 13.004z" />
              <path d="m553.59 242.81h-355.18c-5.2891 0-10.176-2.8242-12.816-7.4023-2.6445-4.5781-2.6445-10.219 0-14.797 2.6406-4.582 7.5273-7.4023 12.816-7.4023h355.18c5.2891 0 10.172 2.8203 12.816 7.4023 2.6445 4.5781 2.6445 10.219 0 14.797-2.6445 4.5781-7.5273 7.4023-12.816 7.4023z" />
              <path d="m435.2 242.81c-3.9258 0-7.6914-1.5625-10.465-4.3359-2.7773-2.7773-4.3359-6.5391-4.3359-10.465v-44.398h-88.797v44.398c0 5.2852-2.8203 10.172-7.3984 12.816s-10.219 2.6445-14.801 0c-4.5781-2.6445-7.3984-7.5312-7.3984-12.816v-59.199c0-3.9258 1.5586-7.6875 4.3359-10.465 2.7734-2.7734 6.5391-4.332 10.465-4.332h118.39c3.9258 0 7.6875 1.5586 10.465 4.332 2.7734 2.7773 4.3359 6.5391 4.3359 10.465v59.199c0 3.9258-1.5625 7.6875-4.3359 10.465-2.7773 2.7734-6.5391 4.3359-10.465 4.3359z" />
              <path d="m376 524c-3.9219 0-7.6875-1.5586-10.465-4.3359-2.7734-2.7734-4.332-6.5391-4.332-10.465v-207.19c0-5.2852 2.8203-10.172 7.3984-12.816 4.5781-2.6445 10.219-2.6445 14.801 0 4.5781 2.6445 7.3984 7.5312 7.3984 12.816v207.19c0 3.9258-1.5586 7.6914-4.3359 10.465-2.7734 2.7773-6.5391 4.3359-10.465 4.3359z" />
              <path d="m450 494.4c-3.9258 0-7.6914-1.5625-10.465-4.3359-2.7773-2.7773-4.3359-6.5391-4.3359-10.465v-148c0-5.2852 2.8203-10.172 7.3984-12.816 4.5781-2.6406 10.223-2.6406 14.801 0 4.5781 2.6445 7.3984 7.5312 7.3984 12.816v148c0 3.9258-1.5586 7.6875-4.332 10.465-2.7773 2.7734-6.543 4.3359-10.465 4.3359z" />
              <path d="m302 494.4c-3.9258 0-7.6875-1.5625-10.465-4.3359-2.7734-2.7773-4.3359-6.5391-4.3359-10.465v-148c0-5.2852 2.8242-10.172 7.4023-12.816 4.5781-2.6406 10.219-2.6406 14.797 0 4.582 2.6445 7.4023 7.5312 7.4023 12.816v148c0 3.9258-1.5586 7.6875-4.3359 10.465-2.7734 2.7734-6.5391 4.3359-10.465 4.3359z" />
            </g>
          </svg>
        </button>
        <table>
          <thead>
            <tr>
              <th>
                <label style={{ marginRight: "15px", paddingRight: "5px" }}>
                  <input
                    onChange={onCheckAll}
                    checked={checkAll}
                    type="checkbox"
                  />
                  <span style={{ color: "transparent" }}>-</span>
                </label>
              </th>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>User Id</th>
              <th>Role</th>
            </tr>
            {users
              .filter((user) => user._id === local_id)
              .map((user) => (
                <tr key={user._id}>
                  <th>
                    <label>
                      <input
                        onChange={() => onCheckBox(user._id)}
                        checked={checkedUsers.includes(user._id)}
                        type="checkbox"
                      />
                      <span style={{ color: "transparent" }}>-</span>
                    </label>
                  </th>
                  <th>{user.userName}</th>
                  <th>{user.email}</th>
                  <th>{user.isBlocked ? "blocked" : "unblocked"}</th>
                  <th>{user._id}</th>
                  <th>{user.role}</th>
                </tr>
              ))}
          </thead>
          <tbody>
            {users
              .filter((user) => user._id !== local_id)
              .map((user) => (
                <tr key={user._id}>
                  <td>
                    <label>
                      <input
                        onChange={() => onCheckBox(user._id)}
                        checked={checkedUsers.includes(user._id)}
                        type="checkbox"
                      />
                      <span style={{ color: "transparent" }}>-</span>
                    </label>
                  </td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.isBlocked ? "blocked" : "unblocked"}</td>
                  <td>{user._id}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsersPage;
