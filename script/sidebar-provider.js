(function () {
  const vscode = acquireVsCodeApi();
  document
    .getElementById("trigger-generate-migration-button")
    .addEventListener("click", () => {
      vscode.postMessage({
        action: "GENERATE_MIGRATION",
        data: {
          desc: document.getElementById("migration-desc").value,
          key: document.getElementById("consul-key").value,
          value: document.getElementById("consul-value").value,
        },
      });
    });
})();
