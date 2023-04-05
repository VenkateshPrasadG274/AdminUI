import { useState, useEffect } from "react";
import axios from "axios";
import "./MyList.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";


export default function MyList() {
  // states

  const [users, setUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const [deletedUserIds, setDeletedUserIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const perPage = 10;

  // Api call function implemented here

  const performAPICall = async () => {
    let url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    let response = await axios.get(url);
    setUsers(response.data);
  };

  // filtering users on search and delete

  const filteredUsers = searchedUser
    ? users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(searchedUser.toLowerCase()) ||
            user.email.toLowerCase().includes(searchedUser.toLowerCase()) ||
            user.role.toLowerCase().includes(searchedUser.toLowerCase())
        )
        .filter((user) => !deletedUserIds.includes(user.id))
    : users.filter((user) => !deletedUserIds.includes(user.id));

  useEffect(() => {
    performAPICall();
  }, [deletedUserIds]);

  // handling Delete

  const handleDelete = (id) => {
    setDeletedUserIds([...deletedUserIds, id]);
  };

  const handleDeleteAll = () => {
    const remainingUsers = filteredUsers.filter(
      (user) => !selectedUserIds.includes(user.id)
    );
    setUsers(remainingUsers);
    setSelectedUserIds([]);
  };

  const handleCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    setSelectedUserIds((prevSelectedUserIds) =>
      isChecked
        ? [...prevSelectedUserIds, userId]
        : prevSelectedUserIds.filter((id) => id !== userId)
    );
  };

  // handling Edit

  const handleEdit = (id, name, email, role) => {
    setIsEditing(true);
    setEditId(id);
    setEditName(name);
    setEditEmail(email);
    setEditRole(role);
  };

  const handleCancel = (id) => {
    setIsEditing(false);
    setEditId(id);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  const handleMasterCheckboxChange = (event) => {
    const newSelectedUserIds = event.target.checked
      ? currentUsers.map((user) => user.id)
      : [];
    setSelectedUserIds(newSelectedUserIds);
  };

  // pagination

  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / perPage));
  }, [filteredUsers, perPage]);

  return (
    <div className="container">
      <input
        type="search"
        placeholder="Search Users"
        onChange={(e) => setSearchedUser(e.target.value)}
      />

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
            <td>
              {isEditing && user.id === editId ? (
                <input
                  type="text"
                  value={editRole}
                  onChange={(event) => setEditRole(event.target.value)}
                />
              ) : (
                user.role
              )}
            </td>
            <td>
              {isEditing && user.id === editId ? (
                <GiCancel onClick={() => handleCancel(user.id)} />
              ) : (
                <AiOutlineEdit
                  onClick={() =>
                    handleEdit(user.id, user.name, user.email, user.role)
                  }
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

      <div className="footer">
        <div className="btn">
          {" "}
          <button onClick={handleDeleteAll}>Delete Selected</button>
        </div>
        <div>
          <ul className="pagination">
            {pageNumbers.map((pageNumber) => (
              <li key={pageNumber}>
                <button onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


