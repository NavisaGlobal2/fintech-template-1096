
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, FileText } from 'lucide-react';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';

const AuthButton: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return <Button variant="ghost" disabled>Loading...</Button>;
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setShowAuthModal(true)}>
          Sign In
        </Button>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/my-applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Applications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
