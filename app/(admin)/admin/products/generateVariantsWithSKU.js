// --- UTILITIES -------------------------------------------------------------

/** Normalize text → CODE (A–Z0–9 only) */
function toCode(text, len = 3) {
  const base = String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (!base) return "X".repeat(len);
  return base.slice(0, len).padEnd(len, "X");
}

/** Derive a category?.title code from a title (e.g., "T-Shirt" -> "TSH") */
function deriveCategoryCode(title, len = 3) {
  const parts = String(title).split(/\s|-/).filter(Boolean);
  if (parts.length >= 2) {
    const firstLetters = parts.map((w) => w[0]).join("");
    return toCode(firstLetters, len);
  }
  return toCode(title, len);
}

async function deriveProductCode(id) {
  try {
    let response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_1}/api/categories/product-code/${id}`,
      {
        method: "GET",
      }
    );
    let data = await response.json();
    if (!response.ok) throw new Error(data.message);
    else {
      console.log("category product count:", data.categoryProductCount);
      return String(data.categoryProductCount + 1).padStart(4, "0");
    }
  } catch (error) {
    console.log(error.message);
  }
}

/** Ensure value-codes are unique within a variant label (append 2,3,4… if needed) */
function buildValueCodes(values, len = 3) {
  const used = new Set();
  const map = new Map();
  for (const val of values) {
    const base = toCode(val, len);
    let code = base;
    let i = 2;
    while (used.has(code)) {
      code = (base + i).slice(0, Math.max(len, String(base + i).length));
      i++;
    }
    used.add(code);
    map.set(val, code);
  }
  return map; // Map<value, code>
}

/** Cartesian product of arrays */
function cartesian(arrays) {
  return arrays.reduce(
    (acc, cur) => acc.flatMap((a) => cur.map((b) => [...a, b])),
    [[]]
  );
}

// --- CORE GENERATOR --------------------------------------------------------

/**
 * Generate variant combinations + SKUs.
 * @param {Object} opts
 * @param {string} opts.category?.title
 * @param {Array<{label:string, values:string[]}>} opts.variants
 * @param {number} [opts.seqStart=1]  Starting sequence number for SKUs
 * @param {Set<string>} [opts.existingSkus]  To avoid collisions (optional)
 */

export async function generateVariantsWithSKU({
  category,
  category_variants,
  seqStart = 1,
  existingSkus = new Set(),
}) {
  // 1) Derive codes
  console.log("category:", category);
  const categoryCode = deriveCategoryCode(category?.title, 3);
  const productCode = await deriveProductCode(category?._id);

  // For each variant label, make a value→code map
  const codedVariants = category_variants.map((v) => ({
    label: v.label,
    values: v.values.map((val) => ({
      value: val,
      code: buildValueCodes(v.values, 3).get(val),
    })),
  }));

  // 2) Build all combinations (array of arrays of {value, code} per label)
  const combos = cartesian(codedVariants.map((v) => v.values));

  // 3) Emit rows with SKU
  const product_variants = [];
  let seq = seqStart;

  for (const combo of combos) {
    const variantCodePart = combo.map((x) => x.code).join("-");
    let sku = `${categoryCode}-${productCode}-${variantCodePart}-${String(
      seq
    ).padStart(3, "0")}`;

    // Avoid collisions with existing SKUs if provided
    if (existingSkus.has(sku)) {
      let bump = 1;
      while (existingSkus.has(`${sku}-${bump}`)) bump++;
      sku = `${sku}-${bump}`;
    }
    existingSkus.add(sku);

    product_variants.push({
      sku,
      attributes: combo.map((x, i) => ({
        label: category_variants[i].label,
        value: x.value,
        code: x.code,
      })),
      price: 0, // default, editable in UI
      stock: 0, // default, editable in UI
      images: [],
    });
    seq++;
  }

  return product_variants;
}
