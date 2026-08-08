import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Upload, AlertCircle, Sparkles, Camera, CreditCard, Building2, Phone } from "lucide-react";
import { validatePassportPhoto, saveVendorProfile, VendorProfile, validateGhanaCardNumber, validateGhanaPhone } from "@/lib/vendor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
  userName?: string;
}

export function VendorVerificationModal({ isOpen, onClose, onSuccess, userEmail, userName }: Props) {
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [ghanaCardPhoto, setGhanaCardPhoto] = useState<string | null>(null);
  
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPhotoValid, setIsPhotoValid] = useState(false);

  if (!isOpen) return null;

  const handleGhanaCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size < 5000) {
        import("sonner").then(({ toast }) => toast.error("Ghana Card photo file is too small or corrupted. Please upload a clear photo."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setGhanaCardPhoto(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPassportFile(file);
    setIsValidating(true);
    setValidationError(null);
    setIsPhotoValid(false);

    // Read Data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => setPassportPhoto(event.target?.result as string);
    reader.readAsDataURL(file);

    // Perform facial / photo validation check
    const result = await validatePassportPhoto(file);
    setIsValidating(false);

    if (result.valid) {
      setIsPhotoValid(true);
      setValidationError(null);
      import("sonner").then(({ toast }) => toast.success("Passport photo verified successfully!"));
    } else {
      setIsPhotoValid(false);
      setValidationError(result.reason || "Invalid passport photo format. Please retake a clear photo of your face.");
      import("sonner").then(({ toast }) => toast.error(result.reason || "Invalid photo format. Please retake photo."));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim() || storeName.trim().length < 3) {
      const msg = "Please enter a valid Store / Business Name (minimum 3 characters).";
      setValidationError(msg);
      import("sonner").then(({ toast }) => toast.error(msg));
      return;
    }

    // Strict Ghana Phone Check
    const phoneCheck = validateGhanaPhone(phone);
    if (!phoneCheck.valid) {
      setValidationError(phoneCheck.reason || "Invalid Ghana Phone Number.");
      import("sonner").then(({ toast }) => toast.error(phoneCheck.reason || "Invalid Ghana Phone Number."));
      return;
    }

    // Strict Ghana Card Number Check
    const cardCheck = validateGhanaCardNumber(ghanaCardNumber);
    if (!cardCheck.valid) {
      setValidationError(cardCheck.reason || "Invalid Ghana Card details.");
      import("sonner").then(({ toast }) => toast.error(cardCheck.reason || "Invalid Ghana Card format."));
      return;
    }

    if (!ghanaCardPhoto) {
      const msg = "Please upload a clear photo of your official Ghana Card.";
      setValidationError(msg);
      import("sonner").then(({ toast }) => toast.error(msg));
      return;
    }

    if (!passportPhoto || !isPhotoValid) {
      const msg = "Please upload a valid passport headshot photo of yourself to proceed.";
      setValidationError(msg);
      import("sonner").then(({ toast }) => toast.error(msg));
      return;
    }

    const profile: VendorProfile = {
      storeName: storeName.trim(),
      phone: phone.trim(),
      ghanaCardNumber: ghanaCardNumber.trim().toUpperCase(),
      ghanaCardPhoto,
      passportPhoto,
      verified: true,
      verifiedAt: new Date().toISOString(),
      vendorId: `vendor-${Date.now()}`,
      email: userEmail,
    };

    saveVendorProfile(profile);
    import("sonner").then(({ toast }) => toast.success("Congratulations! You are officially verified as a Trends Vendor!"));
    onSuccess();
    onClose();
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
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-1.5">
                Become a Vendor <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white" />
              </h2>
              <p className="text-xs text-gray-500">Official Safety & Legitimacy Check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-5 flex-1">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              Anti-Scam Security: All vendors must submit official Ghana Card details & verified facial photo to sell on Trends.
            </p>
          </div>

          {/* Store Name & Phone */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Building2 size={14} className="text-gray-500" /> Store / Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dark's Fashion Boutique"
                value={storeName}
                onChange={(e) => { setStoreName(e.target.value); setValidationError(null); }}
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Phone size={14} className="text-gray-500" /> Phone Number (Ghana)
              </label>
              <input
                type="tel"
                placeholder="+233 24 123 4567 or 0241234567"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setValidationError(null); }}
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Ghana Card Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <CreditCard size={14} className="text-gray-500" /> Official Ghana Card Verification (NIA)
            </label>
            <input
              type="text"
              placeholder="Ghana Card No. (e.g. GHA-123456789-0)"
              value={ghanaCardNumber}
              onChange={(e) => { setGhanaCardNumber(e.target.value.toUpperCase()); setValidationError(null); }}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-blue-600"
            />

            {/* Ghana Card Photo Upload */}
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleGhanaCardUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {ghanaCardPhoto ? (
                <div className="flex items-center gap-3">
                  <img src={ghanaCardPhoto} alt="Ghana Card" className="w-16 h-12 object-cover rounded-xl border border-gray-200" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">Ghana Card Uploaded</p>
                    <p className="text-[11px] text-blue-600 font-medium">Click to change photo</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs font-medium text-gray-700">Upload Photo of Ghana Card</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Passport / Face Photo Validation */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Camera size={14} className="text-gray-500" /> Upload Passport Headshot Photo
              </label>
              <span className="text-[10px] font-medium text-blue-600">Auto Face Check</span>
            </div>

            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePassportUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {passportPhoto ? (
                <div className="flex items-center gap-3">
                  <img src={passportPhoto} alt="Passport Photo" className="w-12 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Passport Photo</p>
                    {isValidating ? (
                      <p className="text-[11px] text-amber-600 font-medium animate-pulse">Checking photo validity...</p>
                    ) : isPhotoValid ? (
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Valid Photo Verified
                      </p>
                    ) : (
                      <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> Invalid photo - Retake photo
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs font-medium text-gray-700">Take or Upload Passport Headshot</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Must be a clear headshot photo</p>
                </div>
              )}
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{validationError}</p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!isPhotoValid || !ghanaCardPhoto}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Become Verified Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
