let clickCount = 0;
let clickTimer = null;
let headerImage = document.getElementById("headerImage");
let triggered = false;

if (headerImage) {
    headerImage.addEventListener("click", () => {
        if (clickTimer) clearTimeout(clickTimer);
        clickCount++;
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);
        if (clickCount === 7) {
            triggered = true;
            print("OK")
            clickCount = 0;
        }
    });
}

let searchInput = document.querySelector(".search-input");

if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && triggered) {
            let value = searchInput.value.trim().toLowerCase();
            if (value === "rick") {
                window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
                triggered = false;
            }
        }
    });
}
