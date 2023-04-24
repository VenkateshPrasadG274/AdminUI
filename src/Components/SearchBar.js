import React, { useEffect } from "react";
import "./MyList.css"
import { useContext } from "react";
import { MyContext } from "./MyList";

export default function SearchBar() {
  const { users, filteredUsers, searchedUser,setSearchedUser,setFilteredUsers } =
    useContext(MyContext);

  const searchFunction = () => {
    const data = searchedUser
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchedUser.toLowerCase()) ||
            user.email.toLowerCase().includes(searchedUser.toLowerCase()) ||
            user.role.toLowerCase().includes(searchedUser.toLowerCase())
        )
      : users;

    setFilteredUsers(data);
  };

  useEffect(() => {
    searchFunction();
  }, [searchedUser,users]);

  return (
    <div>
      <div className="searchbar">
      <input
        type="search"
        placeholder="Search by name, email or role"
        onChange={(e) => setSearchedUser(e.target.value)}
      />
      </div>
    </div>
  );
}
