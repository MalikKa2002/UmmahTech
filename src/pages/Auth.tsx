import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Store, Building, User } from 'lucide-react';
import { UserRole } from '@/types';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') || 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode as 'login' | 'signup');
  const [role, setRole] = useState<UserRole>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organizationName: '',
    businessName: '',
    address: '',
    category: '',
    termsAccepted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Auth submission:', { mode, role, formData });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'merchant': return <Store className="w-4 h-4" />;
      case 'ngo': return <Heart className="w-4 h-4" />;
      case 'admin': return <Building className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleDescription = (userRole: UserRole) => {
    switch (userRole) {
      case 'customer': return 'Find great deals and help reduce waste';
      case 'merchant': return 'List surplus inventory and connect with customers';
      case 'ngo': return 'Access free donations for your organization';
      case 'admin': return 'Manage platform and verify organizations';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Surplus & Local</h1>
              <p className="text-xs text-muted-foreground">Community Deals</p>
            </div>
          </Link>
          <CardTitle>
            {mode === 'login' ? 'Welcome Back' : 'Join Our Community'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create an account to start finding deals or listing surplus'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection (Signup Only) */}
              {mode === 'signup' && (
                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['customer', 'merchant', 'ngo'] as UserRole[]).map((userRole) => (
                      <Button
                        key={userRole}
                        type="button"
                        variant={role === userRole ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRole(userRole)}
                        className="flex flex-col h-auto p-3 gap-1"
                      >
                        {getRoleIcon(userRole)}
                        <span className="capitalize text-xs">{userRole}</span>
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDescription(role)}
                  </p>
                </div>
              )}

              {/* Name (Signup Only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {role === 'ngo' ? 'Contact Name' : 'Full Name'}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Organization Name (NGO Only) */}
              {mode === 'signup' && role === 'ngo' && (
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Business Info (Merchant Only) */}
              {mode === 'signup' && role === 'merchant' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Business Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="retail">Retail & Shopping</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Terms & Conditions (Signup Only) */}
              {mode === 'signup' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              {/* Verification Notice (Signup for Merchant/NGO) */}
              {mode === 'signup' && (role === 'merchant' || role === 'ngo') && (
                <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded">
                  <p className="font-medium mb-1">Verification Required</p>
                  <p>
                    {role === 'merchant' 
                      ? 'Merchant accounts require admin verification before you can post deals.'
                      : 'NGO accounts require verification before you can access free donations.'
                    }
                  </p>
                </div>
              )}
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary hover:underline font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;