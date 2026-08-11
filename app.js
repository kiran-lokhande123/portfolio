/**
 * Renders a static portfolio page from resume.json (JSON Resume schema).
 * Sections with no data are hidden rather than shown empty.
 */

(function () {
  "use strict";

  const RESUME_PATH = "resume.json";

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    loadResume();
  });

  async function loadResume() {
    try {
      const response = await fetch(RESUME_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load ${RESUME_PATH}: ${response.status}`);
      }
      const resume = await response.json();
      render(resume);
    } catch (err) {
      renderError(err);
    }
  }

  function render(resume) {
    const nav = [];

    renderHero(resume.basics || {});
    document.title = resume.basics?.name
      ? `${resume.basics.name} — Portfolio`
      : "Portfolio";

    if (renderWork(resume.work)) nav.push(["work", "Experience"]);
    if (renderProjects(resume.projects)) nav.push(["projects", "Projects"]);
    if (renderSkills(resume.skills)) nav.push(["skills", "Skills"]);
    if (renderEducation(resume.education)) nav.push(["education", "Education"]);
    if (renderCertificates(resume.certificates)) nav.push(["certificates", "Certificates"]);

    renderNav(nav);
    renderFooter(resume.basics || {});
  }

  /* ------------------------------------------------------------------ */
  /* Hero / basics                                                      */
  /* ------------------------------------------------------------------ */

  function renderHero(basics) {
    setText("hero-name", basics.name || "Your Name");
    setText("hero-label", basics.label || "");
    setText("hero-summary", basics.summary || "");
    toggleHidden("hero-label", !basics.label);
    toggleHidden("hero-summary", !basics.summary);

    const brand = document.getElementById("nav-brand");
    if (brand && basics.name) brand.textContent = basics.name;

    const contact = document.getElementById("hero-contact");
    contact.innerHTML = "";
    const items = [];

    if (basics.email) {
      items.push(linkItem(`mailto:${basics.email}`, basics.email, "Email"));
    }
    if (basics.phone) {
      items.push(spanItem(basics.phone, "Phone"));
    }
    if (basics.location && (basics.location.city || basics.location.countryCode)) {
      const loc = [basics.location.city, basics.location.countryCode]
        .filter(Boolean)
        .join(", ");
      items.push(spanItem(loc, "Location"));
    }
    if (basics.url) {
      items.push(linkItem(basics.url, "LinkedIn / Website", "Profile link"));
    }
    (basics.profiles || []).forEach((p) => {
      if (p.url) {
        items.push(linkItem(p.url, p.network || p.username || "Profile", p.network || "Profile"));
      }
    });

    items.forEach((el) => contact.appendChild(el));
  }

  function linkItem(href, label, ariaLabel) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (ariaLabel) a.setAttribute("aria-label", ariaLabel);
    if (/^https?:\/\//.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function spanItem(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  }

  /* ------------------------------------------------------------------ */
  /* Work                                                                */
  /* ------------------------------------------------------------------ */

  function renderWork(work) {
    if (!Array.isArray(work) || work.length === 0) return false;

    const list = document.getElementById("work-list");
    list.innerHTML = "";

    work.forEach((job) => {
      const item = document.createElement("article");
      item.className = "timeline-item";

      const title = document.createElement("h3");
      title.textContent = [job.position, job.name].filter(Boolean).join(" — ");
      item.appendChild(title);

      const meta = document.createElement("p");
      meta.className = "timeline-meta";
      const range = formatDateRange(job.startDate, job.endDate);
      if (range) {
        const span = document.createElement("span");
        span.textContent = range;
        meta.appendChild(span);
      }
      if (meta.childNodes.length) item.appendChild(meta);

      if (job.summary) {
        const summary = document.createElement("p");
        summary.className = "timeline-summary";
        summary.textContent = job.summary;
        item.appendChild(summary);
      }

      if (Array.isArray(job.highlights) && job.highlights.length) {
        const ul = document.createElement("ul");
        job.highlights.forEach((h) => {
          const li = document.createElement("li");
          li.textContent = h;
          ul.appendChild(li);
        });
        item.appendChild(ul);
      }

      list.appendChild(item);
    });

    toggleHidden("work", false);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Projects                                                            */
  /* ------------------------------------------------------------------ */

  function renderProjects(projects) {
    if (!Array.isArray(projects) || projects.length === 0) return false;

    const list = document.getElementById("projects-list");
    list.innerHTML = "";

    projects.forEach((proj) => {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = proj.name || "Project";
      card.appendChild(title);

      if (proj.description) {
        const desc = document.createElement("p");
        desc.textContent = proj.description;
        card.appendChild(desc);
      }

      const range = formatDateRange(proj.startDate, proj.endDate);
      if (range) {
        const p = document.createElement("p");
        p.textContent = range;
        card.appendChild(p);
      }

      if (Array.isArray(proj.highlights) && proj.highlights.length) {
        const ul = document.createElement("ul");
        proj.highlights.forEach((h) => {
          const li = document.createElement("li");
          li.textContent = h;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (proj.url) {
        card.appendChild(linkItem(proj.url, "View project"));
      }

      list.appendChild(card);
    });

    toggleHidden("projects", false);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Skills                                                              */
  /* ------------------------------------------------------------------ */

  function renderSkills(skills) {
    if (!Array.isArray(skills) || skills.length === 0) return false;

    const list = document.getElementById("skills-list");
    list.innerHTML = "";

    skills.forEach((skill) => {
      const group = document.createElement("div");
      group.className = "skill-group";

      if (skill.name) {
        const h3 = document.createElement("h3");
        h3.textContent = skill.name;
        group.appendChild(h3);
      }

      if (Array.isArray(skill.keywords) && skill.keywords.length) {
        const ul = document.createElement("ul");
        ul.className = "chip-list";
        skill.keywords.forEach((kw) => {
          const li = document.createElement("li");
          li.className = "chip";
          li.textContent = kw;
          ul.appendChild(li);
        });
        group.appendChild(ul);
      }

      list.appendChild(group);
    });

    toggleHidden("skills", false);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Education                                                           */
  /* ------------------------------------------------------------------ */

  function renderEducation(education) {
    if (!Array.isArray(education) || education.length === 0) return false;

    const list = document.getElementById("education-list");
    list.innerHTML = "";

    education.forEach((edu) => {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = edu.studyType || "Education";
      card.appendChild(title);

      if (edu.institution) {
        const p = document.createElement("p");
        p.textContent = edu.institution;
        card.appendChild(p);
      }

      const range = formatDateRange(edu.startDate, edu.endDate);
      if (range) {
        const p = document.createElement("p");
        p.textContent = range;
        card.appendChild(p);
      }

      list.appendChild(card);
    });

    toggleHidden("education", false);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Certificates                                                        */
  /* ------------------------------------------------------------------ */

  function renderCertificates(certificates) {
    if (!Array.isArray(certificates) || certificates.length === 0) return false;

    const list = document.getElementById("certificates-list");
    list.innerHTML = "";

    certificates.forEach((cert) => {
      const li = document.createElement("li");
      let text = cert.name || "Certificate";
      if (cert.issuer) text += ` — ${cert.issuer}`;
      if (cert.date) text += ` (${cert.date})`;
      li.textContent = text;
      list.appendChild(li);
    });

    toggleHidden("certificates", false);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Nav / footer                                                        */
  /* ------------------------------------------------------------------ */

  function renderNav(sections) {
    const nav = document.getElementById("nav-links");
    nav.innerHTML = "";
    sections.forEach(([id, label]) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = label;
      li.appendChild(a);
      nav.appendChild(li);
    });
  }

  function renderFooter(basics) {
    const year = document.getElementById("footer-year");
    if (year) year.textContent = new Date().getFullYear();
    const footerText = document.getElementById("footer-text");
    if (footerText && basics.name) {
      footerText.innerHTML = `&copy; <span id="footer-year">${new Date().getFullYear()}</span> ${escapeHtml(
        basics.name
      )}`;
    }
  }

  function renderError(err) {
    console.error(err);
    setText("hero-name", "Unable to load resume data");
    setText(
      "hero-summary",
      "Run this site from a local server (e.g. python3 -m http.server 8000) so the browser can fetch resume.json."
    );
    toggleHidden("hero-summary", false);
  }

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function toggleHidden(id, isHidden) {
    const el = document.getElementById(id);
    if (el) el.hidden = isHidden;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDateRange(start, end) {
    const s = formatDate(start);
    const e = end ? formatDate(end) : start ? "Present" : "";
    if (!s && !e) return "";
    if (!s) return e;
    return `${s} – ${e || "Present"}`;
  }

  function formatDate(value) {
    if (!value) return "";
    const parts = String(value).split("-");
    const year = parts[0];
    const monthIndex = parts[1] ? parseInt(parts[1], 10) - 1 : null;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    if (monthIndex !== null && months[monthIndex]) {
      return `${months[monthIndex]} ${year}`;
    }
    return year;
  }

  /* ------------------------------------------------------------------ */
  /* Theme toggle                                                        */
  /* ------------------------------------------------------------------ */

  function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const stored = localStorage.getItem("theme");
    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
    }

    toggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }
})();
