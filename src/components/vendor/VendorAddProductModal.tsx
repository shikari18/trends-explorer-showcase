import React, { useState } from "react";
import { X, Upload, Plus, Trash2, CheckCircle2, PackagePlus, Image as ImageIcon } from "lucide-react";
import { addVendorProduct, VendorProduct } from "@/lib/vendor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorName: string;
  vendorId: string;
}

const CATEGORIES = [
  "Women's Clothing",
  "Men's Clothing",
  "Home, Garden & Furniture",
  "Health, Beauty & Hair",
  "Jewelry & Watches",
  "Bags & Shoes",
  "Pet Supplies",
  "Sports & Outdoors",
  "Toys, Kids & Babies",
  "Consumer Electronics",
  "Home Improvement",
  "Automobiles & Motorcycles",
  "Phones & Accessories",
  "Computer & Office",
];

export function VendorAddProductModal({ isOpen, onClose, onSuccess, vendorName, vendorId }: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Consumer Electronics");
  const [description, setDescription] = useState("");
  
  // Requires at least 4 photos
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      import("sonner").then(({ toast }) => toast.error("Please enter a Product Title."));
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      import("sonner").then(({ toast }) => toast.error("Please enter a valid price."));
      return;
    }

    if (images.length < 4) {
      import("sonner").then(({ toast }) => toast.error(`You must upload at least 4 photos of your product. (Current: ${images.length}/4)`));
      return;
    }

    if (!description.trim()) {
      import("sonner").then(({ toast }) => toast.error("Please write a description for your product."));
      return;
    }

    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    addVendorProduct({
      title,
      price: Number(price),
      currency: "USD",
      category,
      categorySlug,
      description,
      images,
      vendorName,
      vendorId,
      vendorVerified: true,
    });

    import("sonner").then(({ toast }) => toast.success("Product published to Trends catalog successfully!"));
    onSuccess();
    onClose();

    // Reset fields
    setTitle("");
    setPrice("");
    setDescription("");
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          color: "#111111",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center">
              <PackagePlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Post Product as Vendor</h2>
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                By {vendorName} <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
            <input
              type="text"
              placeholder="e.g. Designer Italian Leather Jacket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="149.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Photos Requirement */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <ImageIcon size={14} className="text-blue-600" /> Product Photos
              </label>
              <span className={`text-xs font-bold ${images.length >= 4 ? "text-emerald-600" : "text-amber-600"}`}>
                {images.length}/4 Required Photos
              </span>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-bold text-white">
                    #{i + 1}
                  </span>
                </div>
              ))}

              {/* Upload Card */}
              <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload size={18} className="text-gray-400 mb-0.5" />
                <span className="text-[10px] font-semibold text-gray-500">Upload</span>
              </div>
            </div>

            {/* Image URL input fallback */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Description</label>
            <textarea
              rows={3}
              placeholder="Describe your item, specifications, materials, warranty..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={images.length < 4}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              <PackagePlus size={16} /> Publish Product to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
