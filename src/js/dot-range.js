(function () {
  if (document.querySelectorAll("[data-dot-range]").length) {
    document.querySelectorAll("[data-dot-range]").forEach(root => {
      const radios = Array.from(root.querySelectorAll('input[type="radio"]'));
      if (radios.length < 2) return;

      const syncTabIndex = () => {
        const checked = radios.find(r => r.checked) || radios[0];
        radios.forEach(r => (r.tabIndex = r === checked ? 0 : -1));
      };

      syncTabIndex();

      radios.forEach(r => {
        r.addEventListener("change", syncTabIndex);

        r.addEventListener("keydown", e => {
          if (
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "Home" &&
            e.key !== "End"
          )
            return;

          e.preventDefault();

          const current = radios.findIndex(x => x.checked);
          let next = current;

          if (e.key === "ArrowLeft") next = Math.max(0, current - 1);
          if (e.key === "ArrowRight")
            next = Math.min(radios.length - 1, current + 1);
          if (e.key === "Home") next = 0;
          if (e.key === "End") next = radios.length - 1;

          radios[next].checked = true;
          radios[next].dispatchEvent(new Event("change", { bubbles: true }));
          radios[next].focus();
        });
      });
    });
  }
})();
