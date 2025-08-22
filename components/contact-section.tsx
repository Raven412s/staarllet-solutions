"use client"
import ContactForm from "@/components/forms/contact-form"
import { cn } from "@/lib/utils"
import Copy from "./text-reveal/Copy"
import SectionWrapper from "./wrapper/SectionWrapper"



export const ContactSection = () => {
  // Form logic removed; handled by ContactForm

  return (
    <SectionWrapper
      navbarSpacing="none"
      padding="sm"
      background="transparent"
      maxWidth="full"
      className="flex items-center justify-start h-fit w-full gap-2 flex-col"
    >
      <section
        id="contact"
        className="w-full flex flex-col items-center  justify-start border-3 border-[#101c1650] rounded-[1.2rem] pt-12 bg-[#101c16] text-green-100 pointer-events-auto"
      >
        <Copy>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
              "bg-green-200/10 text-green-200 border border-green-200/20 shadow-sm",
              "hover:bg-green-200/20 transition-colors duration-200",
            )}
          >
            Contact Us
          </span>
        </Copy>

        <div className="w-full px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="space-y-8 col-span-1">
              <div className="space-y-4 w-full">
                <h2 className="text-4xl leading-[1.3] text-green-50 tracking-tight font-bold">Get in Touch</h2>
                <p className="text-xl leading-[1.1] text-green-100/60 tracking-normal font-medium">
                  Have questions or need assistance? We&apos;re here to help!
                </p>
              </div>

                <ContactForm />
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-8 col-span-1 md:col-span-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#101c16]">Contact Information</h3>
                <div className=" flex lg:flex-row lg:gap-8 flex-col gap-3 items-start lg:items-center justify-start">
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-green-600" />
                    <span>West Jyoti nagar Delhi</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneIcon className="h-5 w-5 text-green-600" />
                    <span>+91 63076 07882</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-green-600" />
                    <span>info@starlletsolution.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 text-green-600" />
                    <span>hr@starlletsolution.com</span>
                  </p>
                </div>
              </div>

              <h3 className="text-3xl font-semibold ">Find us on Map</h3>
              <div className="lg:aspect-[3/1] aspect-square w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3499.9108239063466!2d77.28564837550299!3d28.692314075632133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDQxJzMyLjMiTiA3N8KwMTcnMTcuNiJF!5e0!3m2!1sen!2sin!4v1755247960235!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="pt-4">
                <h4 className="text-lg font-semibold mb-2">Business Hours</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  )
}

// Icons (you can import from your preferred icon library)
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}