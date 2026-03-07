import ProductCard from "./ProductCard";

const ProductlistBody = ({ query, products, categoryObject }) => {
  return (
    <div className="w-[80%]">
      {products.length > 0 && (
        <h1
          className={`text-[2rem] font-medium p-8 bg-white capitalize rounded-[.4rem]`}
          style={{ color: "black" }}
        >
          {categoryObject?.title || `Search Results for : ${query}`}
        </h1>
      )}

      {products.length ? (
        <div className="grid grid-cols-4 gap-4 my-8">
          {products.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      ) : (
        <div className="my-8 capitalize font-medium text-neutral-600 bg-white p-8">
          <h3 className="text-[2rem]">no products found</h3>
          <p className="text-[1.5rem]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            iure nulla voluptatibus dolore provident, veritatis quasi modi.
            Fugit, accusantium blanditiis eum, aut esse quam aliquam at impedit
            reprehenderit ullam consequatur?
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductlistBody;
