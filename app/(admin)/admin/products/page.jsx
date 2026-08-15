"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { CaretLeft, CaretRight, Upload, DownloadSimple, CaretDown, Spinner } from "phosphor-react";
import AdminElseBlock from "@/components/admin/AdminElseBlock";
import useProducts from "./useProducts";
import ShimmerContainer from "@/components/admin/ShimmerContainer";
import TableEmptyRow from "@/components/admin/TableEmptyRow";
import TableLoadingRow from "@/components/admin/LoadingRow";
import SearchSection from "@/components/admin/SearchSections";
import Product from "./Product";
import axios from "axios";
import { toast } from "sonner";

const Products = () => {
  let { 
    refetch, products, controlPage, totalPages, currentPage,
    searchQuery, setSearchQuery, selectedProducts, setSelectedProducts, bulkDeleteProducts,
    categories 
  } = useProducts();

  const [exportOpen, setExportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [uploadImages, setUploadImages] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const importRef = useRef(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const confirmImport = confirm(`Are you sure you want to submit and import products from "${file.name}" into the database?`);
    if (!confirmImport) {
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_images", uploadImages);

    setImporting(true);
    const toastId = toast.loading("Importing products...");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/products/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(res.data.message || "Products imported!", { id: toastId });
      
      if (res.data.results) {
        setImportResults(res.data);
      }
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import products.", { id: toastId });
      if (err.response?.data?.results) {
        setImportResults(err.response.data);
      }
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <main className="w-full max-w-full min-h-[88svh] flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex-1 max-w-md flex items-center gap-2">
          <SearchSection 
            placeholder={"Search for Products"} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 text-[1.25rem] bg-black text-white rounded-xl px-6 py-2 hover:bg-neutral-800 transition-all font-medium h-[40px]"
          >
            Search
          </button>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap relative">
          {selectedProducts?.length > 0 && (
            <button
              type="button"
              onClick={bulkDeleteProducts}
              className="flex items-center gap-2 text-[1.25rem] bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-700 transition-all font-medium h-[40px] shadow-sm"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}

          {/* Import File Button & Checkbox */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[1.2rem] text-neutral-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={uploadImages}
                onChange={(e) => setUploadImages(e.target.checked)}
                className="w-4 h-4"
              />
              Upload external images to Cloudinary (Slower)
            </label>
            <button
              type="button"
              disabled={importing}
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-2 text-[1.25rem] bg-[#176eb1] text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-all font-medium shadow-sm h-[40px] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {importing ? (
                <Spinner size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              Import CSV / Excel
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleImport}
            />
          </div>

          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 text-[1.25rem] border border-neutral-300 rounded-xl px-4 py-2 hover:bg-neutral-50 transition-all font-medium text-neutral-700 h-[40px]"
            >
              <DownloadSimple size={16} />
              {selectedProducts?.length > 0 ? `Export Selected (${selectedProducts.length})` : "Export"}
              <CaretDown size={14} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-[260px] bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden py-2 max-h-[400px] overflow-y-auto">
                {selectedProducts?.length > 0 ? (
                  <button
                    onClick={() => {
                      window.open(`${BACKEND_URL}/api/products/export?ids=${selectedProducts.join(",")}`, "_blank");
                      setExportOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[1.2rem] text-neutral-700 hover:bg-neutral-50 font-medium border-b border-neutral-100"
                  >
                    Export Selected Products
                  </button>
                ) : (
                  <>
                    <div className="px-4 py-1 text-[1.1rem] text-neutral-400 font-semibold uppercase tracking-wider">Product Types</div>
                    <button
                      onClick={() => {
                        window.open(`${BACKEND_URL}/api/products/export`, "_blank");
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[1.2rem] text-neutral-700 hover:bg-neutral-50 font-medium"
                    >
                      All Products
                    </button>
                    <button
                      onClick={() => {
                        window.open(`${BACKEND_URL}/api/products/export?type=Simple`, "_blank");
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[1.2rem] text-neutral-700 hover:bg-neutral-50 font-medium"
                    >
                      Simple Products
                    </button>
                    <button
                      onClick={() => {
                        window.open(`${BACKEND_URL}/api/products/export?type=Variable`, "_blank");
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[1.2rem] text-neutral-700 hover:bg-neutral-50 font-medium border-b border-neutral-100"
                    >
                      Variable Products
                    </button>

                    {categories && categories.length > 0 && (
                      <>
                        <div className="px-4 py-1 mt-2 text-[1.1rem] text-neutral-400 font-semibold uppercase tracking-wider">By Category</div>
                        {categories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              window.open(`${BACKEND_URL}/api/products/export?category=${cat._id}`, "_blank");
                              setExportOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-[1.2rem] text-neutral-700 hover:bg-neutral-50 truncate"
                          >
                            {cat.title}
                          </button>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            className="a-text--button shrink-0 !text-[1.3rem] text-white bg-black hover:bg-neutral-800 !py-2 !px-6 transition !rounded-[.4rem] h-[40px] flex items-center justify-center font-medium shadow-sm"
            href="/admin/products/product-management"
          >
            Add new product
          </Link>
        </div>
      </div>
      <div className="a-section--box !p-0 text-[1.4rem] rounded-[.5rem] shadow-sm border border-neutral-200 overflow-hidden bg-white">
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-[1.2rem] font-semibold">
          <div className="p-4 flex items-center justify-center">
            <input 
              type="checkbox" 
              className="w-5 h-5 cursor-pointer"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts(products?.map(p => p._id) || []);
                } else {
                  setSelectedProducts([]);
                }
              }}
              checked={products?.length > 0 && selectedProducts?.length === products?.length}
            />
          </div>
          {["Title", "Category", "Brand", "Created At", "Options"].map(
            (item, i) => (
              <div key={i} className="p-4 tracking-wider uppercase text-left last:text-right">
                {item}
              </div>
            ),
          )}
        </div>
        {products === null && <TableLoadingRow />}
        {products && products.length === 0 && (
          <TableEmptyRow message={"No Result Found"} />
        )}
        {products &&
          products.length >= 0 &&
          products.map((product, i) => (
            <Product 
              product={product} 
              key={i} 
              refetch={refetch} 
              selected={selectedProducts?.includes(product._id)}
              onSelect={(checked) => {
                if (checked) {
                  setSelectedProducts([...selectedProducts, product._id]);
                } else {
                  setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                }
              }}
            />
          ))}
      </div>
      <div className="flex justify-end items-center gap-4 mt-auto">
        <button
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
            currentPage === 1 ? "text-neutral-300 cursor-not-allowed" : "hover:bg-neutral-100 text-neutral-600 cursor-pointer"
          }`}
          onClick={() => controlPage("down")}
          disabled={currentPage === 1}
        >
          <CaretLeft className="w-[1.5rem] h-[1.5rem]" weight="bold" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => controlPage(page)}
              className={`w-10 h-10 flex items-center justify-center text-[1.4rem] rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-black text-white font-medium"
                  : "text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
            currentPage === totalPages ? "text-neutral-300 cursor-not-allowed" : "hover:bg-neutral-100 text-neutral-600 cursor-pointer"
          }`}
          onClick={() => controlPage("up")}
          disabled={currentPage === totalPages}
        >
          <CaretRight className="w-[1.5rem] h-[1.5rem]" weight="bold" />
        </button>
      </div>
      
      {/* Import Results Modal */}
      {importResults && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[1.8rem] font-bold text-neutral-800">Import Results</h2>
              <button 
                onClick={() => setImportResults(null)}
                className="text-[1.4rem] font-semibold text-neutral-500 hover:text-black"
              >
                Close
              </button>
            </div>
            <div className="p-6 bg-neutral-50 border-b border-neutral-100">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[1.2rem] text-neutral-500 uppercase font-semibold">Total Processed</span>
                  <span className="text-[1.8rem] font-bold text-neutral-800">{importResults.results?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[1.2rem] text-neutral-500 uppercase font-semibold">Successful</span>
                  <span className="text-[1.8rem] font-bold text-green-600">{importResults.successCount || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[1.2rem] text-neutral-500 uppercase font-semibold">Errors</span>
                  <span className="text-[1.8rem] font-bold text-red-600">{importResults.errorCount || 0}</span>
                </div>
              </div>
            </div>
            <div className="p-0 overflow-auto flex-1">
              <table className="w-full text-left text-[1.3rem] text-neutral-600">
                <thead className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-semibold w-[80px]">Row</th>
                    <th className="p-4 font-semibold w-[100px]">Status</th>
                    <th className="p-4 font-semibold w-[200px]">SKU / Name</th>
                    <th className="p-4 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.results?.map((res, idx) => (
                    <tr key={idx} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                      <td className="p-4">{res.row}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[1.1rem] font-semibold ${res.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-neutral-800 truncate">{res.sku}</td>
                      <td className={`p-4 ${res.status === 'error' ? 'text-red-600' : 'text-neutral-500'}`}>{res.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Products;
