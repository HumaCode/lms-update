(function () {
    if (typeof window === 'undefined') return;

    let dotEl = document.getElementById("pointer-dot");
    let ringEl = document.getElementById("pointer-ring");

    if (!dotEl) {
        dotEl = document.createElement("div");
        dotEl.id = "pointer-dot";
        document.body.appendChild(dotEl);
    }
    if (!ringEl) {
        ringEl = document.createElement("div");
        ringEl.id = "pointer-ring";
        document.body.appendChild(ringEl);
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isMouseDown = false;
    let isVisible = false;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            document.body.classList.add("has-custom-pointer");
        }
    });

    window.addEventListener("mousedown", () => {
        isMouseDown = true;
    });

    window.addEventListener("mouseup", () => {
        isMouseDown = false;
    });

    document.addEventListener("mouseleave", () => {
        isVisible = false;
        document.body.classList.remove("has-custom-pointer");
    });

    function render() {
        if (isVisible) {
            ringX = lerp(ringX, mouseX, 0.25);
            ringY = lerp(ringY, mouseY, 0.25);

            if (dotEl) {
                dotEl.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
                dotEl.style.opacity = "1";
            }
            if (ringEl) {
                const size = isMouseDown ? 24 : 32;
                const offset = size / 2;
                ringEl.style.width = `${size}px`;
                ringEl.style.height = `${size}px`;
                ringEl.style.transform = `translate3d(${ringX - offset}px, ${ringY - offset}px, 0)`;
                ringEl.style.opacity = "1";
            }
        } else {
            if (dotEl) dotEl.style.opacity = "0";
            if (ringEl) ringEl.style.opacity = "0";
        }
        requestAnimationFrame(render);
    }

    window.init_pointer = function (options) {
        // Compatibility wrapper for legacy calls
    };

    requestAnimationFrame(render);
})();