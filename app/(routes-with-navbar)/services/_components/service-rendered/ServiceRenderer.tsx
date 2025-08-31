import { FC } from "react";
import { serviceComponents } from "./ServiceComponents";
import { ServiceSlug } from "@/types/service";

type Props = { slug: ServiceSlug };

const ServiceRenderer: FC<Props> = ({ slug }) => {
  const Component = serviceComponents[slug];
  if (!Component) return null;
  return <Component />;
};


export default ServiceRenderer;
