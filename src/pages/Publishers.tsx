import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Search,
  Filter,
  CheckCircle,
  Heart,
  ShoppingCart,
  Globe,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Button,
  Card,
  CardContent,
  Input,
  Badge,
  Slider,
  Checkbox,
  Separator,
} from "@/components/ui";
import { toast } from "sonner";

export default function Publishers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [minDA, setMinDA] = useState(0);
  const [maxDA, setMaxDA] = useState(100);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [doFollowOnly, setDoFollowOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Collapsible sections state
  const [nicheExpanded, setNicheExpanded] = useState(true);
  const [countryExpanded, setCountryExpanded] = useState(true);
  const [daExpanded, setDaExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const niches = useQuery(api.niches.list);
  const publishers = useQuery(api.publishers.list, {
    paginationOpts: { numItems: 50, cursor: null },
    niche: selectedNiche,
    minDA,
    maxPrice,
    doFollow: doFollowOnly ? true : undefined,
    searchQuery: searchQuery || undefined,
  });

  const addToCart = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);

  const handleAddToCart = async (publisherId: any) => {
    try {
      await addToCart({ publisherId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (publisherId: any) => {
    try {
      await addToWishlist({ publisherId });
      toast.success("Added to wishlist!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to wishlist");
    }
  };

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "India",
    "Germany",
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedNiche("all");
    setSelectedCountry("all");
    setMinDA(0);
    setMaxDA(100);
    setMinPrice(0);
    setMaxPrice(1000);
    setDoFollowOnly(false);
    setVerifiedOnly(false);
    setFeaturedOnly(false);
  };

  const activeFiltersCount = [
    selectedNiche !== "all",
    selectedCountry !== "all",
    minDA > 0,
    maxDA < 100,
    minPrice > 0,
    maxPrice < 1000,
    doFollowOnly,
    verifiedOnly,
    featuredOnly,
  ].filter(Boolean).length;

  // Sidebar Filter Component
  const FilterSection = ({
    title,
    expanded,
    setExpanded,
    children,
  }: {
    title: string;
    expanded: boolean;
    setExpanded: (val: boolean) => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-sm font-semibold mb-3 hover:text-primary transition-colors"
      >
        {title}
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const SidebarFilters = () => (
    <div className="h-full overflow-y-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full mb-6"
        >
          Clear All Filters
        </Button>
      )}

      {/* Niche Filter */}
      <FilterSection
        title="Category / Niche"
        expanded={nicheExpanded}
        setExpanded={setNicheExpanded}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
            <Checkbox
              checked={selectedNiche === "all"}
              onCheckedChange={() => setSelectedNiche("all")}
            />
            <span className="text-sm flex-1">All Niches</span>
            <span className="text-xs text-muted-foreground">
              {publishers?.page.length || 0}
            </span>
          </label>
          {niches?.map((niche) => (
            <label
              key={niche._id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
            >
              <Checkbox
                checked={selectedNiche === niche.name}
                onCheckedChange={() =>
                  setSelectedNiche(
                    selectedNiche === niche.name ? "all" : niche.name
                  )
                }
              />
              <span className="text-sm flex-1">
                {niche.icon} {niche.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {niche.publisherCount}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Country Filter */}
      <FilterSection
        title="Country"
        expanded={countryExpanded}
        setExpanded={setCountryExpanded}
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
            <Checkbox
              checked={selectedCountry === "all"}
              onCheckedChange={() => setSelectedCountry("all")}
            />
            <span className="text-sm">All Countries</span>
          </label>
          {countries.map((country) => (
            <label
              key={country}
              className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
            >
              <Checkbox
                checked={selectedCountry === country}
                onCheckedChange={() =>
                  setSelectedCountry(
                    selectedCountry === country ? "all" : country
                  )
                }
              />
              <span className="text-sm">{country}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Domain Authority Filter */}
      <FilterSection
        title="Domain Authority (DA)"
        expanded={daExpanded}
        setExpanded={setDaExpanded}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Min: {minDA}</span>
              <span className="text-xs text-muted-foreground">Max: {maxDA}</span>
            </div>
            <div className="space-y-3">
              <Slider
                value={[minDA]}
                onValueChange={(val) => setMinDA(val[0])}
                min={0}
                max={100}
                step={5}
                className="mb-2"
              />
              <Slider
                value={[maxDA]}
                onValueChange={(val) => setMaxDA(val[0])}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>
          {/* Quick DA Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={minDA === 20 && maxDA === 40 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinDA(20);
                setMaxDA(40);
              }}
            >
              20-40
            </Button>
            <Button
              variant={minDA === 40 && maxDA === 60 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinDA(40);
                setMaxDA(60);
              }}
            >
              40-60
            </Button>
            <Button
              variant={minDA === 60 && maxDA === 80 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinDA(60);
                setMaxDA(80);
              }}
            >
              60-80
            </Button>
            <Button
              variant={minDA === 80 && maxDA === 100 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinDA(80);
                setMaxDA(100);
              }}
            >
              80+
            </Button>
          </div>
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price Range"
        expanded={priceExpanded}
        setExpanded={setPriceExpanded}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Min: ${minPrice}
              </span>
              <span className="text-xs text-muted-foreground">
                Max: ${maxPrice}
              </span>
            </div>
            <div className="space-y-3">
              <Slider
                value={[minPrice]}
                onValueChange={(val) => setMinPrice(val[0])}
                min={0}
                max={1000}
                step={25}
                className="mb-2"
              />
              <Slider
                value={[maxPrice]}
                onValueChange={(val) => setMaxPrice(val[0])}
                min={0}
                max={1000}
                step={25}
              />
            </div>
          </div>
          {/* Quick Price Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={minPrice === 0 && maxPrice === 100 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(100);
              }}
            >
              Under $100
            </Button>
            <Button
              variant={minPrice === 100 && maxPrice === 300 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinPrice(100);
                setMaxPrice(300);
              }}
            >
              $100-$300
            </Button>
            <Button
              variant={minPrice === 300 && maxPrice === 500 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinPrice(300);
                setMaxPrice(500);
              }}
            >
              $300-$500
            </Button>
            <Button
              variant={minPrice === 500 && maxPrice === 1000 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMinPrice(500);
                setMaxPrice(1000);
              }}
            >
              $500+
            </Button>
          </div>
        </div>
      </FilterSection>

      {/* Features Filter */}
      <FilterSection
        title="Features"
        expanded={featuresExpanded}
        setExpanded={setFeaturesExpanded}
      >
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
            <Checkbox
              checked={doFollowOnly}
              onCheckedChange={(checked) =>
                setDoFollowOnly(checked as boolean)
              }
            />
            <div className="flex-1">
              <div className="text-sm font-medium">DoFollow Links</div>
              <div className="text-xs text-muted-foreground">
                Only show DoFollow backlinks
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
            <Checkbox
              checked={verifiedOnly}
              onCheckedChange={(checked) =>
                setVerifiedOnly(checked as boolean)
              }
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Verified Publishers</div>
              <div className="text-xs text-muted-foreground">
                Manually verified sites
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
            <Checkbox
              checked={featuredOnly}
              onCheckedChange={(checked) =>
                setFeaturedOnly(checked as boolean)
              }
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Featured Only</div>
              <div className="text-xs text-muted-foreground">
                Top quality publishers
              </div>
            </div>
          </label>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-muted/30"
    >
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GuestPostHub</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Publishers</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover high-quality publishers across all niches. Use filters to
            find the perfect match.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-4 left-4 z-40 shadow-lg"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          {/* Left Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden">
              <SidebarFilters />
            </Card>
          </aside>

          {/* Left Sidebar - Mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                />
                {/* Sidebar */}
                <motion.aside
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-50 lg:hidden overflow-y-auto"
                >
                  <SidebarFilters />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by domain name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedNiche !== "all" && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedNiche("all")}
                  >
                    {selectedNiche}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {selectedCountry !== "all" && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedCountry("all")}
                  >
                    {selectedCountry}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {(minDA > 0 || maxDA < 100) && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setMinDA(0);
                      setMaxDA(100);
                    }}
                  >
                    DA: {minDA}-{maxDA}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {(minPrice > 0 || maxPrice < 1000) && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(1000);
                    }}
                  >
                    ${minPrice}-${maxPrice}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {doFollowOnly && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setDoFollowOnly(false)}
                  >
                    DoFollow Only
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {verifiedOnly && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setVerifiedOnly(false)}
                  >
                    Verified
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {featuredOnly && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setFeaturedOnly(false)}
                  >
                    Featured
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold">{publishers?.page.length || 0}</span> publishers
              </div>
            </div>

            {/* Publishers Grid */}
            {publishers?.page && publishers.page.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {publishers.page.map((pub, i) => (
                  <motion.div
                    key={pub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1 truncate">
                              {pub.domain}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary">{pub.niche}</Badge>
                              {pub.doFollow && (
                                <Badge variant="default">DoFollow</Badge>
                              )}
                            </div>
                          </div>
                          {pub.verified && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                          <div>
                            <div className="text-muted-foreground text-xs">
                              DA
                            </div>
                            <div className="font-bold">
                              {pub.domainAuthority}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">
                              PA
                            </div>
                            <div className="font-bold">{pub.pageAuthority}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">
                              Traffic
                            </div>
                            <div className="font-bold">
                              {(pub.monthlyTraffic / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-2xl font-bold text-primary">
                            ${pub.price}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAddToWishlist(pub._id)}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(pub._id)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No publishers found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
