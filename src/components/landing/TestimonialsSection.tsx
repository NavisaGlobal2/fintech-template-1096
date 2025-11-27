import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "TechScale helped me get my IT certification without asking about my credit history. Within 3 months, I landed a great job. Couldn't have done it without them.",
      name: 'Amara K.',
      location: 'London',
      flag: '🇳🇬',
      rating: 5,
    },
    {
      quote: "I needed funds to cover my first month's rent and essentials. The team understood my situation as a newcomer and approved me in 2 days. Life-changing support.",
      name: 'Wei L.',
      location: 'Manchester',
      flag: '🇨🇳',
      rating: 5,
    },
    {
      quote: "Real people who actually listen. No hidden fees, clear terms, and they guided me through everything. Finally, a lender that sees me as more than a credit score.",
      name: 'Carlos R.',
      location: 'Birmingham',
      flag: '🇧🇷',
      rating: 5,
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Stories from our<br />community
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real experiences from newcomers who found their fresh start with TechScale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background border-2 border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {testimonial.flag}
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
