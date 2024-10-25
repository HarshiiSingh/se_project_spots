export function setLoadingText(isLoading, btn, defaultText = "Save", loadingText = "Saving...") {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}