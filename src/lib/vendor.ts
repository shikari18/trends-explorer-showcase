export interface VendorProfile {
  storeName: string;
  phone: string;
  ghanaCardNumber: string;
  ghanaCardPhoto: string;
  passportPhoto: string;
  verified: boolean;
  verifiedAt: string;
  vendorId: string;
}

export interface VendorProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  categorySlug: string;
  description: string;
  images: string[];
  vendorName: string;
  vendorId: string;
  vendorVerified: boolean;
  createdAt: string;
}

const VENDOR_KEY = "trends_vendor_profile";
const VENDOR_PRODUCTS_KEY = "trends_vendor_products";

export function getVendorProfile(): VendorProfile | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(VENDOR_KEY);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveVendorProfile(profile: VendorProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VENDOR_KEY, JSON.stringify(profile));

  // Also update user session
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      const uObj = JSON.parse(savedUser);
      uObj.isVendor = true;
      uObj.verified = true;
      localStorage.setItem("user", JSON.stringify(uObj));
    } catch {}
  }
}

export function isVendorVerified(): boolean {
  const vp = getVendorProfile();
  return !!(vp && vp.verified);
}

export function getVendorProducts(): VendorProduct[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(VENDOR_PRODUCTS_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addVendorProduct(product: Omit<VendorProduct, "id" | "createdAt">): VendorProduct {
  const existing = getVendorProducts();
  const newProduct: VendorProduct = {
    ...product,
    id: `vendor-prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  existing.unshift(newProduct);
  if (typeof window !== "undefined") {
    localStorage.setItem(VENDOR_PRODUCTS_KEY, JSON.stringify(existing));
  }
  return newProduct;
}

/**
 * Validates uploaded passport / selfie photo.
 * Checks image format, file size, dimensions, and aspect ratio.
 */
export async function validatePassportPhoto(file: File): Promise<{ valid: boolean; reason?: string }> {
  if (!file) return { valid: false, reason: "No photo selected." };

  if (!file.type.startsWith("image/")) {
    return { valid: false, reason: "The uploaded file is not a valid image. Please select a photo." };
  }

  // File size minimum check
  if (file.size < 5000) {
    return { valid: false, reason: "The photo size is too small or corrupted. Please upload a clear photo." };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Dimension check: minimum 150x150
        if (img.width < 150 || img.height < 150) {
          resolve({ valid: false, reason: "Image resolution is too low. Minimum 150x150 pixels required." });
          return;
        }

        // Aspect ratio check for headshot (between 0.5 and 2.2)
        const ratio = img.height / img.width;
        if (ratio < 0.5 || ratio > 2.2) {
          resolve({ valid: false, reason: "Invalid passport photo aspect ratio. Please upload a clear headshot photo." });
          return;
        }

        resolve({ valid: true });
      };
      img.onerror = () => resolve({ valid: false, reason: "Could not read image. Please retake the photo." });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ valid: false, reason: "Failed to read image file." });
    reader.readAsDataURL(file);
  });
}
