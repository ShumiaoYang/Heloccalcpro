/**
 * Life Cost Translator
 * 生活成本翻译器 - 将抽象的金额映射为日常消费场景
 */

/**
 * Translate a dollar amount into relatable everyday expenses
 *
 * @param amount - Dollar amount to translate
 * @returns A relatable comparison string
 */
export function translateToLifeCost(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount < 20) {
    return 'less than a couple of coffee runs';
  }

  if (absAmount < 40) {
    return 'about the cost of a few coffee runs';
  }

  if (absAmount < 70) {
    return 'roughly the cost of a family dinner out';
  }

  if (absAmount < 100) {
    return 'about the cost of a nice dinner for two';
  }

  if (absAmount < 150) {
    return 'roughly a week of groceries';
  }

  if (absAmount < 250) {
    return 'about the cost of a monthly streaming bundle and utilities';
  }

  if (absAmount < 500) {
    return 'roughly a car payment or two weeks of groceries';
  }

  return 'a significant monthly expense';
}

/**
 * Create a full sentence explaining the payment change in life terms
 *
 * @param paymentIncrease - Monthly payment increase amount
 * @returns A complete sentence with context
 */
export function explainPaymentChange(paymentIncrease: number): string {
  const lifeCost = translateToLifeCost(paymentIncrease);
  const formattedAmount = `$${Math.abs(paymentIncrease).toFixed(2)}`;

  if (paymentIncrease > 0) {
    return `A ${formattedAmount} increase is ${lifeCost}. While manageable, we recommend building a small buffer into your budget.`;
  } else if (paymentIncrease < 0) {
    return `A ${formattedAmount} decrease means ${lifeCost} back in your pocket each month—a meaningful improvement to your cash flow.`;
  } else {
    return 'Your payment remains unchanged in this scenario.';
  }
}
