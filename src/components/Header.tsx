import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Store, 
  Heart, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';
import { mockCurrentUser } from '@/lib/mockData';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = mockCurrentUser;

  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case 'merchant': return <Store className="w-4 h-4" />;
      case 'ngo': return <Heart className="w-4 h-4" />;
      case 'admin': return <ShieldCheck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = () => {
    if (!user) return 'secondary';
    switch (user.role) {
      case 'merchant': return 'merchant';
      case 'ngo': return 'ngo';
      case 'admin': return 'destructive';
      default: return 'customer';
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'merchant': return '/merchant';
      case 'ngo': return '/ngo';
      case 'admin': return '/admin';
      default: return '/profile';
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Heart className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-foreground">Surplus & Local</h1>
              <p className="text-xs text-muted-foreground">Community Deals</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath('/') && location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link 
                to={getDashboardPath()} 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(getDashboardPath()) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
            {user?.role === 'merchant' && (
              <Link 
                to="/merchant/redeem" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath('/merchant/redeem') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Redeem
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`bg-${getRoleColor()} text-${getRoleColor()}-foreground`}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        {user.verified && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleIcon()}
                        <span className="text-xs capitalize text-muted-foreground">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardPath()} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth?mode=login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              {user && (
                <>
                  <Link 
                    to={getDashboardPath()} 
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'merchant' && (
                    <Link 
                      to="/merchant/redeem" 
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Redeem
                    </Link>
                  )}
                </>
              )}
              
              {user ? (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`bg-${getRoleColor()} text-${getRoleColor()}-foreground`}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t">
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/auth?mode=login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;