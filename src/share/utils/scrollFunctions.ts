
export const scrollTop = (target?:HTMLElement) => {
    if (target) target.scroll({ top: 0, behavior: "smooth" });
    else window.scroll({ top: 0, behavior: "smooth" });
}