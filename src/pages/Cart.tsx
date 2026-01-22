import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag, Globe } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Card, CardContent } from "@/components/ui";
import { toast } from "sonner";

export default function Cart() {
  const navigate = useNavigate();
  const cartItems = useQuery(api.cart.getCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const createOrder = useMutation(api.orders.createOrder);

  const total = cartItems?.reduce(
    (sum, item) => sum + (item.publisher?.price || 0) * item.quantity,
    0
  ) || 0;

  const handleUpdateQuantity = async (cartId: any, newQuantity: number) => {
    try {
      await updateQuantity({ cartId, quantity: newQuantity });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemove = async (cartId: any) => {
    try {
      await removeFromCart({ cartId });
      toast.success("Removed from cart");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderId = await createOrder({});
      toast.success("Order created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
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
            <Link to="/publishers">
              <Button variant="ghost" size="sm">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.publisher?.domain}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          DA: {item.publisher?.domainAuthority} | {item.publisher?.niche}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-xl font-bold text-primary w-24 text-right">
                        ${(item.publisher?.price || 0) * item.quantity}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(item._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-semibold">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Payment will be processed after order review
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add some publishers to get started
              </p>
              <Link to="/publishers">
                <Button>Browse Publishers</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
