export const Details = ({ config }) => {
  let { product, addProducttoCart } = config;
  let { sections } = product.parent;

  return (
    <div className="md:w-3/6 space-y-6">
      <section className="bg-white p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-[2.2rem] font-medium leading-[3rem]">
            {product?.parent?.product_title}
          </h1>
          <h2 className="text-[1.6rem]">{product?.parent?.brand}</h2>
        </div>

        <div className="flex gap-6">
          <p className="text-[3rem] font-medium">₹{product.price}</p>
        </div>

        <div className="space-y-[.5rem] mt-8 text-[1.6rem]">
          <div className="font-medium">Product Description</div>
          <p className="line-clamp-4">{product?.parent?.description}</p>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-6 bg-white p-4">
        <button className="button border border-neutral-900 text-neutral-900 bg-white cursor-pointer">
          Add to Whishlist
        </button>
        <button
          className={`button bg-black text-white text-center ${
            product?.stock <= 0
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }  `}
          onClick={() => addProducttoCart(product?._id)}
          disabled={product?.stock <= 0}
        >
          Add to Cart
        </button>
      </div>
      {sections && (
        <section className="bg-white p-6">
          {sections.map((section, index) => (
            <div
              className="text-[1.6rem] border-b border-neutral-300 last:border-b-0 space-y-4"
              key={index}
            >
              <div className="font-medium">{section.title}</div>
              <div>
                {section.details.map((detail, index) => (
                  <div className="flex justify-between gap-8" key={index}>
                    <div>{detail.label}</div>
                    <div>{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
