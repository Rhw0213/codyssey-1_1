// ========================
// HTML 요소 가져오기
// ========================

const hamburger =
    document.querySelector('#hamburger');

const navMenu =
    document.querySelector('.nav-menu');

const themeButton =
    document.querySelector('#theme-toggle');

const projectContainer =
    document.querySelector('#project-container');

const form =
    document.querySelector('#contact-form');

const nameInput =
    document.querySelector('#name');

const emailInput =
    document.querySelector('#email');

const messageInput =
    document.querySelector('#message');

const nameError =
    document.querySelector('#name-error');

const emailError =
    document.querySelector('#email-error');

const messageError =
    document.querySelector('#message-error');


// ========================
// 햄버거 메뉴
// ========================

hamburger.addEventListener('click', () => {

    navMenu.classList.toggle('active');

});


// ========================
// 다크모드
// ========================

const savedTheme =
    localStorage.getItem('theme');

if (savedTheme === 'dark') {

    document.documentElement
        .setAttribute('data-theme', 'dark');

}

themeButton.addEventListener('click', () => {

    const currentTheme =
        document.documentElement
            .getAttribute('data-theme');

    if (currentTheme === 'dark') {

        document.documentElement
            .removeAttribute('data-theme');

        localStorage.setItem(
            'theme',
            'light'
        );

    } else {

        document.documentElement
            .setAttribute(
                'data-theme',
                'dark'
            );

        localStorage.setItem(
            'theme',
            'dark'
        );

    }

});


// ========================
// GitHub 프로젝트
// ========================

const loadProjects = async () => {

    projectContainer.textContent =
        '프로젝트를 불러오는 중...';

    try {

        const response =
            await fetch(
                'https://api.github.com/users/Rhw0213/repos'
            );

        if (!response.ok) {

            throw new Error(
                'GitHub API 요청 실패'
            );

        }

        const projects =
            await response.json();

        if (projects.length === 0) {

            projectContainer.textContent =
                '표시할 프로젝트가 없습니다.';

            return;
        }

        const cards =
            projects.map((project) => {

                return `
                    <article class="project-card">

                        <h3>
                            ${project.name}
                        </h3>

                        <p>
                            ${project.description ?? '설명이 없습니다.'}
                        </p>

                        <a
                            href="${project.html_url}"
                            target="_blank"
                        >
                            GitHub 보기
                        </a>

                    </article>
                `;

            });

        projectContainer.innerHTML =
            cards.join('');

    } catch (error) {

        console.error(error);

        projectContainer.textContent =
            '프로젝트를 불러올 수 없습니다.';

    }

};

loadProjects();


// ========================
// Contact Form
// ========================

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', (event) => {

    event.preventDefault();

    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    let isValid = true;

    if (nameInput.value.trim() === '') {

        nameError.textContent =
            '이름을 입력해주세요.';

        isValid = false;

    }

    if (
        !emailPattern.test(
            emailInput.value
        )
    ) {

        emailError.textContent =
            '올바른 이메일을 입력해주세요.';

        isValid = false;

    }

    if (
        messageInput.value.trim() === ''
    ) {

        messageError.textContent =
            '메시지를 입력해주세요.';

        isValid = false;

    }

    if (isValid) {

        alert('문의가 정상적으로 작성되었습니다.');

        form.reset();

    }

});