 import React from "react";

 function CategoryCard({ category }) {
   return (
     <article className="md-card">
       <div className="md-card-header">
         <div className="md-card-title-group">
           <div className="md-card-icon" aria-hidden="true">
             {category.icon}
           </div>
           <div className="md-card-title">{category.name}</div>
           <div className="md-card-subtitle">{category.description}</div>
         </div>
         {category.badge && <div className="md-card-badge">{category.badge}</div>}
       </div>
       <div className="md-card-footer">
         <div className="md-pill-row">
           {category.tags.map((tag) => (
             <span key={tag} className="md-pill">
               {tag}
             </span>
           ))}
         </div>
         <div className="md-card-link">
           <span>Ver opções</span>
           <span className="md-card-link-icon">›</span>
         </div>
       </div>
     </article>
   );
 }

 export default CategoryCard;
