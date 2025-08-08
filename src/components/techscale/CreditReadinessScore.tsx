
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserProfile, CreditScore } from '@/types/techscale';
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { calculateCreditReadinessScore } from '@/utils/creditScoring';

interface CreditReadinessScoreProps {
  userProfile: UserProfile;
}

const CreditReadinessScore: React.FC<CreditReadinessScoreProps> = ({ userProfile }) => {
  const creditScore = calculateCreditReadinessScore(userProfile);

  const getScoreColor = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'needs-improvement':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreBadgeColor = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-improvement':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'needs-improvement':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="cosmic-glass">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTierIcon(creditScore.tier)}
            <CardTitle>Credit Readiness Score</CardTitle>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(creditScore.tier)}`}>
            {creditScore.score}
          </div>
          <Badge className={getScoreBadgeColor(creditScore.tier)}>
            {creditScore.tier.charAt(0).toUpperCase() + creditScore.tier.slice(1).replace('-', ' ')}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            This score indicates your likelihood of loan approval based on the information provided.
          </div>
          
          {/* Score breakdown */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Score Breakdown</div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Income ({creditScore.factors.income}%)</span>
                <Progress value={creditScore.factors.income} className="w-20 h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs">Employment ({creditScore.factors.employment}%)</span>
                <Progress value={creditScore.factors.employment} className="w-20 h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs">Education ({creditScore.factors.education}%)</span>
                <Progress value={creditScore.factors.education} className="w-20 h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs">Co-signer ({creditScore.factors.coSigner}%)</span>
                <Progress value={creditScore.factors.coSigner} className="w-20 h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Tips */}
      <Card className="cosmic-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Ways to Improve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {creditScore.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="text-sm">{tip}</div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4" size="sm">
            Get Personalized Guidance
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="cosmic-glass">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="sm">
            📞 Speak with an Advisor
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            📊 View Detailed Credit Report
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            🎯 Get Pre-qualification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditReadinessScore;
