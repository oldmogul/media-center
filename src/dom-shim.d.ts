interface Element {
  hidden: boolean;
  disabled: boolean;
  value: string;
  checked: boolean;
  src: string;
  href: string;
  placeholder: string;
  style: CSSStyleDeclaration;
  offsetWidth: number;
  reset(): void;
  reportValidity(): boolean;
}

interface EventTarget {
  closest(selector: string): Element | null;
  value: string;
  classList: DOMTokenList;
  textContent: string | null;
  reset(): void;
  checked: boolean;
}

interface HTMLElement {
  src: string;
  href: string;
  value: string;
  checked: boolean;
  placeholder: string;
}

