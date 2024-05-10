export function formatToken(input: string) {
  if (!input) return;

  const firstFour = input.substring(0, 3);
  const lastFour = input.substring(input.length - 3);

  return `${firstFour}...${lastFour}`;
}

export const getExpiryDate = (daysToAdd?: string) => {
  const regex = /^(\d+)d$/;
  const match = daysToAdd?.match(regex);

  if (!daysToAdd || !match) return undefined;

  const days = parseInt(match[1], 10);

  const newDate = new Date();

  newDate.setDate(newDate.getDate() + days);

  return newDate;
};
