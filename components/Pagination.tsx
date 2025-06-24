import React from "react";

const PaginationPage = ({ page, pageSize, totalItems, onPageChange }: any) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  console.log(totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="mt-10 flex justify-center items-center">
      <button
        className="mr-2 px-2 py-1 border border-gray-300 rounded cursor-pointer"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      <button
        className="ml-2 px-2 py-1 border border-gray-300 rounded cursor-pointer"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationPage;
