
export function changeDateFormat(data: string[]): string[] {
  return data.map((date) => {
    const newDate = date.split('-');
    return `${newDate[2]}/${newDate[1]}`
  });
}

export function splitTimeFromDate(data: string[]): string[] { 
  return data.map((date) => date.split('T')[1]);
}

export function roundTheNumbers(data: number[]): number[] {
  return data.map((number) => Math.round(number));
}