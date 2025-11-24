import { CheckCircle, FileCheck, Zap } from 'lucide-react';
import stepVerifyImage from '@/assets/step-verify-profile.jpg';
import stepMatchedImage from '@/assets/step-matched-options.jpg';
import stepAccessImage from '@/assets/step-access-funds.jpg';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: CheckCircle,
      title: "Verify your profile",
      description: "Use your social profiles and documents to show who you are",
      image: stepVerifyImage,
      imagePosition: "left"
    },
    {
      number: 2,
      icon: FileCheck,
      title: "Get matched to options",
      description: "We match you to fair loan options based on your situation",
      image: stepMatchedImage,
      imagePosition: "right"
    },
    {
      number: 3,
      icon: Zap,
      title: "Access funds fast",
      description: "Once approved, funds arrive quickly so you can move forward",
      image: stepAccessImage,
      imagePosition: "left"
    }
  ];

  return (
    <section id="how" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            How it works
          </h2>
        </div>

        {steps.map((step, index) => (
          <div 
            key={step.number}
            className={`grid md:grid-cols-2 gap-12 items-center ${
              step.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
            }`}
            style={{
              animation: `fadeIn 0.6s ease-out ${index * 0.2}s both`
            }}
          >
            {/* Image */}
            <div className={`relative ${step.imagePosition === 'right' ? 'md:order-2' : ''}`}>
              <div className="absolute -top-6 -left-6 z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-sage flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden group">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className={`space-y-6 ${step.imagePosition === 'right' ? 'md:order-1' : ''}`}>
              <div className="w-16 h-16 rounded-full bg-sageLight flex items-center justify-center group hover:scale-110 hover:rotate-12 transition-all duration-300">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-xl text-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
