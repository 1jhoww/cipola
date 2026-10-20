"use client";
import { materialQuoteLink } from "@/lib/site";
import { trackLead } from "@/lib/tracking";

// Opens Rafael's WhatsApp with a quote request for one stone. The click counts
// as a lead for the ad campaigns, like a sent form.
export function WhatsAppQuote({
  material,
  className,
  children,
}: {
  material: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={materialQuoteLink(material)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackLead()}
    >
      {children}
    </a>
  );
}
