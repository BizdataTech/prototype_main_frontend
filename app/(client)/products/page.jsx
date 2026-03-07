"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Products = () => {
  const [products, setProducts] = useState([]);
  const params = useSearchParams();

  let type = params.get("type") || null;
  let value = params.get("value") || null;

  useEffect(() => {
    const fetchProducts = async () => { 
        try{
            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filter=product-list`;    
        }catch(error){
            console.log("error:", error.message);
        }
    }
    fetchProducts();
  })

  return (
    <section className="w-[95%] mx-auto pt-[15rem] pb-4">
      <div>product listing page</div>
    </section>
  );
};

export default Products;
