import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Search,
  Filter,
  CheckCircle,
  Heart,
  ShoppingCart,
  Globe,
  TrendingUp,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Slider,
} from "@/components/ui";
import { toast } from "sonner";

export default function Publishers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [minDA, setMinDA] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [doFollowOnly, setDoFollowOnly] = useState(false);

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

  const countries = ["all", "United States", "United Kingdom", "Canada", "Australia", "India", "Germany"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Publishers</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover high-quality publishers across all niches. Filter by DA, niche, price, and more.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Niches</SelectItem>
                  {niches?.map((niche) => (
                    <SelectItem key={niche._id} value={niche.name}>
                      {niche.name} ({niche.publisherCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={doFollowOnly ? "default" : "outline"}
                onClick={() => setDoFollowOnly(!doFollowOnly)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                DoFollow Only
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Min Domain Authority: {minDA}
                </label>
                <Slider
                  value={[minDA]}
                  onValueChange={(val) => setMinDA(val[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Price: ${maxPrice}
                </label>
                <Slider
                  value={[maxPrice]}
                  onValueChange={(val) => setMaxPrice(val[0])}
                  min={0}
                  max={1000}
                  step={50}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {publishers?.page.length || 0} publishers found
          </div>
        </div>

        {publishers?.page && publishers.page.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="text-muted-foreground text-xs">DA</div>
                        <div className="font-bold">{pub.domainAuthority}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">PA</div>
                        <div className="font-bold">{pub.pageAuthority}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Traffic</div>
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
              <h3 className="text-lg font-semibold mb-2">No publishers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
