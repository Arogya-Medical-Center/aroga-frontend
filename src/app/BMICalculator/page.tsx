'use client';

import { useState } from 'react';

export default function BMICalculator() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');                 // Added
  const [sex, setSex] = useState<'male' | 'female' | ''>(''); // Added
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  const getAdultCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!h || !w || h <= 0 || w <= 0) return;

    const heightInMeters = h / 100;
    const bmiValue = w / (heightInMeters * heightInMeters);
    const rounded = parseFloat(bmiValue.toFixed(2));
    setBmi(rounded);

    // Interpretation based on age and sex
    if (!isNaN(a)) {
      if (a >= 20) {
        setCategory(getAdultCategory(bmiValue));
      } else if (a >= 2) {
        setCategory(
          sex
            ? 'Use BMI-for-age percentile (sex-specific). Refer to CDC/WHO growth charts.'
            : 'Enter sex to use BMI-for-age percentiles (CDC/WHO growth charts).'
        );
      } else {
        setCategory('BMI not used for children under 2 years.');
      }
    } else {
      // If age not provided, default to adult ranges
      setCategory(getAdultCategory(bmiValue));
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setAge('');     // Added
    setSex('');     // Added
    setBmi(null);
    setCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          BMI Calculator
        </h1>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age (years)
            </label>
            <input
              id="age"
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age in years"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
              Sex
            </label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value as 'male' | 'female' | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateBMI}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Calculate
            </button>
            <button
              onClick={resetCalculator}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {bmi !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your BMI Result</h2>
            <p className="text-3xl font-bold text-blue-600">{bmi}</p>
            <p className="text-lg text-gray-700 mt-2">
              Interpretation: <span className="font-semibold">{category}</span>
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Notes:</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>Adults (20+): Underweight &lt; 18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese ≥ 30.</li>
            <li>Ages 2–19: Use sex-specific BMI-for-age percentiles (CDC/WHO growth charts).</li>
            <li>Under 2 years: BMI is not used; refer to weight-for-length charts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}