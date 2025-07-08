import { listDisposableDomain } from "@/constants/disposable-blocklist";

export const isDisposableEmail = async (email: string) => {
  if (!email) return false;

  const blockList = listDisposableDomain;

  if (!blockList) return false;

  return blockList.includes(email.split('@')[1]);
};
