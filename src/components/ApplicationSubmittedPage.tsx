import React from 'react';
import { CheckCircle2, Clock, FileText, Bell, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import InlineSignUp from '@/components/auth/InlineSignUp';

interface ApplicationSubmittedPageProps {
  applicationId: string;
}

const ApplicationSubmittedPage: React.FC<ApplicationSubmittedPageProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: "Applicants Helped", value: "2,500+" },
    { icon: Clock, label: "Avg. Response Time", value: "24 hours" },
    { icon: Award, label: "Satisfaction Rate", value: "98%" },
  ];

  const timeline = [
    { step: "Application Review", status: "current", time: "24-48 hours" },
    { step: "Decision & Offer", status: "upcoming", time: "3-5 days" },
    { step: "Funding", status: "upcoming", time: "5-7 days" },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4 animate-[fadeIn_0.6s_ease-out]">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sageLight mb-4">
            <CheckCircle2 className="w-12 h-12 text-sageDark" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Application Submitted!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for completing your application. We're reviewing your information and will get back to you soon.
          </p>
        </div>

        {/* Reference Number */}
        <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Application Reference</p>
              <p className="text-2xl font-semibold text-foreground font-mono">#{applicationId.slice(0, 8).toUpperCase()}</p>
            </div>
            <FileText className="w-8 h-8 text-sageDark" />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">What Happens Next</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === 'current' 
                    ? 'bg-sageLight border-2 border-sageDark' 
                    : 'bg-muted border-2 border-border'
                }`}>
                  <span className={`text-sm font-semibold ${
                    item.status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    item.status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {item.step}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Up Section or Account Link */}
        {!user ? (
          <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Track Your Application
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create an account to receive updates and manage your application progress.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-sageDark flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Real-time status notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-sageDark flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Track application progress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-sageDark flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">Manage documents securely</span>
                  </li>
                </ul>
              </div>
              <div>
                <InlineSignUp />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">You're All Set!</h2>
            <p className="text-muted-foreground mb-6">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/my-account')}
              className="rounded-full"
            >
              View My Applications
            </Button>
          </div>
        )}

        {/* Marketing Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-[2rem] p-6 border border-border shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sageLight mb-4">
                  <Icon className="w-6 h-6 text-sageDark" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        <div className="bg-sageLight/30 rounded-[2rem] p-8 border border-border">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-foreground italic mb-4">
              "The application process was straightforward, and I received my funding within a week. 
              This loan helped me complete my certification and advance my career."
            </p>
            <p className="text-sm font-medium text-foreground">— Sarah M., Software Developer</p>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">Common Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">When will I hear back?</h3>
              <p className="text-sm text-muted-foreground">
                Most applications are reviewed within 24-48 hours. You'll receive an email notification as soon as we have an update.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">What documents do I need?</h3>
              <p className="text-sm text-muted-foreground">
                We've received all your documents. If we need anything additional, we'll reach out via email.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Can I track my application?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Create an account above to access your personalized dashboard and track your application in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmittedPage;
