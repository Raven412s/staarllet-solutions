// service/_components/hr-certification-courses.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { servicesData } from "@/data/servicesData";
import Copy from '@/components/text-reveal/Copy';

export default function HrCertificationCourses() {
  const service = servicesData.services.find(service => service.slug === "hr-certification-courses");
  if (!service) {
    return <div>Service not found</div>;
  }
  const features = [
    {
      title: "Globally Recognized Certifications",
      description: "Earn certifications that are valued by employers worldwide, including SHRM, HRCI, and more."
    },
    {
      title: "Expert-Led Training",
      description: "Learn from certified HR professionals and industry leaders with years of practical experience."
    },
    {
      title: "Flexible Learning Modes",
      description: "Choose from online, in-person, or hybrid courses to fit your schedule."
    },
    {
      title: "Comprehensive Curriculum",
      description: "Covers all key HR domains: recruitment, compliance, payroll, talent management, and more."
    },
    {
      title: "Career Advancement",
      description: "Boost your career prospects and earning potential with advanced HR credentials."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <Copy><Badge variant="secondary" className="text-sm font-semibold leading-relaxed">HR Excellence</Badge></Copy>
          <Copy><h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-relaxed">{service.title}</h1></Copy>
          <Copy>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {service.detailedDescription || 'Advance your HR career with globally recognized certifications and expert-led training.'}
            </p>
          </Copy>
          <Copy><Button size="lg" className="mt-4 leading-relaxed">Enroll Now</Button></Copy>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/service-data-image/hr-certification.jpg"
              alt="HR Certification"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Copy><h2 className="text-3xl font-bold mb-4 leading-relaxed">What is {service.title}?</h2></Copy>
            <Copy>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Copy>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <Copy><h3 className="text-2xl font-semibold mb-4 leading-relaxed">Who is it for?</h3></Copy>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {service.whoIsItFor?.map((audience, index) => (
                <Copy key={index}>
                  <Badge variant="outline" className="text-base py-2 px-4 leading-relaxed">
                    {audience}
                  </Badge>
                </Copy>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="py-16 container mx-auto px-4">
        <Copy><h2 className="text-3xl font-bold text-center mb-12 leading-relaxed">Benefits of Our {service.title}</h2></Copy>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <Copy><CardTitle className="leading-relaxed">{feature.title}</CardTitle></Copy>
              </CardHeader>
              <CardContent>
                <Copy><p className="text-muted-foreground leading-relaxed">{feature.description}</p></Copy>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Section */}
      {service.processSteps && service.processSteps.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <Copy><h2 className="text-3xl font-bold text-center mb-12 leading-relaxed">How Our {service.title} Process Works</h2></Copy>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.processSteps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <Copy><span className="text-primary-foreground font-bold text-xl leading-relaxed">{step.step}</span></Copy>
                    </div>
                    <Copy><CardTitle className="leading-relaxed">{step.title}</CardTitle></Copy>
                  </CardHeader>
                  <CardContent>
                    <Copy><CardDescription className="text-base leading-relaxed">{step.description}</CardDescription></Copy>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {service.testimonials && service.testimonials.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <Copy><h2 className="text-3xl font-bold text-center mb-12 leading-relaxed">What Our Students Say</h2></Copy>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <Copy><p className="italic mb-4 leading-relaxed">&quot;{testimonial.quote}&quot;</p></Copy>
                  <div className="mt-auto">
                    <Copy><p className="font-semibold leading-relaxed">{testimonial.author}</p></Copy>
                    <Copy><p className="text-sm text-muted-foreground leading-relaxed">{testimonial.role}</p></Copy>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Copy><h2 className="text-3xl font-bold mb-4 leading-relaxed">Ready to Boost Your HR Career?</h2></Copy>
          <Copy>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Enroll now and take the next step in your HR journey with our expert-led certification courses.
            </p>
          </Copy>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Copy><Button variant="secondary" size="lg" className="leading-relaxed">Enroll Now</Button></Copy>
            <Copy>
              <Button variant="outline" className="bg-transparent border-white text-white leading-relaxed" size="lg">
                Request Info
              </Button>
            </Copy>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <Copy><h2 className="text-3xl font-bold text-center mb-12 leading-relaxed">Frequently Asked Questions</h2></Copy>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {service.faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left leading-relaxed">{faq.question}</AccordionTrigger>
                <AccordionContent className=" leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </div>
  );
}
