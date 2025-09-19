import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Store, Heart, ShieldCheck, Settings } from 'lucide-react';
import { mockCurrentUser, switchUserRole, setMockCurrentUser } from '@/lib/mockData';
import { UserRole } from '@/types';

const RoleSwitcher = () => {
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);

  const roles: { role: UserRole; icon: React.ReactNode; label: string; color: string }[] = [
    { role: 'customer', icon: <User className="w-4 h-4" />, label: 'Customer', color: 'customer' },
    { role: 'merchant', icon: <Store className="w-4 h-4" />, label: 'Merchant', color: 'merchant' },
    { role: 'ngo', icon: <Heart className="w-4 h-4" />, label: 'NGO', color: 'ngo' },
    { role: 'admin', icon: <ShieldCheck className="w-4 h-4" />, label: 'Admin', color: 'destructive' },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    switchUserRole(role);
    setCurrentUser(mockCurrentUser);
    // Force a page refresh to update the UI
    window.location.reload();
  };

  const handleLogout = () => {
    setMockCurrentUser(null);
    setCurrentUser(null);
    window.location.reload();
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-background border-2 shadow-lg">
            <Settings className="w-4 h-4 mr-2" />
            Demo Mode
            {currentUser && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {currentUser.role}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch User Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {roles.map(({ role, icon, label, color }) => (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
                {currentUser?.role === role && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            <span>Logout (No User)</span>
            {!currentUser && (
              <Badge variant="outline" className="ml-auto text-xs">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoleSwitcher;