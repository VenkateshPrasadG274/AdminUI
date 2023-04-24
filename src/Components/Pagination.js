import React from "react";
import { useContext ,useEffect} from "react";
import { MyContext } from "./MyList";


export default function Pagination(){

    const {filteredUsers,currentPage,perPage,setCurrentPage,totalPages,setTotalPages} =useContext(MyContext);

  
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


    return(
        <div>
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
    )
}