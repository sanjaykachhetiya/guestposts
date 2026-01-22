import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const featuredPublishers = useQuery(api.publishers.getFeatured);
  const stats = useQuery(api.publishers.getStats);
  const reviews = useQuery(api.reviews.getApproved, { limit: 3 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GuestPostHub</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/publishers" className="text-sm font-medium hover:text-primary transition-colors">
                Publishers
              </Link>
              <Link to="/packages" className="text-sm font-medium hover:text-primary transition-colors">
                Packages
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              Trusted by 5000+ Businesses
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Premium Guest Post
            <br />
            <span className="text-primary">Link Building Platform</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Access {stats?.total || "50,000"}+ verified publishers across all niches. Build high-quality backlinks that drive real results.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/publishers">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Publishers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/packages">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Packages
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stats?.total || 0}</div>
                <div className="text-sm text-muted-foreground">Publishers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stats?.verified || 0}</div>
                <div className="text-sm text-muted-foreground">Verified Sites</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">99%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose GuestPostHub?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to scale your link building campaigns effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-10 w-10 text-primary" />,
                title: "Niche-Specific Sites",
                description: "Find publishers in your exact industry with advanced filtering by niche, DA, and more",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-primary" />,
                title: "100% Verified",
                description: "All publishers are manually verified for quality, traffic, and authenticity",
              },
              {
                icon: <Zap className="h-10 w-10 text-primary" />,
                title: "Fast Turnaround",
                description: "Get your guest posts published in 3-14 days with our streamlined process",
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-primary" />,
                title: "Transparent Metrics",
                description: "See DA, PA, traffic, spam score and more before making a decision",
              },
              {
                icon: <ShoppingCart className="h-10 w-10 text-primary" />,
                title: "Easy Ordering",
                description: "Add to cart, checkout, and track your orders all in one platform",
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "White Label Options",
                description: "Perfect for agencies looking to offer guest posting services to clients",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publishers */}
      {featuredPublishers && featuredPublishers.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Publishers
              </h2>
              <p className="text-muted-foreground text-lg">
                Hand-picked high-quality sites available now
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPublishers.slice(0, 6).map((pub, i) => (
                <motion.div
                  key={pub._id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{pub.domain}</h3>
                          <Badge variant="secondary">{pub.niche}</Badge>
                        </div>
                        {pub.verified && (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Domain Authority</div>
                          <div className="text-lg font-bold">{pub.domainAuthority}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Monthly Traffic</div>
                          <div className="text-lg font-bold">{(pub.monthlyTraffic / 1000).toFixed(0)}K</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">${pub.price}</div>
                        <Link to="/publishers">
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/publishers">
                <Button size="lg" variant="outline">
                  View All Publishers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {reviews && reviews.length > 0 && (
        <section className="py-20 bg-muted/50 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Clients Say
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
                <span className="text-muted-foreground">from 500+ reviews</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{review.userName}</div>
                          <div className="text-sm text-muted-foreground">Verified Customer</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-16 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Boost Your SEO?
              </h2>
              <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of businesses that trust us for their link building needs
              </p>
              <Link to="/publishers">
                <Button size="lg" variant="secondary" className="text-lg">
                  Start Building Links Today <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">GuestPostHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium guest post and link building platform for businesses and agencies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/publishers" className="hover:text-primary transition-colors">Guest Posting</Link></li>
                <li><Link to="/publishers" className="hover:text-primary transition-colors">Niche Edits</Link></li>
                <li><Link to="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 GuestPostHub. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
