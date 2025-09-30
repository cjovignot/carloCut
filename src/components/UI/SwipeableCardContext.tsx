import { createContext, useContext, useState, ReactNode } from "react";

interface SwipeableCardContextType {
  openCardId: string | null;
  setOpenCardId: (id: string | null) => void;
}

const SwipeableCardContext = createContext<SwipeableCardContextType | undefined>(undefined);

export function SwipeableCardProvider({ children }: { children: ReactNode }) {
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  return (
    <SwipeableCardContext.Provider value={{ openCardId, setOpenCardId }}>
      {children}
    </SwipeableCardContext.Provider>
  );
}

export function useSwipeableCardContext() {
  const ctx = useContext(SwipeableCardContext);
  if (!ctx) throw new Error("useSwipeableCardContext must be used within SwipeableCardProvider");
  return ctx;
}