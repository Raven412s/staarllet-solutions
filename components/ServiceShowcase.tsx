"use client";
import { servicesData } from "@/data/servicesData";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Copy from "./text-reveal/Copy";


// Create categories array from actual data
const categories = [
  "All Services",
  ...servicesData.categories.filter(c => c.title !== "All Services").map(c => c.title)
];

export default function ServiceShowcase() {
  const [selected, setSelected] = useState<string>("All Services");

  // Filter services based on selected category
  const filtered = selected === "All Services"
    ? servicesData.services
    : servicesData.services.filter(service => service.category === selected);

  return (
    <div className="w-full mt-10 pointer-events-auto">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => {
          return (
            <button
              key={cat}
              className={cn(
                "px-4 py-1 rounded-full border text-sm font-medium hover:cursor-pointer transition",
                selected === cat
                  ? "bg-green-600/60 text-white border-green-600/30"
                  : "bg-white text-green-600 border-green-600/30 hover:bg-green-600/10"
              )}
              onClick={() => {
                console.log("Category selected:", cat);
                setSelected(cat)
              }}
            >
              <Copy><span>{cat}</span></Copy>
            </button>
          )
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(service => {
          const IconComponent = service.icon;
          return (
            <Copy key={service.id}>
              <div className="bg-green-600/10 rounded-2xl shadow border border-green-400/30 p-6 flex flex-col h-full">
                {IconComponent && (
                  <div className="bg-green-800 p-2.5 rounded-full text-center flex items-center justify-center mb-4 w-fit h-fit">
                    <IconComponent className="text-3xl text-green-100" />
                  </div>
                )}
                <Copy><h3 className="text-lg font-semibold mb-2 text-green-700">{service.title}</h3></Copy>
                <Copy><p className="text-gray-700 text-sm mb-4 flex-1">{service.description}</p></Copy>
                <ul className="mb-4 list-disc list-inside text-xs text-gray-500 space-y-1">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <Copy>
                        <span className="inline-flex">{feature}</span>
                      </Copy>
                    </li>
                  ))}
                </ul>
                <button className="mt-auto text-green-700 text-sm font-medium hover:underline flex items-center gap-1">
                  <Copy><span className="flex items-center justify-center gap-1"><span className="inline-flex">More details</span> <span aria-hidden="true" className="inline-flex"> <ChevronRight className="size-4" /> </span></span></Copy>
                </button>
              </div>
            </Copy>
          );
        })}
      </div>
    </div>
  );
}