import tote from "@/assets/prod-tote.jpg";
import wallet from "@/assets/prod-wallet.jpg";
import sunglasses from "@/assets/prod-sunglasses.jpg";
import watch from "@/assets/home-watch.jpg";
import headphones from "@/assets/home-headphones.jpg";
import sneaker from "@/assets/home-sneaker.jpg";
import bag from "@/assets/home-bag.jpg";
import rec1 from "@/assets/home-rec-1.jpg";
import rec2 from "@/assets/home-rec-2.jpg";
import camera from "@/assets/prod-camera.jpg";
import jacket from "@/assets/prod-jacket.jpg";
import loafer from "@/assets/prod-loafer.jpg";
import sneaker2 from "@/assets/prod-sneaker2.jpg";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  img: string;
  rating?: number;
  reviews?: string;
}

export const PRODUCTS: Product[] = [
  { id: "p1", brand: "Saint Laurent", name: "Luxury Leather Tote", price: "₵2,450", img: tote, rating: 4.9, reviews: "1,248" },
  { id: "p2", brand: "Louis Vuitton", name: "Pocket Organizer", price: "₵690", img: wallet, rating: 4.8, reviews: "840" },
  { id: "p3", brand: "Ray-Ban", name: "Aviator Classic", price: "₵180", img: sunglasses, rating: 4.7, reviews: "520" },
  { id: "p4", brand: "Apple", name: "Watch Ultra 3", price: "₵899", img: watch, rating: 4.9, reviews: "2,150" },
  { id: "p5", brand: "Sony", name: "WH-1000XM6", price: "₵449", img: headphones, rating: 4.9, reviews: "1,890" },
  { id: "p6", brand: "Nike", name: "Air Max Premium", price: "₵220", img: sneaker, rating: 4.6, reviews: "940" },
  { id: "p7", brand: "Bennett & Co.", name: "Cashmere Knit", price: "₵320", img: rec1, rating: 4.8, reviews: "310" },
  { id: "p8", brand: "Studio Minimal", name: "Ceramic Vase", price: "₵95", img: rec2, rating: 4.5, reviews: "150" },
  { id: "p9", brand: "Bennett & Co.", name: "Leather Weekender", price: "₵680", img: bag, rating: 4.9, reviews: "420" },
  { id: "p10", brand: "Fujifilm", name: "Retro Film Camera", price: "₵1,200", img: camera, rating: 4.8, reviews: "670" },
  { id: "p11", brand: "Acne Studios", name: "Tailored Wool Jacket", price: "₵850", img: jacket, rating: 4.7, reviews: "280" },
  { id: "p12", brand: "Gucci", name: "Classic Leather Loafer", price: "₵790", img: loafer, rating: 4.8, reviews: "510" },
  { id: "p13", brand: "Nike", name: "Air Force Runner", price: "₵190", img: sneaker2, rating: 4.6, reviews: "890" },
  { id: "p14", brand: "Artemide", name: "Minimalist Table Lamp", price: "₵340", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80", rating: 4.7, reviews: "190" },
  { id: "p15", brand: "Apple", name: "AirPods Pro Max", price: "₵549", img: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&auto=format&fit=crop&q=80", rating: 4.9, reviews: "3,110" },
  { id: "p16", brand: "Nomatic", name: "Minimalist Travel Pack", price: "₵280", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80", rating: 4.8, reviews: "750" },
  { id: "p17", brand: "Diptyque", name: "Scented Candle Duo", price: "₵120", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80", rating: 4.5, reviews: "220" },
  { id: "p18", brand: "Fellow", name: "Ode Coffee Grinder", price: "₵295", img: "https://images.unsplash.com/photo-1585671962215-4734fb08c024?w=500&auto=format&fit=crop&q=80", rating: 4.9, reviews: "630" },
  { id: "p19", brand: "Keychron", name: "Q1 Mechanical Keyboard", price: "₵160", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80", rating: 4.7, reviews: "450" },
  { id: "p20", brand: "Everlane", name: "The Organic Hoodie", price: "₵98", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80", rating: 4.6, reviews: "980" }
];
