// Table of Contents (TOC) Generator
// 解析 .post-content 中的标题并生成浮动目录

(function() {
    'use strict';

    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 检查是否存在文章内容
        const postContent = document.querySelector('.post-content');
        if (!postContent) return;

        // 获取所有标题元素 (h1-h6)
        const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        // 创建目录容器
        const tocContainer = createTocContainer();
        
        // 创建目录列表
        const tocList = createTocList();

        // 遍历标题并生成目录项
        headings.forEach((heading, index) => {
            // 为标题添加ID（如果还没有）
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }

            // 创建目录项
            const tocItem = createTocItem(heading, headings);
            tocList.appendChild(tocItem);
        });

        tocContainer.appendChild(tocList);
        document.body.appendChild(tocContainer);

        // 添加样式
        addTocStyles();

        // 移除滚动监听功能
    });

    // 创建目录容器
    function createTocContainer() {
        const container = document.createElement('div');
        container.className = 'toc-container';
        
        const header = document.createElement('div');
        header.className = 'toc-header';
        header.textContent = '目录';
        
        // 添加点击事件来切换目录列表的显示/隐藏
        header.addEventListener('click', function() {
            const tocList = container.querySelector('.toc-list');
            if (tocList) {
                const isExpanded = tocList.style.display !== 'none';
                if (isExpanded) {
                    tocList.style.display = 'none';
                    container.classList.add('collapsed');
                } else {
                    tocList.style.display = 'block';
                    container.classList.remove('collapsed');
                }
            }
        });
        
        container.appendChild(header);
        return container;
    }

    // 创建目录列表
    function createTocList() {
        const list = document.createElement('ul');
        list.className = 'toc-list';
        return list;
    }

    // 创建目录项
    function createTocItem(heading, headings) {
        const item = document.createElement('li');
        item.className = 'toc-item';
        
        // 计算缩进
        const indent = calculateHeadingIndent(heading, headings);
        item.style.marginLeft = indent + 'px';
        
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        // 添加平滑滚动
        link.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo(heading.id);
        });
        
        item.appendChild(link);
        return item;
    }

    // 计算标题的缩进层级
    function calculateHeadingIndent(heading, headings) {
        if (headings.length === 0) return 0;
        
        // 找到最小的标题级别
        let minLevel = 6;
        headings.forEach(h => {
            const level = parseInt(h.tagName.charAt(1));
            if (level < minLevel) minLevel = level;
        });
        
        // 计算当前标题相对于最小级别的层级
        const currentLevel = parseInt(heading.tagName.charAt(1));
        const indentLevel = currentLevel - minLevel;
        
        // 根据层级计算缩进（每级10像素）
        return indentLevel * 10;
    }

    // 平滑滚动到指定元素
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // 缓动函数
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // 移除滚动监听功能

    // 添加目录样式（现在通过外部CSS文件加载）
    function addTocStyles() {
        // 样式已通过外部CSS文件加载，无需动态生成
    }

})();