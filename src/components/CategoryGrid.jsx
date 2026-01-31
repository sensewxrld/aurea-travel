 import React from "react";
 import CategoryCard from "./CategoryCard.jsx";

 function CategoryGrid({ categories }) {
   return (
     <div className="md-category-grid">
       {categories.map((category) => (
         <CategoryCard key={category.id} category={category} />
       ))}
     </div>
   );
 }

 export default CategoryGrid;
