export interface VendorProfile {
  storeName: string;
  phone: string;
  ghanaCardNumber: string;
  ghanaCardPhoto: string;
  passportPhoto: string;
  verified: boolean;
  verifiedAt: string;
  vendorId: string;
  email?: string;
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
const VENDOR_REGISTRY_KEY = "trends_vendors_registry";
const VENDOR_PRODUCTS_KEY = "trends_vendor_products";

/**
 * Validates Ghana Card format (e.g. GHA-123456789-0).
 */
export function validateGhanaCardNumber(cardNum: string): { valid: boolean; reason?: string } {
  if (!cardNum || !cardNum.trim()) {
    return { valid: false, reason: "Ghana Card number is required." };
  }
  const clean = cardNum.trim().toUpperCase();
  const ghanaCardRegex = /^GHA-\d{9}-\d$/;
  if (!ghanaCardRegex.test(clean)) {
    return {
      valid: false,
      reason: "Invalid Ghana Card number format. Must follow official NIA format: GHA-XXXXXXXXX-X (e.g. GHA-123456789-0).",
    };
  }
  return { valid: true };
}

/**
 * Validates Ghana Phone format (+233 24 123 4567 or 0241234567).
 */
export function validateGhanaPhone(phone: string): { valid: boolean; reason?: string } {
  if (!phone || !phone.trim()) {
    return { valid: false, reason: "Ghana phone number is required." };
  }
  const clean = phone.trim().replace(/[\s-]/g, "");
  const phoneRegex = /^(?:\+233|0)[235][0-9]{8}$/;
  if (!phoneRegex.test(clean)) {
    return {
      valid: false,
      reason: "Invalid Ghana phone number. Example format: +233 24 123 4567 or 0241234567.",
    };
  }
  return { valid: true };
}

/**
 * Gets vendor profile for current active user or specified email.
 * Ensures account vendor status is synced wherever user logs in.
 */
export function getVendorProfile(userEmail?: string): VendorProfile | null {
  if (typeof window === "undefined") return null;

  let emailToUse = userEmail;

  if (!emailToUse) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const uObj = JSON.parse(savedUser);
        if (uObj?.email) emailToUse = uObj.email;
      } catch {}
    }
  }

  // Check email-specific storage key first
  if (emailToUse) {
    const key = `trends_vendor_profile_${emailToUse.toLowerCase()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
      } catch {}
    }

    // Check global registry mapping
    const registryRaw = localStorage.getItem(VENDOR_REGISTRY_KEY);
    if (registryRaw) {
      try {
        const reg = JSON.parse(registryRaw);
        if (reg && reg[emailToUse.toLowerCase()]) {
          return reg[emailToUse.toLowerCase()];
        }
      } catch {}
    }
  }

  // Fallback to active device profile key
  const defaultSaved = localStorage.getItem(VENDOR_KEY);
  if (!defaultSaved) return null;
  try {
    const parsed = JSON.parse(defaultSaved);
    return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves vendor profile linked to user account email and synced globally.
 */
export function saveVendorProfile(profile: VendorProfile): void {
  if (typeof window === "undefined") return;

  const savedUser = localStorage.getItem("user");
  let email = profile.email;

  if (savedUser) {
    try {
      const uObj = JSON.parse(savedUser);
      uObj.isVendor = true;
      uObj.verified = true;
      if (!email && uObj.email) email = uObj.email;
      localStorage.setItem("user", JSON.stringify(uObj));
    } catch {}
  }

  const updatedProfile = { ...profile, email };

  // Save active device vendor key
  localStorage.setItem(VENDOR_KEY, JSON.stringify(updatedProfile));

  // Save user-synced vendor key and update registry
  if (email) {
    const cleanEmail = email.toLowerCase();
    localStorage.setItem(`trends_vendor_profile_${cleanEmail}`, JSON.stringify(updatedProfile));

    try {
      const regRaw = localStorage.getItem(VENDOR_REGISTRY_KEY);
      const registry = regRaw ? JSON.parse(regRaw) : {};
      registry[cleanEmail] = updatedProfile;
      localStorage.setItem(VENDOR_REGISTRY_KEY, JSON.stringify(registry));
    } catch {}
  }
}

/**
 * Syncs user account on sign-in. Restores vendor status if account email is a registered vendor.
 */
export function syncUserVendorAccount(userEmail: string): VendorProfile | null {
  if (typeof window === "undefined" || !userEmail) return null;
  const cleanEmail = userEmail.toLowerCase();
  const profile = getVendorProfile(cleanEmail);
  if (profile && profile.verified) {
    saveVendorProfile(profile);
  }
  return profile;
}

export function isVendorVerified(userEmail?: string): boolean {
  const vp = getVendorProfile(userEmail);
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
 * Deletes a vendor product by ID and returns the updated product list.
 */
export function deleteVendorProduct(productId: string): VendorProduct[] {
  if (typeof window === "undefined") return [];
  const existing = getVendorProducts();
  const updated = existing.filter((p) => p.id !== productId);
  localStorage.setItem(VENDOR_PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
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

  if (file.size < 5000) {
    return { valid: false, reason: "The photo size is too small or corrupted. Please upload a clear photo." };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 150 || img.height < 150) {
          resolve({ valid: false, reason: "Image resolution is too low. Minimum 150x150 pixels required." });
          return;
        }

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
