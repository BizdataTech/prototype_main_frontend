import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "phosphor-react";
import { InputLabel } from "@/components/admin/InputLabel";

const ProductListingSection = ({ editId = null }) => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    limit: 8,
    layout: "horizontal",
    reference: { type: "content-block", id: "" }
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!editId) return;
    const fetchExisting = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/home-sections/${editId}`, { withCredentials: true });
        const sec = res.data?.section;
        if (sec) {
          const refType = sec.reference?.type || "content-block";
          const refId = typeof sec.reference?.id === "object" ? sec.reference?.id?._id : sec.reference?.id || "";
          const refSlug = sec.reference?.slug || "";
          setFormData({
            title: sec.title || "",
            limit: sec.limit || 8,
            layout: sec.layout || "horizontal",
            reference: { type: refType, slug: refSlug, id: refId },
          });
        }
      } catch (err) {
        toast.error("Failed to load section data");
      }
    };
    fetchExisting();
  }, [editId, BACKEND_URL]);

  useEffect(() => {
    const getReferences = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/home-sections/references/${formData.reference.type}`,
          { withCredentials: true }
        );
        setReferences(res.data?.references || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    getReferences();
  }, [formData.reference.type, BACKEND_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefChange = (e) => {
    const { value } = e.target;
    const selectedRef = references.find(r => r._id === value);
    if(selectedRef) {
      setFormData(prev => ({
        ...prev,
        reference: { type: prev.reference.type, slug: selectedRef.title.toLowerCase().replace(/\s+/g, "_"), id: value }
      }));
    }
  };

  const submitSection = async () => {
    if (!formData.title || !formData.reference.id) {
      toast.error("Title and Reference are required");
      return;
    }
    try {
      setLoading(true);
      if (editId) {
        await axios.put(
          `${BACKEND_URL}/api/home-sections/${editId}`,
          {
            title: formData.title,
            limit: formData.limit,
            layout: formData.layout,
            reference: JSON.stringify(formData.reference),
          },
          { withCredentials: true }
        );
        toast.success("Product Listing Section Updated");
      } else {
        await axios.post(
          `${BACKEND_URL}/api/home-sections`,
          {
            section_type: "product_listing",
            title: formData.title,
            limit: formData.limit,
            layout: formData.layout,
            reference: JSON.stringify(formData.reference),
          },
          { withCredentials: true }
        );
        toast.success("Product Listing Section Created");
      }
      router.replace("/admin/home-layout");
    } catch (err) {
      console.log(err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 text-[1.4rem]">
      <div className="flex flex-col gap-1">
        <InputLabel label="Section Title" />
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="border border-neutral-300 p-2 rounded-[.5rem]" placeholder="E.g. Trending Products" />
      </div>
      <div className="flex flex-col gap-1">
        <InputLabel label="Product Limit" />
        <input type="number" name="limit" value={formData.limit} onChange={handleChange} className="border border-neutral-300 p-2 rounded-[.5rem]" />
      </div>
      <div className="flex flex-col gap-1">
        <InputLabel label="Layout" />
        <select name="layout" value={formData.layout} onChange={handleChange} className="border border-neutral-300 p-2 rounded-[.5rem]">
          <option value="horizontal">Horizontal</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <InputLabel label="Reference Type" />
        <select 
          className="border border-neutral-300 p-2 rounded-[.5rem]"
          value={formData.reference.type}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, reference: { type: e.target.value, id: "" } }));
            setReferences([]);
          }}
        >
          <option value="content-block">Content Block</option>
          <option value="category">Category</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <InputLabel label={`${formData.reference.type === 'category' ? 'Category' : 'Content Block'} Reference`} />
        {references.length === 0 ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-[.5rem] text-[1.3rem]">
            No {formData.reference.type === 'category' ? 'categories' : 'content blocks'} found. Please create one first.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {references.map((ref) => (
              <div key={ref._id} className="flex items-center gap-2 bg-neutral-200 p-2 rounded-[.5rem]">
                <input type="radio" id={ref._id} name="reference" value={ref._id} checked={formData.reference.id === ref._id} onChange={handleRefChange} />
                <label htmlFor={ref._id} className="cursor-pointer">{ref.title}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="a-text--button bg-black text-white !py-4 mt-4 self-end" onClick={submitSection} disabled={loading}>
        {loading ? <Spinner className="animate-spin w-6 h-6" /> : editId ? "Update Section" : "Submit Section"}
      </button>
    </section>
  );
};

export default ProductListingSection;
