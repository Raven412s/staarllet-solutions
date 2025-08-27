import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Partners | Staarllet Solutions",
  description: "Meet our partners at Staarllet Solutions. We collaborate with top brands and organizations to deliver the best recruitment, branding, and media services in Delhi.",
};
import React from 'react'

// Example partners data (replace with real data or fetch from API)
const partners = [
  {
    name: "Acme Corp",
    logo: "/backgrounds/background-1.png",
    website: "https://acme.com",
    description: "Leading provider of HR solutions worldwide."
  },
  {
    name: "Globex Inc.",
    logo: "/backgrounds/background-2.png",
    website: "https://globex.com",
    description: "Innovative branding and media partner."
  },
  {
    name: "Initech",
    logo: "/backgrounds/background-3.png",
    website: "https://initech.com",
    description: "Technology-driven recruitment solutions."
  },
  {
    name: "Umbrella Group",
    logo: "/backgrounds/background-4.png",
    website: "https://umbrella.com",
    description: "Trusted partner for workforce optimization."
  },
];

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Our Partners</h1>
        <p className="text-lg text-green-700">
          We collaborate with top brands and organizations to deliver the best recruitment, branding, and media services.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow border border-green-100 hover:border-green-300"
          >
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-green-50 flex items-center justify-center border-2 border-green-200 group-hover:border-green-400 transition relative">
              <Image
                fill
                src={partner.logo}
                alt={partner.name}
                className="object-contain w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2 group-hover:text-green-700 transition">{partner.name}</h2>
            <p className="text-green-700 text-sm mb-4">{partner.description}</p>
            <span className="inline-block px-4 py-1 bg-green-100 text-green-800 text-xs rounded-full group-hover:bg-green-200 transition">
              Visit Website
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PartnersPage;
