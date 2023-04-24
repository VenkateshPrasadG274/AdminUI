import "./App.css";
import { useState } from "react";
import MyList from "./Components/MyList";
import { MyContext } from "./Components/MyList";
import SearchBar from "./Components/SearchBar";
import Pagination from "./Components/Pagination";




function App() {
  const [users, setUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const currentUsers = [];
  const perPage = 10;

  return (
    <MyContext.Provider
      value={{
        users,
        setUsers,
        searchedUser,
        setSearchedUser,
        filteredUsers,
        setFilteredUsers,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        perPage,
        currentUsers,
      }}
    >
      <div className="App">

        <h2 style={{textalign:"center"}}> AdminUI Dashboard</h2>
          <SearchBar />
          <MyList/>
          <Pagination />
      </div>
    </MyContext.Provider>
  );
}

export default App;
