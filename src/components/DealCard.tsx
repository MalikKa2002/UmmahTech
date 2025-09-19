import { Deal } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface DealCardProps {
  deal: Deal;
  showDistance?: boolean;
  userLocation?: { lat: number; lng: number };
}

const DealCard = ({ deal, showDistance = false, userLocation }: DealCardProps) => {
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = showDistance && userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lng, deal.location.lat, deal.location.lng)
    : null;

  const pickupTime = new Date(deal.pickupStart);
  const pickupEndTime = new Date(deal.pickupEnd);
  const isExpiringSoon = pickupEndTime.getTime() - Date.now() < 2 * 60 * 60 * 1000; // Less than 2 hours

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

  const getReasonColor = () => {
    switch (deal.reasonTag) {
      case 'near-expiry': return 'bg-warning/10 text-warning-foreground border-warning/20';
      case 'surplus': return 'bg-primary/10 text-primary border-primary/20';
      case 'overstock': return 'bg-secondary text-secondary-foreground border-secondary';
      case 'last-slot': return 'bg-accent/10 text-accent-foreground border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {deal.photoUrl && (
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img 
            src={deal.photoUrl} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
          {isExpiringSoon && (
            <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
              Expires Soon
            </Badge>
          )}
        </div>
      )}
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2">
            {deal.title}
          </h3>
          <div className="flex flex-col items-end gap-1 text-right min-w-0">
            <div className="flex items-center gap-1">
              {deal.dealPrice > 0 && deal.wasPrice > deal.dealPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₪{deal.wasPrice}
                </span>
              )}
              <span className={`font-bold text-lg ${deal.dealPrice === 0 ? 'text-success' : 'text-accent'}`}>
                {formatPrice(deal.dealPrice)}
              </span>
            </div>
            {deal.dealPrice === 0 && (
              <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                NGO Only
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {deal.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor()}>
            {deal.mainCategory}
          </Badge>
          <Badge variant="outline" className={getReasonColor()}>
            {deal.reasonTag.replace('-', ' ')}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatPickupTime()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate flex-1">{deal.merchant?.name}</span>
            {distance && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{deal.qtyRemaining} left</span>
            </div>
            {deal.viewCount && (
              <div className="flex items-center gap-1 text-xs">
                <Eye className="w-3 h-3" />
                <span>{deal.viewCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/deal/${deal.id}`} className="w-full">
          <Button 
            variant={deal.dealPrice === 0 ? "donation" : "claim"} 
            className="w-full"
            disabled={deal.qtyRemaining === 0}
          >
            {deal.qtyRemaining === 0 
              ? 'Sold Out' 
              : deal.dealPrice === 0 
                ? 'Claim Donation' 
                : 'View Deal'
            }
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DealCard;