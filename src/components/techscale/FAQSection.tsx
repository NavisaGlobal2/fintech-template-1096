
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need a co-signer to apply?",
      answer: "Not necessarily! We work with several lenders who offer co-signer-free loans for qualified applicants. However, having a co-signer can improve your approval chances and potentially lower your interest rates."
    },
    {
      question: "What countries do you serve?",
      answer: "We primarily serve African students and professionals looking to study or work abroad in countries like the US, UK, Canada, Australia, and across Europe. We're continuously expanding our network."
    },
    {
      question: "How long does the application process take?",
      answer: "The initial matching process takes just a few minutes. Once you apply with a lender, approval times vary from 5 days to 6 weeks depending on the lender and loan type."
    },
    {
      question: "Are there any fees for using TechScale?",
      answer: "Our loan matching service is completely free. You only pay fees directly to the lenders you choose to work with, and we ensure all terms are transparent upfront."
    },
    {
      question: "What if I don't get approved for a loan?",
      answer: "We provide credit readiness scoring and improvement tips. You can also explore our sponsor matching service or consider our career microloans for smaller funding needs."
    },
    {
      question: "Can I apply for multiple loans?",
      answer: "Yes! We encourage applying to multiple lenders to compare offers and increase your chances of approval. Our platform makes it easy to manage multiple applications."
    }
  ];

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get answers to common questions about our financing platform
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border border-border px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
