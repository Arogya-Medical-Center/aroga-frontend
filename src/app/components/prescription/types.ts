export type Range = {
  min?: number;
  max?: number;
};

export type DosageRuleBase = {
  amount: number; // amount per kg or fixed amount
  unit: string; // e.g., mg, ml
  frequency?: string; // e.g., OD, BID, TDS
  ageRange?: Range; // years
  weightRange?: Range; // kg
};

export type DosageRule =
  | ({ type: "perKg" } & DosageRuleBase)
  | ({ type: "fixed" } & DosageRuleBase);

export type IllnessMapping = {
  id: string;
  illness: string;
  // each mapped drug can have multiple rules (different age/weight ranges)
  drugs: Array<{ drugId: string; rules: DosageRule[] }>;
};
