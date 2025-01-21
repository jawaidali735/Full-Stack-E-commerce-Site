import React from 'react'
import { CiSearch } from "react-icons/ci";
const SearchButton = () => {
  return (
    <div>
      <form action="/search" >
  <div className="relative hidden sm:block sm:ml-4 max-w-[500px] sm:max-w-[400px] lg:max-w-[500px]">
    <input
      type="text"
      name="query" // This will be the query parameter sent in the URL
      placeholder="Search products..."
     
      
      className="border-2 focus:ring-1 focus:ring-[#E7E6EF] focus:outline-none border-#E7E6EF p-[3px] md:p-[7px] md:text-[12px] lg:text-[14px] sm:text-[16px] lg:w-[317px] sm:w-[150px] md:w-[200px] pr-[50px]"
    />
    <button
      type="submit"
      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white flex items-center justify-center text-xl bg-[#FB2E86] lg:w-[51px] sm:w-[51px] md:w-[30px] font-semibold h-9"
    >
      <CiSearch />
    </button>
  </div>
</form>
    </div>
  )
}

export default SearchButton



// // components/SearchResults.tsx
// "use client"
// import React, { useState, useEffect } from "react";
// import { client } from "@/sanity/lib/client"; // Import your Sanity client
// import Link from "next/link";
// import Image from "next/image";
// // TypeScript interface for product structure
// interface Product {
//   name: string;
//   slug: {
//     current: string;
//   };
//   image?: string;
// }

// // Fetch products from Sanity based on the search query
// const fetchProducts = async (query: string): Promise<Product[]> => {
//   const queryString = `*[_type == "product" && name match "${query}*"]{
//     name,
//     slug,
//     image
//   }`;
//   const products = await client.fetch(queryString);
//   return products;
// };

// const SearchResults = () => {
//   const [searchQuery, setSearchQuery] = useState<string>("");  // Store the search query
//   const [searchResults, setSearchResults] = useState<Product[]>([]);  // Store search results
//   const [loading, setLoading] = useState<boolean>(false);  // Loading state

//   useEffect(() => {
//     const getSearchResults = async () => {
//       if (searchQuery.trim()) {
//         setLoading(true);  // Set loading to true
//         const results = await fetchProducts(searchQuery);  // Fetch products based on query
//         setSearchResults(results);  // Update the search results
//         setLoading(false);  // Set loading to false once results are fetched
//       } else {
//         setSearchResults([]);
//       }
//     };

//     getSearchResults();  // Fetch results on query change
//   }, [searchQuery]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);  // Update query as the user types
//   };

//   return (
//     <div className="max-w-screen-xl mx-auto p-4">
//       {/* Input field for the search query */}
//       <div className="mb-8">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           className="border-2 focus:ring-1 focus:ring-[#E7E6EF] focus:outline-none border-#E7E6EF p-[10px] text-lg w-full max-w-[400px] mx-auto"
//         />
//       </div>

//       {/* Loading indicator */}
//       {loading && <div className="text-center text-xl">Loading...</div>}

//       {/* Message if no results found */}
//       {!loading && searchResults.length === 0 && searchQuery.trim() && (
//         <div className="text-center text-xl text-red-500">Products not found</div>
//       )}

//       {/* Display search results */}
//       {!loading && searchResults.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {searchResults.map((product) => (
//             <div
//               key={product.slug.current}
//               className="bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300"
//             >
//               <Link href={`/product/${product.slug.current}`}>
                
//                   {/* Product image and name */}
//                   <Image
//                     src={product.image || "/placeholder.jpg"}
//                     alt={product.name}
//                     className="w-full h-64 object-cover rounded-t-md"
//                   />
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-center">{product.name}</h3>
//                   </div>
              
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;
