import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Got my AWS cert. Landed £45k role in 3 months.",
      name: 'Chukwu A.',
      location: 'London',
      flag: '🇳🇬',
      rating: 5,
      role: 'Cloud Engineer',
    },
    {
      quote: "ACCA funded. 48hr approval. Now earning 3x.",
      name: 'Priya M.',
      location: 'Manchester',
      flag: '🇮🇳',
      rating: 5,
      role: 'Senior Accountant',
    },
    {
      quote: "No credit history? No problem. Now leading teams.",
      name: 'Rafael S.',
      location: 'Birmingham',
      flag: '🇧🇷',
      rating: 5,
      role: 'Team Lead',
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Real careers.<br />Real transformations.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            2,500+ success stories. Yours could be next.
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
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-3 mb-2">
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
                <div className="text-xs text-primary font-semibold ml-15">
                  {testimonial.role}
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
