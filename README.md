
# Staarllet Staffing Solution – Recruitment Website

This is a modern recruitment and HR solutions web application built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS. It is designed to connect organizations with top talent and empower professionals with career advancement tools.

## Features

- **Dynamic Landing Page**: Hero section, animated category masonry, and service highlights.
- **Service Showcase**: Filterable grid of HR and talent solutions, each with icons, descriptions, and feature lists.
- **About Us Section**: Company mission, talent network stats, and differentiators.
- **Contact Section**: Easy-to-use contact form for inquiries.
- **Responsive UI**: Fully responsive, modern design using Tailwind CSS and custom components.
- **Animated UI**: Uses Framer Motion and custom text reveal animations for engaging user experience.
- **Data-Driven**: All services, categories, and navigation are data-driven for easy updates.
- **Component-Based**: Modular React components for easy maintenance and scalability.

## Project Structure

- `app/`: Next.js app directory, including main layout, global styles, and routed pages.
- `components/`: All UI components, including navigation, service showcase, category masonry, about/contact sections, and UI primitives.
- `data/`: TypeScript data files for services, categories, navigation, and partners.
- `public/`: Static assets, images, and SVGs for branding and backgrounds.
- `styles/`: Custom CSS (e.g., navbar styles).
- `lib/`: Utility functions.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** (with custom config)
- **Framer Motion** (animations)
- **React Icons** and **Lucide React** (iconography)
- **React Hook Form** (forms)
- **GSAP** (optional advanced animations)
- **Zod** (validation)

## Key Components

- `JobCategoryMasonry`: Animated, responsive job category grid.
- `ServiceShowcase`: Filterable, icon-rich service grid.
- `SectionWrapper`: Layout utility for consistent section styling.
- `about-us-section.tsx`: Company story, stats, and mission.
- `contact-section.tsx`: Contact form and details.
- `Nav.tsx`: Responsive navigation bar.

## How to Run

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## Customization

- Update services, categories, and navigation in the `data/` folder.
- Add or modify images in `public/`.
- Adjust styles in `app/globals.css` and `styles/`.
