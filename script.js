const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const siteHeader = document.querySelector(".site-header");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileNavigation = window.matchMedia("(max-width: 640px)");

if (menuToggle && navigation) {
  const closeMenu = (returnFocus = false) => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");

    if (returnFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    closeMenu();

    if (mobileNavigation.matches) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });

  document.addEventListener("pointerdown", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen && siteHeader && !siteHeader.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && isOpen) closeMenu(true);
  });

  mobileNavigation.addEventListener("change", (event) => {
    if (!event.matches) closeMenu();
  });
}

const revealTargets = document.querySelectorAll(
  ".about, .skills, .projects, .process, .contact, .skill-panel, .project-card, .process-list li"
);

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        entry.target.classList.add("is-pending");
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.documentElement.classList.add("has-scroll-reveal");
  revealTargets.forEach((target) => {
    target.classList.add("reveal-target");
    revealObserver.observe(target);
  });
}

const sectionLinks = [...document.querySelectorAll(
  '.primary-navigation a[href^="#"], .site-footer nav a[href^="#"]'
)];
const activeSections = [...new Set(sectionLinks
  .map((link) => document.getElementById(link.hash.slice(1)))
  .filter(Boolean))];

if ("IntersectionObserver" in window && activeSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      sectionLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-96px 0px -280px 0px", threshold: 0 });

  activeSections.forEach((section) => sectionObserver.observe(section));
}

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.setAttribute("aria-hidden", "true");
backToTop.tabIndex = -1;
backToTop.textContent = "↑";
document.body.append(backToTop);

const updateBackToTop = () => {
  const isVisible = window.scrollY > 500;
  backToTop.classList.toggle("is-visible", isVisible);
  backToTop.setAttribute("aria-hidden", String(!isVisible));
  backToTop.tabIndex = isVisible ? 0 : -1;
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  document.querySelector(".wordmark")?.focus({ preventScroll: true });
});

document.documentElement.classList.add("js");
