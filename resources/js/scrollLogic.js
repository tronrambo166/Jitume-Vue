export function scrollLeft(ref) {
    ref.scrollBy({
        left: -100,
        behavior: 'smooth'
    });
}

export function scrollRight(ref) {
    ref.scrollBy({
        left: 100,
        behavior: 'smooth'
    });
}
