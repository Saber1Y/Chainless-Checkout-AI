import { Magic } from "magic-sdk";
import { config } from "@/config";

let magicInstance: Magic | null = null;

export function getMagic(): Magic {
  if (typeof window === "undefined") {
    throw new Error("Magic SDK can only be used in the browser");
  }
  if (!magicInstance) {
    magicInstance = new Magic(config.magic.apiKey, {
      network: {
        rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
        chainId: 421614,
      },
    });
  }
  return magicInstance;
}

export async function loginWithSocial(provider: "google" | "email") {
  const magic = getMagic();
  if (provider === "google") {
    await magic.wallet.connectWithUI();
  }
}

export async function loginWithEmail(email: string) {
  const magic = getMagic();
  await magic.auth.loginWithEmailOTP({ email });
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const magic = getMagic();
    const info = await magic.user.getInfo();
    return info.publicAddress || null;
  } catch {
    return null;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const magic = getMagic();
    return await magic.user.isLoggedIn();
  } catch {
    return false;
  }
}

export async function logout() {
  try {
    const magic = getMagic();
    await magic.user.logout();
  } catch (e) {
    console.error("Logout error:", e);
  }
}

export async function signEIP7702Authorization(
  contractAddress: string,
  chainId: number
) {
  const magic = getMagic();
  return magic.wallet.sign7702Authorization({
    contractAddress,
    chainId,
  });
}
