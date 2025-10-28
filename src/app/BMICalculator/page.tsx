"use client";

import { useState } from "react";
import lmsData from "./percentiles/cdc_bmi_lms.json"; // sex-specific LMS by month
import BMIMeter from "../components/BMIMeter";

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<Sex>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [percentile, setPercentile] = useState<number | null>(null); // NEW

  type Sex = "male" | "female" | "";

  type LMS = { L: number; M: number; S: number };
  type LMSIndex = {
    male: Record<string, LMS>; // key: month as string "24"..."240"
    female: Record<string, LMS>;
  };

  // Normal CDF using an erf approximation
  function normalCDF(z: number) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const p =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  function interpolateLMS(sex: "male" | "female", months: number): LMS | null {
    const byMonth = (lmsData as LMSIndex)[sex];
    if (!byMonth) return null;
    const m = Math.max(24, Math.min(240, Math.round(months)));
    const key = String(m);
    if (byMonth[key]) return byMonth[key];

    // linear interpolate between nearest available months
    const keys = Object.keys(byMonth)
      .map(Number)
      .sort((a, b) => a - b);
    let lo = 24,
      hi = 240;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] <= m) lo = keys[i];
      if (keys[i] >= m) {
        hi = keys[i];
        break;
      }
    }
    const L0 = byMonth[String(lo)],
      L1 = byMonth[String(hi)];
    if (!L0 || !L1 || lo === hi) return L0 || L1 || null;
    const t = (m - lo) / (hi - lo);
    return {
      L: L0.L + t * (L1.L - L0.L),
      M: L0.M + t * (L1.M - L0.M),
      S: L0.S + t * (L1.S - L0.S),
    };
  }

  const getAdultCategory = (bmiValue: number) => {
    if (bmiValue < 16) return "Severe Thinness";
    if (bmiValue < 17) return "Moderate Thinness";
    if (bmiValue < 18.5) return "Mild Thinness";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    if (bmiValue < 35) return "Obese Class I";
    if (bmiValue < 40) return "Obese Class II";
    return "Obese Class III";
  };

  const getCategoryColor = (cat: string) => {
    if (cat.includes("Severe") || cat.includes("Class III"))
      return "bg-red-50 border-red-300 text-red-800";
    if (cat.includes("Moderate") || cat.includes("Class II"))
      return "bg-red-50 border-red-200 text-red-700";
    if (cat.includes("Mild") || cat.includes("Class I"))
      return "bg-orange-50 border-orange-200 text-orange-700";
    if (cat.includes("Normal") || cat.includes("Healthy"))
      return "bg-green-50 border-green-200 text-green-800";
    if (cat.includes("Overweight") || cat.includes("risk"))
      return "bg-orange-50 border-orange-300 text-orange-800";
    if (cat.includes("Underweight"))
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-blue-50 border-blue-200 text-blue-800";
  };

  const getChildPercentileAndCategory = (
    bmiValue: number,
    aYears: number,
    s: Sex
  ) => {
    const months = aYears * 12;
    const lms = s ? interpolateLMS(s, months) : null;
    if (!lms)
      return {
        percentile: null as number | null,
        childCat: "Enter sex (male/female) to compute BMI-for-age percentile",
      };

    const { L, M, S } = lms;
    const z =
      L !== 0
        ? (Math.pow(bmiValue / M, L) - 1) / (L * S)
        : Math.log(bmiValue / M) / S;
    const pct = normalCDF(z) * 100;

    let childCat = "";
    if (pct < 5) childCat = "Underweight (<5th percentile)";
    else if (pct < 85) childCat = "Healthy weight (5th–<85th percentile)";
    else if (pct < 95)
      childCat = "At risk of overweight (85th–<95th percentile)";
    else childCat = "Overweight (≥95th percentile)";

    return { percentile: pct, childCat: childCat };
  };

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      alert("Please enter valid values");
      return;
    }

    const bmiValue = w / (h / 100) ** 2;
    setBmi(bmiValue);

    const ageInYears = a;
    const isChild = ageInYears >= 2 && ageInYears < 20;

    if (isChild && sex) {
      const result = getChildPercentileAndCategory(bmiValue, ageInYears, sex);
      if (result) {
        setPercentile(result.percentile);
        setCategory(result.childCat); // Changed from result.category
      }
    } else {
      setCategory(getAdultCategory(bmiValue));
      setPercentile(null);
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setSex("");
    setBmi(null);
    setCategory("");
    setPercentile(null); // NEW
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b-2 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <rect x="7" y="5" width="10" height="4" rx="1" />
                <rect x="7" y="11" width="3" height="3" rx="0.5" />
                <rect x="11" y="11" width="3" height="3" rx="0.5" />
                <rect x="15" y="11" width="3" height="3" rx="0.5" />
                <rect x="7" y="16" width="3" height="3" rx="0.5" />
                <rect x="11" y="16" width="3" height="3" rx="0.5" />
                <rect x="15" y="16" width="3" height="3" rx="0.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                BMI Calculator
              </h1>
              <p className="text-sm text-gray-500">
                Calculate your Body Mass Index using WHO/CDC standards
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Age Input */}
            <div className="space-y-2">
              <label
                htmlFor="age"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  1
                </span>
                Age (years)
              </label>
              <input
                id="age"
                type="number"
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-500 placeholder:font-medium"
              />
            </div>

            {/* Sex Input */}
            <div className="space-y-2">
              <label
                htmlFor="sex"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  2
                </span>
                Sex
              </label>
              <select
                id="sex"
                value={sex}
                onChange={(e) =>
                  setSex(e.target.value as "male" | "female" | "")
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-400"
              >
                <option value="" className="text-gray-500">
                  Select sex
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <label
                htmlFor="height"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  3
                </span>
                Height (cm)
              </label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 170"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-500 placeholder:font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  cm
                </span>
              </div>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label
                htmlFor="weight"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  4
                </span>
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 placeholder:font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={calculateBMI}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Calculate BMI
            </button>
            <button
              onClick={resetCalculator}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Results Section */}
          {bmi !== null && (
            <div
              className={`border-2 rounded-2xl p-6 transition-all ${getCategoryColor(
                category
              )}`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-semibold mb-1">
                    Your BMI Result
                  </h2>
                  <p className="text-5xl font-bold">{bmi}</p>
                </div>
                <div className="flex-shrink-0">
                  <BMIMeter
                    bmi={bmi}
                    category={category}
                    age={parseFloat(age)}
                    percentile={percentile} // NEW
                  />
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm font-semibold mb-1">Category</p>
                <p className="text-lg font-bold">
                  {category}
                  {percentile != null
                    ? ` • Percentile: ${percentile.toFixed(1)}th`
                    : ""}
                </p>
              </div>
            </div>
          )}

          {/* Reference Tables */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {/* Adult Table */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                BMI Table for Adults (20+)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-red-50 border border-red-200 rounded-lg p-2.5">
                  <span className="font-semibold text-red-900">
                    Severe Thinness
                  </span>
                  <span className="text-red-700 font-medium">&lt; 16</span>
                </div>
                <div className="flex justify-between bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                  <span className="font-semibold text-orange-900">
                    Moderate Thinness
                  </span>
                  <span className="text-orange-700 font-medium">16 - 17</span>
                </div>
                <div className="flex justify-between bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <span className="font-semibold text-amber-900">
                    Mild Thinness
                  </span>
                  <span className="text-amber-700 font-medium">17 - 18.5</span>
                </div>
                <div className="flex justify-between bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <span className="font-semibold text-green-900">Normal</span>
                  <span className="text-green-700 font-medium">18.5 - 25</span>
                </div>
                <div className="flex justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                  <span className="font-semibold text-yellow-900">
                    Overweight
                  </span>
                  <span className="text-yellow-700 font-medium">25 - 30</span>
                </div>
                <div className="flex justify-between bg-orange-100 border border-orange-300 rounded-lg p-2.5">
                  <span className="font-semibold text-orange-900">
                    Obese Class I
                  </span>
                  <span className="text-orange-800 font-medium">30 - 35</span>
                </div>
                <div className="flex justify-between bg-red-100 border border-red-300 rounded-lg p-2.5">
                  <span className="font-semibold text-red-900">
                    Obese Class II
                  </span>
                  <span className="text-red-800 font-medium">35 - 40</span>
                </div>
                <div className="flex justify-between bg-red-200 border border-red-400 rounded-lg p-2.5">
                  <span className="font-semibold text-red-950">
                    Obese Class III
                  </span>
                  <span className="text-red-900 font-medium">&gt; 40</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 italic font-medium">
                WHO recommended classification for adults
              </p>
            </div>

            {/* Children & Teens Table */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                BMI for Children & Teens (2-20)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <span className="font-semibold text-amber-900">
                    Underweight
                  </span>
                  <span className="text-amber-700 font-medium">
                    &lt; 5th percentile
                  </span>
                </div>
                <div className="flex justify-between bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <span className="font-semibold text-green-900">
                    Healthy weight
                  </span>
                  <span className="text-green-700 font-medium">
                    5th - 85th percentile
                  </span>
                </div>
                <div className="flex justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                  <span className="font-semibold text-yellow-900">
                    At risk of overweight
                  </span>
                  <span className="text-yellow-700 font-medium">
                    85th - 95th percentile
                  </span>
                </div>
                <div className="flex justify-between bg-red-100 border border-red-300 rounded-lg p-2.5">
                  <span className="font-semibold text-red-900">Overweight</span>
                  <span className="text-red-800 font-medium">
                    &gt; 95th percentile
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 italic font-medium">
                CDC recommends BMI-for-age percentiles (sex-specific). Refer to
                growth charts for accurate classification.
              </p>
              <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-xs text-blue-900 font-semibold">
                  ⚠️ Note: For ages 2-20, percentile calculations require
                  sex-specific growth chart data. Consult a healthcare provider
                  for accurate assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
