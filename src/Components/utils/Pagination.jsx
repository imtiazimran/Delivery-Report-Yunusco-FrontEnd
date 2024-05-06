const Pagination = ({ totalItems, currentPage, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageRange = 5; // Adjust this value to control the number of visible page links.
  
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };
  
    const renderPageLinks = () => {
      const links = [];
      let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
      let endPage = Math.min(startPage + pageRange - 1, totalPages);
  
      // Adjust startPage if it is less than 1
      if (endPage === totalPages && startPage > 1 && endPage - startPage < pageRange - 1) {
        startPage = Math.max(1, endPage - pageRange + 1);
      }
  
      // Ensure endPage is within valid range
      endPage = Math.min(startPage + pageRange - 1, totalPages);
  
      // Add "Previous" control
      // if (currentPage > 1) {
      //   links.push(
      //     <li key="prev" className={`pagination-item ml-1 border border-[#C2C2C2] flex px-2 rounded-2xl`}>
      //       <button onClick={() => handlePageChange(currentPage - 1)}>
      //         &laquo; Prev
      //       </button>
      //     </li>
      //   );
      // }
  
      for (let page = startPage; page <= endPage; page++) {
        links.push(
          <li key={page} className={`pagination-item `}>
            <button
              className={`w-12 ${currentPage === page ? 'bg-[#E8750B] hover:bg-[#ee6b00] rounded-2xl text-white' : 'hover:bg-slate-200'}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        );
      }
  
      // Add ellipses if there are more pages
      if (endPage < totalPages) {
        links.push(
          <li key="ellipsis" className={`pagination-item`}>
            <span>...</span>
          </li>
        );
      }
  
      // Add "Next" control
      // if (currentPage < totalPages) {
      //   links.push(
      //     <li key="next" className={`pagination-item mr-1 border border-[#C2C2C2] flex px-2 rounded-2xl`}>
      //       <button onClick={() => handlePageChange(currentPage + 1)}>
      //         Next &raquo;
      //       </button>
      //     </li>
      //   );
      // }
  
      return links;
    };
  
    return (
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-12 ">
        <div>
          Showing <span className='font-bold'>{currentPage}-{totalPages}</span> from <span className='font-bold'>{totalItems}</span> data
        </div>
        <nav aria-label="Pagination">
          <ul className="pagination flex items-center text-lg  gap-3 my-5">
            <li className={`pagination-item ml-1 border border-[#C2C2C2] flex px-2 rounded-2xl ${currentPage === 1 ? 'disabled' : ''}`}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 18L6 12L12 6" stroke="#E8750B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M19 18L13 12L19 6" stroke="#62B179" stroke-opacity="0.25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </li>
            <div className='border border-[#C2C2C2] flex px-2 rounded-2xl'>
              {renderPageLinks()}
            </div>
            <li className={`pagination-item mr-1 border border-[#C2C2C2] flex px-2 rounded-2xl ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className={`${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 18L18 12L12 6" stroke="#E8750B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5 18L11 12L5 6" stroke="#62B179" stroke-opacity="0.25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default Pagination;