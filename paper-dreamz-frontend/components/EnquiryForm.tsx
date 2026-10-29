"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, MessageCircle, X } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useCatalog, whatsappUrl } from "@/lib/catalog";
import { PAGES_CONTENT } from "@/lib/content/pages";
import { usePageContent } from "@/lib/usePageContent";

const MAX_IMAGES = 3;

const fieldClass =
  "w-full rounded-sm border border-gold/30 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-taupe/60 outline-none transition-colors focus:border-gold focus:bg-white";
const labelClass = "block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-deep mb-2";

/**
 * Enquiry form that opens WhatsApp with the details pre-filled (orders are taken over WhatsApp),
 * and also saves a copy to the admin's Enquiries inbox.
 * `variant="custom"` adds the occasion, quantity, date and reference-image fields used on /custom-orders.
 * wa.me links can't carry files, so reference images go through the share sheet where the
 * browser supports sharing files (mostly phones); elsewhere the customer attaches them in the chat.
 */
export default function EnquiryForm({ variant = "contact" }: { variant?: "contact" | "custom" }) {
  const categories = useCatalog();
  const { occasions } = usePageContent("custom-orders.form", PAGES_CONTENT["custom-orders.form"]);
  const [form, setForm] = useState({ name: "", phone: "", city: "", product: "", occasion: "", occasionOther: "", quantity: "", date: "", message: "" });
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [attachHint, setAttachHint] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    setImages((cur) => [...cur, ...picked.slice(0, MAX_IMAGES - cur.length).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
    e.target.value = "";
  };

  const removeImage = (url: string) => {
    URL.revokeObjectURL(url);
    setImages((cur) => cur.filter((i) => i.url !== url));
  };

  const occasion = form.occasion === "Other" ? form.occasionOther.trim() || "Other" : form.occasion;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      variant === "custom" ? "Hi Paper Dreamz, I'd like to place a custom order." : "Hi Paper Dreamz, I have an enquiry.",
      "",
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.city && `City: ${form.city}`,
      form.product && `Product: ${form.product}`,
      occasion && `Occasion: ${occasion}`,
      form.quantity && `Quantity: ${form.quantity}`,
      form.date && `Needed by: ${form.date}`,
      form.message && `\n${form.message}`,
      images.length > 0 && `\nI have ${images.length} reference image${images.length > 1 ? "s" : ""} to share.`,
    ].filter(Boolean);
    const text = lines.join("\n");

    // Not awaited: WhatsApp must open within the click, or browsers treat it as a pop-up.
    void apiPost("/enquiries", {
      type: variant,
      name: form.name,
      phone: form.phone || null,
      city: form.city || null,
      product: form.product || null,
      occasion: occasion || null,
      quantity: form.quantity || null,
      needed_by: form.date || null,
      message: form.message || null,
      reference_images: images.length,
    });

    const files = images.map((i) => i.file);
    if (files.length > 0 && navigator.canShare?.({ files })) {
      try {
        await navigator.share({ files, text });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    setAttachHint(files.length > 0);
    window.open(whatsappUrl(text), "_blank", "noopener");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="enq-name" className={labelClass}>Your name *</label>
        <input id="enq-name" required value={form.name} onChange={set("name")} className={fieldClass} placeholder="Full name" />
      </div>
      <div>
        <label htmlFor="enq-phone" className={labelClass}>Phone</label>
        <input id="enq-phone" type="tel" value={form.phone} onChange={set("phone")} className={fieldClass} placeholder="+91" />
      </div>
      <div>
        <label htmlFor="enq-city" className={labelClass}>City</label>
        <input id="enq-city" value={form.city} onChange={set("city")} className={fieldClass} placeholder="Where should we deliver?" />
      </div>
      <div>
        <label htmlFor="enq-product" className={labelClass}>Interested in</label>
        <select id="enq-product" value={form.product} onChange={set("product")} className={fieldClass}>
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <optgroup key={c.slug} label={c.name}>
              {(c.children.length > 0 ? c.children : [c]).map((item) => (
                <option key={item.slug} value={item.name}>{item.name}</option>
              ))}
            </optgroup>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </div>

      {variant === "custom" && (
        <>
          <div>
            <label htmlFor="enq-occasion" className={labelClass}>Occasion</label>
            <select id="enq-occasion" value={form.occasion} onChange={set("occasion")} className={fieldClass}>
              <option value="">Choose an occasion</option>
              {occasions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {form.occasion === "Other" && (
              <input
                aria-label="Please specify the occasion"
                value={form.occasionOther}
                onChange={set("occasionOther")}
                className={`${fieldClass} mt-3`}
                placeholder="Please specify the occasion"
                autoFocus
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-5 self-start">
            <div>
              <label htmlFor="enq-qty" className={labelClass}>Quantity</label>
              <input id="enq-qty" inputMode="numeric" value={form.quantity} onChange={set("quantity")} className={fieldClass} placeholder="e.g. 50" />
            </div>
            <div>
              <label htmlFor="enq-date" className={labelClass}>Needed by</label>
              <input id="enq-date" type="date" value={form.date} onChange={set("date")} className={fieldClass} />
            </div>
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label htmlFor="enq-message" className={labelClass}>{variant === "custom" ? "Tell us your idea" : "Message *"}</label>
        <textarea
          id="enq-message"
          rows={5}
          required={variant === "contact"}
          value={form.message}
          onChange={set("message")}
          className={fieldClass}
          placeholder={variant === "custom" ? "Colours, theme, names or initials, motifs, reference images you'll share…" : "How can we help?"}
        />
      </div>

      {variant === "custom" && (
        <div className="sm:col-span-2">
          <p className={labelClass}>
            Reference images <span className="font-normal normal-case tracking-normal text-taupe">(optional, up to {MAX_IMAGES})</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.url} className="relative h-24 w-24 overflow-hidden rounded-sm border border-gold/30 shadow-sm">
                <Image src={img.url} alt={img.file.name} fill unoptimized sizes="96px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  aria-label={`Remove ${img.file.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-cream/95 text-ink shadow hover:text-gold-deep"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={`flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-gold/50 bg-white/50 px-5 text-left transition-colors hover:border-gold hover:bg-white ${
                  images.length > 0 ? "h-24 w-24 justify-center px-0" : "h-24 w-full sm:w-auto"
                }`}
              >
                <ImagePlus size={22} strokeWidth={1.5} className="shrink-0 text-gold-deep" />
                {images.length === 0 && (
                  <span className="text-sm text-taupe">
                    <span className="block text-ink">Upload a reference photo</span>
                    A sketch, a screenshot or an outfit — anything that inspires you.
                  </span>
                )}
              </button>
            )}
            <input ref={fileInput} type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
          </div>
          {attachHint && (
            <p className="mt-3 text-xs text-gold-deep">
              WhatsApp links can&rsquo;t carry photos from this browser — please attach your reference images in the chat that just opened.
            </p>
          )}
        </div>
      )}

      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-taupe">Sends your details to us on WhatsApp — we usually reply within working hours.</p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors cursor-pointer"
        >
          <MessageCircle size={15} /> Send on WhatsApp
        </button>
      </div>
    </form>
  );
}
