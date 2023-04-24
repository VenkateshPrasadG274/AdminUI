import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./MyList.css";
import { AiOutlineDelete } from "react-icons/ai";
import {FaRegEdit,FaRegSave} from "react-icons/fa";

export const MyContext = React.createContext({});

export default function MyList() {
  // Global states

  const {
    users,
    setUsers,
    filteredUsers,
    setFilteredUsers,
    currentPage,
    perPage,
  } = useContext(MyContext);

  // Local states

  const [deletedUserIds, setDeletedUserIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Api call function implemented here

  const performAPICall = async () => {
    let url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    try {
      let response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);

  // handling Delete

  const handleDelete = (id) => {
    const data = users.filter((user) => user.id !== id);
    setUsers(data);

    const deletedusers = users.filter(
      (user) => !deletedUserIds.includes(user.id)
    );
    setFilteredUsers(deletedusers);
    setDeletedUserIds([...deletedUserIds, id]);
  };

  const handleDeleteAll = () => {
    const remainingUsers = users.filter(
      (user) => !selectedUserIds.includes(user.id)
    );
    setUsers(remainingUsers);
    setSelectedUserIds([]);
  };

  
  // handling checkbox

  const handleCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    setSelectedUserIds((prevSelectedUserIds) =>
      isChecked
        ? [...prevSelectedUserIds, userId]
        : prevSelectedUserIds.filter((id) => id !== userId)
    );
  };

  const handleMasterCheckboxChange = (event) => {
    const newSelectedUserIds = event.target.checked
      ? currentUsers.map((user) => user.id)
      : [];
    setSelectedUserIds(newSelectedUserIds);
  };

  // handling Edit

  const handleEdit = (id, name, email) => {
    setIsEditing(true);
    setEditId(id);
    setEditName(name);
    setEditEmail(email);
  };

  const handleSave = (id) => {
    setIsEditing(false);
    const updatedUser = users.find((user) => user.id === id);

    if (updatedUser) {
      updatedUser.name = editName;
      updatedUser.email = editEmail;

      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((user) => user.id === id);
      updatedUsers[index] = updatedUser;
      setUsers(updatedUsers);
      setEditId(null);
      setEditName("");
      setEditEmail("");
    }
  };

  // logic for displaying each page 10 users
  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container">
      <table className="table">
        <tr>
          <th>
            <input
              type="checkbox"
              checked={
                selectedUserIds.length === currentUsers.length &&
                currentUsers.length !== 0
              }
              onChange={handleMasterCheckboxChange}
            />
          </th>
          <th>Name </th>
          <th>Email </th>
          <th> Role</th>
          <th>Actions</th>
        </tr>
        {currentUsers.map((user) => (
          <tr key={user.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={(event) => handleCheckboxChange(event, user.id)}
              />
            </td>
            <td>
              {isEditing && user.id === editId ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />
              ) : (
                user.name
              )}
            </td>
            <td>
              {isEditing && user.id === editId ? (
                <input
                  type="text"
                  value={editEmail}
                  onchange={(event) => setEditEmail(event.target.value)}
                />
              ) : (
                user.email
              )}
            </td>
            <td>{user.role}</td>
            <td>
              {isEditing && user.id === editId ? (
                <FaRegSave onClick={() => handleSave(user.id)} />
              ) : (
                <FaRegEdit
                  onClick={() => handleEdit(user.id, user.name, user.email)}
                />
              )}
              <AiOutlineDelete
                style={{ color: "red" }}
                onClick={() => handleDelete(user.id)}
              />
            </td>
          </tr>
        ))}
      </table>

        <div className="btn">
          <button onClick={handleDeleteAll}>Delete Selected</button>
        </div>
    </div>
  );
}
