const params = new URLSearchParams(window.location.search);
const key = params.get("key");
const root = document.getElementById("printRoot");
const printButton = document.getElementById("printPdfButton");

if (key) {
  const stored = localStorage.getItem(key);
  if (stored) {
    root.innerHTML = stored;
    localStorage.removeItem(key);
  }
}

if (printButton) {
  printButton.addEventListener("click", () => {
    window.focus();
    window.print();
  });
}
