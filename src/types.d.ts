interface Window {
  __wsEngine?: boolean;
  __wsReady?: boolean;
  __ws?: {
    gsap: typeof import("gsap").gsap;
    ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
    lenis: unknown;
    splitWords: (el: HTMLElement) => NodeListOf<HTMLElement>;
  };
}
