import type { ServiceSlug } from "@/types/service";
import dynamic from "next/dynamic";

const makeDynamic = (path: string, label: string) =>
  dynamic(() => import(`../${path}`), {
    ssr: true,
    loading: () => <p>Loading {label}...</p>,
  });

export const serviceComponents: Record<ServiceSlug, React.ComponentType<object>> = {
  "outsourcing-solutions": makeDynamic("outsourcing-services", "Outsourcing services"),
  "end-to-end-hiring-services": makeDynamic("end-to-end-hiring-services", "End-to-end hiring services"),
  "hr-certification-courses": makeDynamic("hr-certification-courses", "HR certification courses"),
  "resume-career-guidance": makeDynamic("resume-and-career-guidance", "Resume and career guidance"),
  "skill-development-training": makeDynamic("skill-development-training", "Skill development training"),
  "talent-workforce-optimization": makeDynamic("talent-workforce-optimization", "Talent workforce optimization"),
};
