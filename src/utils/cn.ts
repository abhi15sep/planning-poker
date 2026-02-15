type ClassValue = string | boolean | undefined | null | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ')
}
