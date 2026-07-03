"use client";

import { useAuth } from "@/components/MagicAuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMagic } from "@/lib/magic";

export function MagicLoginButton() {
  const { address, isAuthenticated, isLoading, refresh, logout } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const magic = getMagic();
      await magic.wallet.connectWithUI();
      await refresh();
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  if (isLoading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (isAuthenticated && address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {shortAddress}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs text-muted-foreground">
            Wallet ready
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs text-muted-foreground">
            Powered by Magic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleGoogleLogin}>
      Continue with Google
    </Button>
  );
}
