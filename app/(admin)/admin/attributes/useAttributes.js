import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const useAttributes = () => {
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Text");
  const [values, setValues] = useState([]); // Array of strings for Select type
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const attributeId = searchParams.get("id");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch all attributes
  const fetchAttributes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attributes`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setAttributes(res.data.attributes);
      }
    } catch (err) {
      console.error("Error fetching attributes:", err);
      toast.error("Failed to load attributes");
      setAttributes([]);
    }
  };

  // Fetch single attribute for edit mode
  useEffect(() => {
    if (action === "update" && attributeId) {
      fetchSingleAttribute();
    }
  }, [action, attributeId]);

  const fetchSingleAttribute = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attributes/${attributeId}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        const attr = res.data.attribute;
        setName(attr.name);
        setType(attr.type);
        setValues(attr.values || []);
        setDescription(attr.description || "");
        setStatus(attr.status || "Active");
      }
    } catch (err) {
      console.error("Error fetching attribute:", err);
      toast.error("Failed to load attribute data");
    }
  };

  // Create or Update Attribute
  const submitAttribute = async () => {
    if (!name.trim()) {
      return toast.warning("Attribute Name is required!");
    }
    if (type === "Select" && values.length === 0) {
      return toast.warning("Please add at least one value for Select type!");
    }

    try {
      setLoading(true);
      
      const payload = {
        name: name.trim(),
        type,
        values: type === "Select" ? values : [],
        description: description.trim(),
        status,
      };

      let res;
      if (action === "update" && attributeId) {
        res = await axios.put(`${BACKEND_URL}/api/attributes/${attributeId}`, payload, {
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${BACKEND_URL}/api/attributes`, payload, {
          withCredentials: true,
        });
      }
      
      toast.success(res.data?.message || "Operation successful");
      router.push("/admin/attributes");
    } catch (error) {
      console.error("Error submitting attribute:", error);
      toast.error(error.response?.data?.message || "Failed to save attribute");
    } finally {
      setLoading(false);
    }
  };

  // Delete Attribute
  const deleteAttribute = async (idToDelete) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${BACKEND_URL}/api/attributes/${idToDelete}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        // Remove from local state to refresh list without reloading page
        if (attributes) {
          setAttributes(attributes.filter(attr => attr._id !== idToDelete));
        }
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
      toast.error(error.response?.data?.message || "Failed to delete attribute");
    } finally {
      setLoading(false);
    }
  };

  return {
    attributes,
    fetchAttributes,
    loading,
    action,
    attributeId,
    // Form state and setters
    name, setName,
    type, setType,
    values, setValues,
    description, setDescription,
    status, setStatus,
    // Actions
    submitAttribute,
    deleteAttribute
  };
};

export default useAttributes;
