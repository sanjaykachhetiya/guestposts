import { motion } from "framer-motion";
import { Link } from "react-router";
import { Package, Heart, ShoppingCart, TrendingUp, Globe, LogOut } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Card, CardContent, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

export default function Dashboard() {
  const user = useQuery(api.users.currentUser);
  const orders = useQuery(api.orders.getUserOrders);
  const wishlist = useQuery(api.wishlist.getWishlist);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-muted/30"
    >
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GuestPostHub</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your orders and track your link building campaigns</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{orders?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{wishlist?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Wishlist Items</div>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {orders?.filter((o) => o.status === "completed").length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order._creationTime).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${order.totalAmount}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm flex justify-between py-2 border-t">
                          <span>{item.publisherDomain}</span>
                          <span className="text-muted-foreground">
                            {item.quantity}x ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your backlink profile today
                  </p>
                  <Link to="/publishers">
                    <Button>Browse Publishers</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            {wishlist && wishlist.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.publisher?.domain}
                      </h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        DA: {item.publisher?.domainAuthority} | {item.publisher?.niche}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          ${item.publisher?.price}
                        </div>
                        <Link to="/publishers">
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No wishlist items</h3>
                  <p className="text-muted-foreground mb-6">
                    Save publishers for later
                  </p>
                  <Link to="/publishers">
                    <Button>Browse Publishers</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
