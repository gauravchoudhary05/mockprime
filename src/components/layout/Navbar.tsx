import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LogOut, User, LayoutDashboard, FileText, Shield } from 'lucide-react';
import mockPrimeLogo from '@/assets/mockprime-logo.png';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-background/90 backdrop-blur-xl shadow-glass border-b border-border/50'
        : 'bg-background/70 backdrop-blur-lg border-b border-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img src={mockPrimeLogo} alt="MockPrime Logo" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300" />
              <div className="absolute -inset-1 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MockPrime</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/mock-tests"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/mock-tests')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  Mock Tests
                </Link>
                <Link
                  to="/practice"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/practice')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  Practice
                </Link>
                <div className="w-px h-6 bg-border mx-2" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                          {getInitials(user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-strong shadow-glass">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/legal?type=privacy')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy Policy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/legal?type=terms')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Terms & Conditions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="gradient-primary text-sm font-medium shadow-glow hover:shadow-glow-lg transition-shadow">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
              <X className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}>
          <div className="border-t border-border/50 pt-4">
            {user ? (
              <div className="flex flex-col gap-1">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/mock-tests"
                  className={`px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/mock-tests') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mock Tests
                </Link>
                <Link
                  to="/practice"
                  className={`px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/practice') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Practice
                </Link>
                <div className="border-t border-border/50 my-2" />
                <Link
                  to="/legal?type=privacy"
                  className="px-4 py-2.5 hover:bg-muted rounded-lg transition-colors flex items-center gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Privacy Policy
                </Link>
                <Link
                  to="/legal?type=terms"
                  className="px-4 py-2.5 hover:bg-muted rounded-lg transition-colors flex items-center gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Terms & Conditions
                </Link>
                <div className="border-t border-border/50 my-2" />
                <Button
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gradient-primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Gradient accent line */}
      <div className={`h-[2px] gradient-primary transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-50'}`} />
    </nav>
  );
}
