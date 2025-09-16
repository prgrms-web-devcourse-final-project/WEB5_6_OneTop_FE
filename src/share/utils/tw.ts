import {twMerge, type ClassNameValue} from 'tailwind-merge';
import {clsx} from 'clsx';

export default function tw(...arg: ClassNameValue[]) {
  return twMerge(clsx(arg))
}