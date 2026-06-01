type Session = {
  userId: string;
  companyId: string;
};

export async function getCurrentSession(): Promise<Session | null> {
  // Challenge mock: replace with real auth/session provider in production.
  return {
    userId: "admin-1",
    companyId: "TechCorp",
  };
}
