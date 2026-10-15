
"use strict";

/* ========================================
   1. 설정 및 DOM 요소 선택
======================================== */

// 반드시 본인의 GitHub 아이디로 변경하세요.
const GITHUB_USERNAME = "Rhw0213";

const header = document.querySelector("#header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const themeToggle = document.querySelector("#theme-toggle");
const scrollTopButton = document.querySelector("#scroll-top");

const projectStatus = document.querySelector("#project-status");
const projectList = document.querySelector("#project-list");
const projectFilters = document.querySelector("#project-filters");

const contactForm = document.querySelector("#contact-form");
const formResult = document.querySelector("#form-result");

const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message")
};

const errorElements = {
  name: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  message: document.querySelector("#message-error")
};

/* ========================================
   2. 상태 관리
======================================== */

const savedTheme = localStorage.getItem("portfolio-theme");

const systemDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

const state = {
  theme: savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemDark ? "dark" : "light",

  menuOpen: false,

  projects: [],
  projectStatus: "idle",
  projectError: "",
  selectedLanguage: "All",

  formErrors: {
    name: "",
    email: "",
    message: ""
  }
};

/* ========================================
   3. 다크 모드
======================================== */

const renderTheme = () => {
  document.documentElement.dataset.theme = state.theme;

  const isDark = state.theme === "dark";

  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "라이트 모드 전환" : "다크 모드 전환"
  );
  themeToggle.setAttribute("aria-pressed", String(isDark));
};

themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";

  localStorage.setItem("portfolio-theme", state.theme);

  renderTheme();
});

renderTheme();

/* ========================================
   4. 햄버거 메뉴
======================================== */

const renderMenu = () => {
  navMenu.classList.toggle("active", state.menuOpen);

  menuToggle.textContent = state.menuOpen ? "✕" : "☰";

  menuToggle.setAttribute(
    "aria-expanded",
    String(state.menuOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    state.menuOpen ? "메뉴 닫기" : "메뉴 열기"
  );
};

menuToggle.addEventListener("click", () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    state.menuOpen = false;
    renderMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768 && state.menuOpen) {
    state.menuOpen = false;
    renderMenu();
  }
});

/* ========================================
   5. 부드러운 스크롤
======================================== */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    history.replaceState(null, "", targetId);
  });
});

/* ========================================
   6. 스크롤 이벤트
======================================== */

const handleScroll = () => {
  const scrollY = window.scrollY;

  // 60px 이상 스크롤하면 헤더 스타일 변경
  if (scrollY >= 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // 300px 이상 스크롤하면 맨 위 버튼 표시
  if (scrollY >= 300) {
    scrollTopButton.classList.add("visible");
  } else {
    scrollTopButton.classList.remove("visible");
  }
};

window.addEventListener("scroll", handleScroll, {
  passive: true
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? "auto" : "smooth"
  });
});

handleScroll();

/* ========================================
   7. 스크롤 애니메이션
======================================== */

const revealElements = document.querySelectorAll(
  ".section-title, .section-subtitle, .about-content, " +
  ".skill-card, #contact-form"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* ========================================
   8. GitHub API - 유틸리티
======================================== */

// 외부 API에서 가져온 문자열을 안전하게 HTML에 출력
const escapeHTML = (value) => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
};

// GitHub API 응답을 프로젝트 카드로 변환
const createProjectCard = (repo) => {
  const {
    name,
    description,
    html_url,
    language,
    stargazers_count,
    forks_count
  } = repo;

  return `
    <article class="project-card">
      <h3>${escapeHTML(name)}</h3>

      <p>
        ${escapeHTML(description || "프로젝트 설명이 없습니다.")}
      </p>

      <p>
        <strong>언어:</strong>
        ${escapeHTML(language || "기타")}
      </p>

      <p>
        ⭐ ${stargazers_count} &nbsp;
        🍴 ${forks_count}
      </p>

      <a
        href="${escapeHTML(html_url)}"
        target="_blank"
        rel="noopener noreferrer">
        GitHub에서 보기 →
      </a>
    </article>
  `;
};

/* ========================================
   9. GitHub 프로젝트 상태 렌더링
======================================== */

const renderProjects = () => {
  const { projectStatus: status, projects } = state;

  // 로딩 상태
  if (status === "loading") {
    projectStatus.textContent = "⏳ 프로젝트 로딩 중...";
    projectList.innerHTML = "";
    projectFilters.innerHTML = "";
    return;
  }

  // 에러 상태
  if (status === "error") {
    projectStatus.innerHTML = `
      <p>${escapeHTML(state.projectError)}</p>
      <button type="button" id="retry-button">
        다시 시도
      </button>
    `;

    projectList.innerHTML = "";
    projectFilters.innerHTML = "";

    document.querySelector("#retry-button")
      .addEventListener("click", fetchProjects);

    return;
  }

  // 빈 상태
  if (status === "empty") {
    projectStatus.textContent =
      "표시할 프로젝트가 없습니다.";

    projectList.innerHTML = "";
    projectFilters.innerHTML = "";
    return;
  }

  if (status !== "success") return;

  // 선택한 언어에 따라 필터링
  const filteredProjects = projects.filter((repo) => {
    return state.selectedLanguage === "All" ||
      (repo.language || "기타") === state.selectedLanguage;
  });

  if (filteredProjects.length === 0) {
    projectStatus.textContent =
      "선택한 언어의 프로젝트가 없습니다.";
  } else {
    projectStatus.textContent = "";
  }

  // map으로 HTML 카드 생성
  projectList.innerHTML = filteredProjects
    .map((repo) => createProjectCard(repo))
    .join("");
};

/* ========================================
   10. 프로젝트 언어별 필터
======================================== */

const renderFilters = () => {
  const languages = [
    "All",
    ...new Set(
      state.projects.map((repo) => repo.language || "기타")
    )
  ];

  projectFilters.innerHTML = languages.map((language) => {
    const isActive = state.selectedLanguage === language;

    return `
      <button
        type="button"
        class="filter-btn ${isActive ? "active" : ""}"
        data-language="${escapeHTML(language)}"
        aria-pressed="${isActive}">
        ${escapeHTML(language === "All" ? "전체" : language)}
      </button>
    `;
  }).join("");

  projectFilters.querySelectorAll(".filter-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedLanguage = button.dataset.language;

        renderFilters();
        renderProjects();
      });
    });
};

/* ========================================
   11. GitHub API 호출
======================================== */

const fetchProjects = async () => {
  state.projectStatus = "loading";
  state.projectError = "";

  renderProjects();

  try {
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
      throw new Error(
        "script.js에서 GitHub 아이디를 설정해 주세요."
      );
    }

    const url =
      `https://api.github.com/users/` +
      `${encodeURIComponent(GITHUB_USERNAME)}/repos` +
      `?sort=updated&per_page=100&type=owner`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error(
          "GitHub API 요청 제한이 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }

      if (response.status === 404) {
        throw new Error(
          "GitHub 사용자를 찾을 수 없습니다. 아이디를 확인해 주세요."
        );
      }

      throw new Error(
        `프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("GitHub 응답 형식이 올바르지 않습니다.");
    }

    // fork가 아닌 본인 프로젝트만 표시
    state.projects = data.filter((repo) => !repo.fork);

    state.selectedLanguage = "All";

    state.projectStatus =
      state.projects.length > 0 ? "success" : "empty";

    if (state.projectStatus === "success") {
      renderFilters();
    }

  } catch (error) {
    state.projectStatus = "error";
    state.projectError =
      error.message || "프로젝트를 불러올 수 없습니다.";

    console.error("GitHub API 오류:", error);

  } finally {
    renderProjects();
  }
};

/* ========================================
   12. 문의 폼 유효성 검사
======================================== */

const validateField = (fieldName) => {
  const value = fields[fieldName].value.trim();
  let error = "";

  if (value === "") {
    error = "필수 입력 항목입니다.";
  } else if (fieldName === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      error = "올바른 이메일 형식을 입력해 주세요.";
    }
  }

  state.formErrors[fieldName] = error;

  renderFieldError(fieldName);

  return error === "";
};

const renderFieldError = (fieldName) => {
  const error = state.formErrors[fieldName];

  errorElements[fieldName].textContent = error;

  fields[fieldName].setAttribute(
    "aria-invalid",
    String(error !== "")
  );
};

// 입력 중 유효성 검사
Object.keys(fields).forEach((fieldName) => {
  fields[fieldName].addEventListener("input", () => {
    validateField(fieldName);
    formResult.textContent = "";
  });
});

// 폼 제출
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = Object.keys(fields).map((fieldName) => {
    return validateField(fieldName);
  });

  const isValid = results.every((result) => result);

  if (!isValid) {
    formResult.textContent =
      "입력 내용을 다시 확인해 주세요.";

    const firstInvalid = Object.keys(fields).find(
      (fieldName) => state.formErrors[fieldName] !== ""
    );

    if (firstInvalid) {
      fields[firstInvalid].focus();
    }

    return;
  }

  formResult.textContent =
    "입력 확인이 완료되었습니다. (실제 전송은 되지 않습니다.)";

  contactForm.reset();

  Object.keys(fields).forEach((fieldName) => {
    state.formErrors[fieldName] = "";
    renderFieldError(fieldName);
  });
});

/* ========================================
   13. 초기 실행
======================================== */

fetchProjects();

console.log("포트폴리오 JavaScript 실행 완료!");
