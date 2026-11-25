import { Session } from "@/types/types";

export const generateToken = (userId: string) => {
  const token: Session = {
    userId,
    createAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  };

  return JSON.stringify(token);
};
