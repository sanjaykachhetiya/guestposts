import { motion } from "framer-motion";
import { Link } from "react-router";
import { CheckCircle, Globe, Zap, TrendingUp, Crown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Card, CardContent, Badge } from "@/components/ui";

export default function Packages() {
  const packages = useQuery(api.packages.list);

  const tierIcons = {
    basic: <Zap className="h-8 w-8 text-primary" />,
    standard: <TrendingUp className="h-8 w-8 text-primary" />,
    premium: <Crown className="h-8 w-8 text-primary" />,
    enterprise: <Globe className="h-8 w-8 text-primary" />,
  };

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
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Package
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect package for your link building needs. All packages include verified publishers and premium support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages?.map((pkg, i) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={pkg.tier === "premium" ? "lg:scale-105" : ""}
            >
              <Card className={`h-full ${pkg.tier === "premium" ? "border-primary" : ""}`}>
                <CardContent className="pt-6">
                  {pkg.tier === "premium" && (
                    <Badge className="mb-4">Most Popular</Badge>
                  )}

                  <div className="mb-4">{tierIcons[pkg.tier]}</div>

                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground">/package</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {pkg.credits} guest post credits
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/publishers">
                    <Button
                      className="w-full"
                      variant={pkg.tier === "premium" ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto bg-muted/50">
            <CardContent className="py-12 px-8">
              <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-muted-foreground mb-6">
                For larger campaigns or specific requirements, contact us for a custom package tailored to your needs.
              </p>
              <Button size="lg">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
