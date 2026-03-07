import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const useSearch = () => {
  let [query, setQuery] = useState("");
  let [loading, setLoading] = useState(false);
  let [open, setOpen] = useState(false);
  let [suggessions, setSuggessions] = useState([]);
  let debounce = useRef(null);
  let router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!query || query.trim().length < 2) {
      setLoading(false);
      setOpen(false);
      setSuggessions(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      let newQuery = query.trim();
      setLoading(true);
      setSuggessions([]);
      setOpen(true);
      try {
        let url = `${BACKEND_URL}/api/search/suggestions?query=${encodeURIComponent(
          newQuery
        )}&limit=7`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response not Ok!");
        const data = await response.json();
        const items = data.result || [];
        setLoading(false);
        console.log("items:", items);

        // cacheRef.current.set(newQuery, items);
        setSuggessions(items);
      } catch (error) {
        console.error(error.message);
      }
    }, 300);
  }, [query]);

  const containerRef = useRef(null);
  useEffect(() => {
    const hideBlock = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", hideBlock);
    return () => document.removeEventListener("mousedown", hideBlock);
  }, []);

  const submitQuery = (e) => {
    e.preventDefault();
    console.log(e);
    setOpen(false);
    setSuggessions([]);
    setLoading(false);
    router.push(`/search?query=${query.trim()}`);
  };

  return {
    containerRef,
    query,
    setQuery,
    loading,
    setOpen,
    open,
    suggessions,
    submitQuery,
  };
};
