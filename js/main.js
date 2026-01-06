// 主要 JavaScript 檔案

// 網頁載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log('網頁已載入完成');

    // 平滑滾動效果
    initSmoothScroll();

    // 導覽列互動
    initNavigation();
});

// 平滑滾動到錨點
function initSmoothScroll() {
    const links = document.querySelectorAll('nav a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 導覽列互動效果
function initNavigation() {
    // 可以在此新增導覽列的互動功能
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });

        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
}
