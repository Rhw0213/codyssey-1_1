# Ryu Portfolio

순수 HTML, CSS, JavaScript만 사용하여 제작한 반응형 포트폴리오 웹사이트입니다.

React, Vue, Bootstrap, Tailwind CSS 등의 프레임워크나 라이브러리를 사용하지 않고, 웹의 기본 동작인 DOM 조작, 이벤트 처리, 비동기 통신, 상태 변경 흐름을 직접 구현하는 것을 목표로 제작했습니다.

---

## 1. 프로젝트 소개

이 프로젝트는 개인 포트폴리오 웹사이트입니다.

다음과 같은 섹션으로 구성되어 있습니다.

- Hero
- About
- Skills
- Projects
- Contact
- Footer

Projects 영역에서는 GitHub API를 사용하여 실제 GitHub 저장소 목록을 불러와 화면에 동적으로 표시합니다.

또한 다크 모드, 햄버거 메뉴, 반응형 레이아웃, 폼 유효성 검사 등의 기능을 구현했습니다.

---

## 2. 사용 기술

### Frontend

- HTML5
- CSS3
- JavaScript ES6+

### API

- GitHub REST API

### 배포

- GitHub Pages

---

## 3. 프로젝트 폴더 구조

```text
portfolio
│
├─ index.html
│
├─ css
│   └─ style.css
│
├─ js
│   └─ script.js
│
├─ images
│   └─ profile.jpg
│
└─ README.md
```

---

## 4. 주요 기능

### 4.1 반응형 웹사이트

모바일 퍼스트 방식으로 작성했습니다.

브레이크포인트는 다음과 같습니다.

- 모바일: 기본 스타일
- 태블릿: 768px 이상
- 데스크톱: 1024px 이상

모바일 환경에서는 네비게이션 메뉴를 숨기고 햄버거 버튼을 표시합니다.

태블릿 이상의 화면에서는 전체 네비게이션 메뉴가 표시됩니다.

---

### 4.2 햄버거 메뉴

모바일 화면에서 햄버거 버튼을 클릭하면 메뉴가 나타납니다.

JavaScript의 `classList.toggle()`을 사용하여 `active` 클래스를 추가하거나 제거합니다.

```javascript
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
```

동작 흐름은 다음과 같습니다.

```text
사용자 클릭
↓
click 이벤트 발생
↓
active 클래스 추가/제거
↓
CSS 변경
↓
메뉴 표시/숨김
```

---

## 5. 다크 모드

다크 모드 버튼을 클릭하면 페이지의 테마가 변경됩니다.

HTML의 `data-theme` 속성을 변경하고 CSS 변수 값을 변경하는 방식으로 구현했습니다.

```css
:root {
    --background-color: #ffffff;
    --text-color: #222222;
}

[data-theme="dark"] {
    --background-color: #121212;
    --text-color: #ffffff;
}
```

다크 모드 설정은 `localStorage`에 저장됩니다.

따라서 페이지를 새로고침해도 이전에 선택한 테마가 유지됩니다.

```javascript
localStorage.setItem('theme', 'dark');
```

---

## 6. GitHub API 연동

GitHub API를 이용하여 GitHub 저장소 목록을 불러옵니다.

사용한 API 주소:

```text
https://api.github.com/users/Rhw0213/repos
```

`fetch()`와 `async/await`를 이용하여 비동기 요청을 처리했습니다.

```javascript
const response = await fetch(
    'https://api.github.com/users/Rhw0213/repos'
);

const projects = await response.json();
```

GitHub에서 받아온 배열 데이터는 `map()`을 이용해 프로젝트 카드 형태의 HTML로 변환합니다.

```javascript
const cards = projects.map((project) => {
    return `
        <article class="project-card">
            <h3>${project.name}</h3>
            <p>${project.description ?? '설명이 없습니다.'}</p>
        </article>
    `;
});
```

---

## 7. API 상태 처리

GitHub API를 호출할 때 다음 상태를 구분하여 UI에 표시합니다.

### 로딩 상태

```text
프로젝트를 불러오는 중...
```

### 성공 상태

GitHub 저장소 목록을 카드 형태로 표시합니다.

### 실패 상태

```text
프로젝트를 불러올 수 없습니다.
```

### 빈 상태

```text
표시할 프로젝트가 없습니다.
```

API 요청 중 오류가 발생하는 경우 `try/catch`를 사용하여 처리합니다.

---

## 8. Contact Form

Contact 영역에서는 다음 정보를 입력할 수 있습니다.

- 이름
- 이메일
- 메시지

폼 제출 시 `event.preventDefault()`를 사용하여 기본 제출 동작을 막고 JavaScript에서 직접 입력값을 검사합니다.

```javascript
form.addEventListener('submit', (event) => {
    event.preventDefault();
});
```

다음과 같은 유효성 검사를 적용했습니다.

- 이름 빈 값 검사
- 이메일 형식 검사
- 메시지 빈 값 검사

잘못된 입력이 있을 경우 각 입력창 주변에 에러 메시지를 표시합니다.

---

## 9. 시맨틱 HTML

페이지의 의미와 역할에 맞게 시맨틱 태그를 사용했습니다.

사용한 주요 태그:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

각 태그의 역할은 다음과 같습니다.

- `header`: 페이지 상단 영역
- `nav`: 네비게이션 메뉴
- `main`: 페이지의 주요 콘텐츠
- `section`: About, Skills, Projects 등의 개별 영역
- `article`: 독립적인 프로젝트 카드
- `footer`: 페이지 하단 정보

시맨틱 태그를 사용하면 코드의 구조를 쉽게 파악할 수 있고 접근성과 유지보수성이 좋아집니다.

---

## 10. Flexbox와 Grid

### Flexbox

네비게이션처럼 한 방향으로 요소를 정렬하는 영역에 사용했습니다.

```css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### Grid

Projects처럼 여러 개의 카드가 행과 열 형태로 배치되는 영역에 사용했습니다.

```css
.project-container {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
```

Flexbox는 주로 1차원 배치에 사용하고, Grid는 2차원 배치에 적합합니다.

---

## 11. JavaScript DOM 조작

`querySelector()`를 이용하여 HTML 요소를 선택합니다.

```javascript
const hamburger =
    document.querySelector('#hamburger');
```

선택한 요소에 `addEventListener()`를 사용하여 이벤트를 연결합니다.

```javascript
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
```

DOM 조작에는 다음 기능을 사용했습니다.

- `querySelector`
- `querySelectorAll`
- `textContent`
- `innerHTML`
- `classList.add`
- `classList.remove`
- `classList.toggle`

---

## 12. ES6+ 문법

프로젝트에서는 ES6 이상의 JavaScript 문법을 사용했습니다.

### 화살표 함수

```javascript
const hello = () => {
    console.log('Hello');
};
```

### 구조분해 할당

```javascript
const {
    name,
    description,
    html_url
} = project;
```

### map

GitHub 데이터를 HTML 카드 형태로 변환할 때 사용합니다.

```javascript
projects.map((project) => {
    return project.name;
});
```

### filter

특정 조건에 맞는 프로젝트만 선택할 때 사용할 수 있습니다.

```javascript
projects.filter((project) => {
    return project.language === 'JavaScript';
});
```

---

## 13. 이벤트 → 상태 → DOM 업데이트

이 프로젝트에서 가장 중요하게 학습한 부분입니다.

예를 들어 햄버거 메뉴는 다음 흐름으로 동작합니다.

```text
사용자가 햄버거 버튼 클릭
↓
click 이벤트 발생
↓
active 상태 변경
↓
DOM 클래스 변경
↓
CSS 적용
↓
메뉴 표시
```

다크 모드 또한 같은 방식입니다.

```text
다크 모드 버튼 클릭
↓
테마 상태 변경
↓
data-theme 변경
↓
CSS 변수 변경
↓
화면 색상 변경
```

GitHub API도 다음 흐름으로 처리합니다.

```text
API 호출
↓
loading 상태
↓
데이터 응답
↓
success 또는 error 상태
↓
Projects DOM 업데이트
```

이러한 구조는 이후 React에서 사용하는 상태 기반 렌더링의 기초가 됩니다.

---

## 14. 스크롤 효과

스크롤 이벤트를 활용하여 다음 기능을 구현합니다.

- 일정 거리 이상 스크롤 시 Scroll Top 버튼 표시
- 일정 거리 이상 스크롤 시 네비게이션 스타일 변경
- 네비게이션 메뉴 클릭 시 해당 영역으로 부드럽게 이동

기준값:

```text
Scroll Top 버튼: 300px 이상
Navigation 스타일 변경: 60px 이상
```

---

## 15. 스크롤 애니메이션

`IntersectionObserver`를 사용하여 화면에 요소가 일정 부분 나타날 때 애니메이션이 실행되도록 구현합니다.

사용한 threshold 값:

```javascript
threshold: 0.2
```

요소가 약 20% 이상 화면에 나타나면 `show` 클래스를 추가하여 애니메이션을 실행합니다.

---

## 16. 실행 방법

프로젝트를 다운로드한 후 VS Code에서 프로젝트 폴더를 엽니다.

VS Code의 Live Server를 사용하여 실행합니다.

```text
index.html
→ 우클릭
→ Open with Live Server
```

---

## 17. GitHub 저장소

GitHub Repository

```text
추