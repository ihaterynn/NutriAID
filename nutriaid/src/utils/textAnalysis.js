import harmfulIngredients from '../data/harmful_ingredients.json';

export const analyzeIngredients = (text, healthConditions, weightGoal) => {
  // Split the text by commas and new lines, then trim and filter out empty strings
  const ingredients = text.split(/[,\n]/)
                          .map(i => i.trim())
                          .filter(i => i)
                          .map(i => i.split(' ').slice(0, 3).join(' ')); // Take only first 3 words max
  
  let potentialHarmWarnings = [];
  let conditionWarnings = [];
  let mainReason = '';

  ingredients.forEach(ingredient => {
    const harmful = harmfulIngredients.find(h => 
      ingredient.toLowerCase().includes(h.ingredient.toLowerCase()) && 
      (h.harmful_for === 'all' || healthConditions.includes(h.harmful_for))
    );

    if (harmful) {
      potentialHarmWarnings.push(ingredient);
      if (harmful.harmful_for !== 'all' && !mainReason) {
        mainReason = `not suitable for people with ${harmful.harmful_for}`;
      }
    }
  });

  if (!mainReason && potentialHarmWarnings.length > 0) {
    mainReason = 'contains potentially harmful ingredients';
  }

  const result = potentialHarmWarnings.length === 0 ? "Yes" : "No";

  return {
    result,
    potentialHarmWarnings,
    conditionWarnings,
    mainReason
  };
};

export const checkCalories = (text, weightGoal) => {
  const calorieMatch = text.match(/calories\s*(\d+)/i);
  if (calorieMatch) {
    const calories = parseInt(calorieMatch[1], 10);
    if (calories > 200 && (weightGoal === 'maintain' || weightGoal === 'lose')) {
      return 'exceeds recommended calorie levels';
    } else if (calories <= 200 && weightGoal === 'gain') {
      return 'below recommended calorie levels';
    }
  }
  return null;
};