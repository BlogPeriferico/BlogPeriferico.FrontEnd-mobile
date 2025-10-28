export function logFormData(fd) {
  try {
    const parts = fd?._parts || [];
    const pretty = parts.map(([k, v]) => {
      if (typeof v === "string") {
        const safe = v.length > 120 ? v.slice(0, 120) + "…" : v;
        return `${k}: (string:${safe.length}) ${safe}`;
      } else if (v && typeof v === "object") {
        return `${k}: { uri: ${v.uri}, name: ${v.name}, type: ${v.type} }`;
      }
      return `${k}: (${typeof v})`;
    });
    console.log("🧾 FormData parts:\n - " + pretty.join("\n - "));
  } catch (e) {
    console.log("🧾 FormData (não foi possível debugar):", e?.message || e);
  }
}
