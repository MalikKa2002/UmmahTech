import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Eye, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { mockDeals, mockCurrentUser } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import QRCode from 'qrcode';

const DealDetail = () => {
  const { id } = useParams();
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);
  
  const deal = mockDeals.find(d => d.id === id);
  const user = mockCurrentUser;

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Deal Not Found</h1>
          <Link to="/">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pickupTime = new Date(deal.pickupStart);
  const pickupEndTime = new Date(deal.pickupEnd);
  const isExpiringSoon = pickupEndTime.getTime() - Date.now() < 2 * 60 * 60 * 1000;
  const canClaim = deal.qtyRemaining > 0 && pickupEndTime.getTime() > Date.now();

  const handleClaim = async () => {
    if (!user) {
      // Redirect to auth
      return;
    }
    
    // Generate QR code
    const qrData = `DL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    setQRCodeData(qrCodeUrl);
    setIsClaimModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₪${price}`;
  };

  const formatPickupTime = () => {
    const start = pickupTime.toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' });
    const end = pickupEndTime.toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' });
    return `${start}–${end}`;
  };

  const getCategoryColor = () => {
    switch (deal.mainCategory) {
      case 'food': return 'bg-success/10 text-success border-success/20';
      case 'retail': return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'services': return 'bg-merchant/10 text-merchant border-merchant/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </Link>
        {isExpiringSoon && (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expires Soon
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Deal Image & Basic Info */}
        <div className="space-y-6">
          {deal.photoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={deal.photoUrl} 
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Price & Availability */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {deal.dealPrice > 0 && deal.wasPrice > deal.dealPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        ₪{deal.wasPrice}
                      </span>
                    )}
                    <span className={`text-3xl font-bold ${
                      deal.dealPrice === 0 ? 'text-success' : 'text-accent'
                    }`}>
                      {formatPrice(deal.dealPrice)}
                    </span>
                  </div>
                  {deal.dealPrice === 0 && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      NGO Only
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="w-5 h-5" />
                    <span>{deal.qtyRemaining} left</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {deal.qtyTotal} total
                  </div>
                </div>
              </div>

              {canClaim && user ? (
                <Button 
                  variant={deal.dealPrice === 0 ? "donation" : "claim"} 
                  size="lg"
                  className="w-full"
                  onClick={handleClaim}
                  disabled={deal.dealPrice === 0 && user.role !== 'ngo'}
                >
                  {deal.dealPrice === 0 
                    ? user.role === 'ngo' 
                      ? 'Claim Donation' 
                      : 'NGO Only'
                    : 'Claim Deal'
                  }
                </Button>
              ) : !user ? (
                <Link to="/auth?mode=signup" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Sign Up to Claim
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="lg" className="w-full" disabled>
                  {deal.qtyRemaining === 0 ? 'Sold Out' : 'Expired'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Deal Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{deal.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{deal.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className={getCategoryColor()}>
                {deal.mainCategory}
              </Badge>
              <Badge variant="outline">
                {deal.reasonTag.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pickup Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Today, {formatPickupTime()}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{deal.merchant?.name}</div>
                  <div className="text-sm text-muted-foreground">{deal.location.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Safety (if applicable) */}
          {deal.foodSafety && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Food Safety Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Proper packaging verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Temperature: {deal.foodSafety.temperatureBand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Use by: {new Date(deal.foodSafety.useByDate).toLocaleDateString()}</span>
                </div>
                {deal.foodSafety.allergens.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>Allergens: {deal.foodSafety.allergens.join(', ')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Merchant Information */}
          <Card>
            <CardHeader>
              <CardTitle>About the Merchant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-merchant/10 rounded-full flex items-center justify-center">
                  <span className="text-merchant font-semibold">
                    {deal.merchant?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {deal.merchant?.name}
                    {deal.merchant?.verified && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {deal.merchant?.category} merchant
                  </div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {deal.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{deal.viewCount} views</span>
                  </div>
                )}
                <div>
                  Member since {new Date(deal.merchant?.createdAt || '').getFullYear()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;