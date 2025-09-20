import { useState, useEffect } from 'react';
import { Deal, DealFilters as DealFiltersType, DealCategory } from '@/types';
import { mockDeals, mockUserLocation } from '@/lib/mockData';
import DealCard from '@/components/DealCard';
import DealFilters from '@/components/DealFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Search, MapPin, TrendingUp, Clock } from 'lucide-react';

const Index = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filters, setFilters] = useState<DealFiltersType>({
    userLocation: mockUserLocation
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(deals);

  // Filter deals based on current filters and search
  useEffect(() => {
    let filtered = deals;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(query) ||
        deal.description.toLowerCase().includes(query) ||
        deal.merchant?.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(deal => deal.mainCategory === filters.category);
    }

    // Free only filter
    if (filters.freeOnly) {
      filtered = filtered.filter(deal => deal.dealPrice === 0);
    }

    // Distance filter
    if (filters.radius && filters.userLocation) {
      filtered = filtered.filter(deal => {
        const distance = calculateDistance(
          filters.userLocation!.lat,
          filters.userLocation!.lng,
          deal.location.lat,
          deal.location.lng
        );
        return distance <= filters.radius!;
      });
    }

    // Only show active deals
    filtered = filtered.filter(deal => deal.status === 'active' && deal.qtyRemaining > 0);

    setFilteredDeals(filtered);
  }, [deals, filters, searchQuery]);

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

  const stats = {
    totalDeals: deals.length,
    freeDeals: deals.filter(d => d.dealPrice === 0).length,
    activeMerchants: new Set(deals.map(d => d.merchantId)).size,
    totalSavings: deals.reduce((sum, d) => sum + (d.wasPrice - d.dealPrice), 0)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-primary text-primary-foreground rounded-xl p-3">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-foreground">Surplus & Local</h1>
                <p className="text-lg text-muted-foreground">Reducing waste, building community</p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Transform surplus into savings while fighting food waste! Connect with local merchants offering 
              incredible last-minute deals on fresh food, quality products, and essential services. Every purchase 
              helps reduce waste and supports your neighborhood businesses.
            </p>
            
            <div className="bg-card/50 border rounded-lg p-4 mb-8 max-w-xl mx-auto">
              <p className="text-base text-muted-foreground">
                🌱 <strong>For the Planet:</strong> Rescue perfectly good items from going to waste<br/>
                💰 <strong>For Your Wallet:</strong> Save up to 70% on original prices<br/>
                🤝 <strong>For the Community:</strong> Support local businesses and verified NGOs
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-2xl font-bold text-accent">{stats.totalDeals}</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-success" />
                  <span className="text-2xl font-bold text-success">{stats.freeDeals}</span>
                </div>
                <p className="text-sm text-muted-foreground">Free Donations</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-merchant" />
                  <span className="text-2xl font-bold text-merchant">{stats.activeMerchants}</span>
                </div>
                <p className="text-sm text-muted-foreground">Local Partners</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">₪</span>
                  <span className="text-2xl font-bold text-primary">{stats.totalSavings}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search deals, merchants, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <DealFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalDeals={deals.length}
          filteredCount={filteredDeals.length}
        />

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={!filters.category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
          >
            All Categories
          </Button>
          {(['food', 'retail', 'services'] as DealCategory[]).map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                category: prev.category === category ? undefined : category 
              }))}
              className="capitalize"
            >
              {category === 'food' && '🍞'} 
              {category === 'retail' && '🛍️'} 
              {category === 'services' && '🔧'} 
              {' '}{category}
            </Button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filters.freeOnly ? 'Free Donations' : 'Available Deals'}
            </h2>
            <p className="text-muted-foreground">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} available now
            </p>
          </div>
          
          {filteredDeals.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Updated in real-time</span>
            </div>
          )}
        </div>

        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                showDistance={Boolean(filters.userLocation)}
                userLocation={filters.userLocation}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? `No deals match "${searchQuery}". Try adjusting your search or filters.`
                : 'No deals match your current filters. Try adjusting your criteria.'
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setFilters({ userLocation: mockUserLocation });
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        {filteredDeals.length > 0 && (
          <div className="mt-12 text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">Are you a local business?</h3>
            <p className="text-muted-foreground mb-4">
              Join our community and turn your surplus inventory into community impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="merchant" asChild>
                <a href="/auth?mode=signup">Become a Merchant</a>
              </Button>
              <Button variant="ngo" asChild>
                <a href="/auth?mode=signup">Register as NGO</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;