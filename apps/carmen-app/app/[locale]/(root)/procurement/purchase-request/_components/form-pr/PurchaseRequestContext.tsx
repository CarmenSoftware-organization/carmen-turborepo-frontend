import { createContext, useContext } from "react";
import { useMainFormLogic } from "../../_hooks/use-main-form-logic";

type PurchaseRequestContextType = ReturnType<typeof useMainFormLogic>;

const PurchaseRequestContext = createContext<PurchaseRequestContextType | null>(null);

export const usePurchaseRequestContext = () => {
  const context = useContext(PurchaseRequestContext);
  if (!context) {
    throw new Error("usePurchaseRequestContext must be used within a PurchaseRequestProvider");
  }
  return context;
};

export const PurchaseRequestProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PurchaseRequestContextType;
}) => {
  return (
    <PurchaseRequestContext.Provider value={value}>{children}</PurchaseRequestContext.Provider>
  );
};
