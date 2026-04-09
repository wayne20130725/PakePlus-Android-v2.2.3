window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ===================================================
// PakePlus 移动端文件上传下载增强脚本
// 专门解决移动端WebView中的文件上传问题
// ===================================================

// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    
    // 检查是否是文件下载链接
    if (origin && origin.href) {
        const url = origin.href;
        const urlLower = url.toLowerCase();
        
        // 判断是否为文件下载
        const isFileDownload = 
            // 1. 链接有download属性
            origin.hasAttribute('download') ||
            // 2. 检查文件扩展名
            urlLower.endsWith('.pdf') ||
            urlLower.endsWith('.zip') ||
            urlLower.endsWith('.rar') ||
            urlLower.endsWith('.7z') ||
            urlLower.endsWith('.exe') ||
            urlLower.endsWith('.dmg') ||
            urlLower.endsWith('.pkg') ||
            urlLower.endsWith('.apk') ||
            urlLower.endsWith('.ipa') ||
            urlLower.endsWith('.jpg') ||
            urlLower.endsWith('.jpeg') ||
            urlLower.endsWith('.png') ||
            urlLower.endsWith('.gif') ||
            urlLower.endsWith('.bmp') ||
            urlLower.endsWith('.mp4') ||
            urlLower.endsWith('.avi') ||
            urlLower.endsWith('.mov') ||
            urlLower.endsWith('.mp3') ||
            urlLower.endsWith('.wav') ||
            urlLower.endsWith('.doc') ||
            urlLower.endsWith('.docx') ||
            urlLower.endsWith('.xls') ||
            urlLower.endsWith('.xlsx') ||
            urlLower.endsWith('.ppt') ||
            urlLower.endsWith('.pptx') ||
            urlLower.endsWith('.txt') ||
            urlLower.endsWith('.csv') ||
            // 3. URL中包含下载关键词
            urlLower.includes('/download/') ||
            urlLower.includes('/download.') ||
            urlLower.includes('download=true') ||
            urlLower.includes('action=download') ||
            // 4. 自定义数据属性
            origin.getAttribute('data-download') === 'true' ||
            origin.getAttribute('data-type') === 'file';
        
        if (isFileDownload) {
            console.log('检测到文件下载链接，不拦截:', origin.href)
            // 如果是下载链接，不拦截，让浏览器原生处理
            return;
        }
    }
    
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

// 增强的 window.open
const originalWindowOpen = window.open;
window.open = function (url, target, features) {
    console.log('open', url, target, features)
    
    // 检查是否是文件下载
    if (url && typeof url === 'string') {
        const urlLower = url.toLowerCase();
        
        // 判断是否为文件下载
        const isFileDownload = 
            urlLower.endsWith('.pdf') ||
            urlLower.endsWith('.zip') ||
            urlLower.endsWith('.rar') ||
            urlLower.endsWith('.7z') ||
            urlLower.endsWith('.exe') ||
            urlLower.endsWith('.dmg') ||
            urlLower.endsWith('.pkg') ||
            urlLower.endsWith('.apk') ||
            urlLower.endsWith('.ipa') ||
            urlLower.endsWith('.jpg') ||
            urlLower.endsWith('.jpeg') ||
            urlLower.endsWith('.png') ||
            urlLower.endsWith('.gif') ||
            urlLower.endsWith('.bmp') ||
            urlLower.endsWith('.mp4') ||
            urlLower.endsWith('.avi') ||
            urlLower.endsWith('.mov') ||
            urlLower.endsWith('.mp3') ||
            urlLower.endsWith('.wav') ||
            urlLower.endsWith('.doc') ||
            urlLower.endsWith('.docx') ||
            urlLower.endsWith('.xls') ||
            urlLower.endsWith('.xlsx') ||
            urlLower.endsWith('.ppt') ||
            urlLower.endsWith('.pptx') ||
            urlLower.endsWith('.txt') ||
            urlLower.endsWith('.csv') ||
            urlLower.includes('/download/') ||
            urlLower.includes('/download.') ||
            urlLower.includes('download=true') ||
            urlLower.includes('action=download');
        
        if (isFileDownload) {
            console.log('检测到文件下载，使用原生 window.open:', url)
            // 如果是文件下载，使用原生的 window.open
            if (originalWindowOpen) {
                return originalWindowOpen.call(window, url, target || '_blank', features);
            }
            // 备用方案
            const a = document.createElement('a');
            a.href = url;
            a.target = target || '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return null;
        }
    }
    
    // 非文件下载链接，在原页面打开
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ===================================================
// 移动端WebView文件上传解决方案
// ===================================================

// 检测是否在移动端WebView环境中
function isMobileWebView() {
    const ua = navigator.userAgent.toLowerCase();
    return (
        /android|iphone|ipad|ipod/.test(ua) &&
        (/pakeplus/i.test(ua) || window.__PAKEPLUS__ || window.pakeplus)
    );
}

// 移动端文件上传增强
function enhanceMobileFileUpload() {
    if (!isMobileWebView()) {
        console.log('不在移动端WebView环境中，跳过文件上传增强');
        return;
    }
    
    console.log('检测到移动端WebView环境，启用文件上传增强');
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 移动端文件输入框样式优化 */
        .pakeplus-file-input-wrapper {
            position: relative;
            display: inline-block;
        }
        
        .pakeplus-file-input-hidden {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 10;
        }
        
        .pakeplus-file-input-button {
            display: inline-block;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
        }
        
        .pakeplus-file-input-button:active {
            background: #388E3C;
        }
        
        /* 移动端文件上传区域 */
        .pakeplus-upload-area {
            border: 2px dashed #ccc;
            padding: 40px 20px;
            text-align: center;
            border-radius: 10px;
            margin: 20px 0;
            background: #f9f9f9;
            cursor: pointer;
        }
        
        .pakeplus-upload-area.dragover {
            border-color: #4CAF50;
            background: #E8F5E9;
        }
        
        /* 文件预览 */
        .pakeplus-file-preview {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        
        .pakeplus-file-item {
            display: flex;
            align-items: center;
            padding: 10px;
            background: white;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        
        .pakeplus-file-icon {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e3f2fd;
            border-radius: 5px;
            color: #2196F3;
        }
        
        .pakeplus-file-info {
            flex: 1;
        }
        
        .pakeplus-file-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .pakeplus-file-size {
            color: #666;
            font-size: 12px;
        }
        
        .pakeplus-file-remove {
            background: #ff5252;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    
    // 增强现有的文件输入框
    enhanceExistingFileInputs();
    
    // 监听动态创建的文件输入框
    setupMutationObserver();
    
    // 添加全局上传区域
    addGlobalUploadArea();
}

// 增强现有的文件输入框
function enhanceExistingFileInputs() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
        enhanceSingleFileInput(input);
    });
}

// 增强单个文件输入框
function enhanceSingleFileInput(input) {
    if (input.classList.contains('pakeplus-enhanced')) {
        return; // 已经增强过
    }
    
    console.log('增强文件输入框:', input);
    
    // 标记为已增强
    input.classList.add('pakeplus-enhanced');
    
    // 创建包装容器
    const wrapper = document.createElement('div');
    wrapper.className = 'pakeplus-file-input-wrapper';
    
    // 创建自定义按钮
    const button = document.createElement('div');
    button.className = 'pakeplus-file-input-button';
    button.textContent = input.getAttribute('data-button-text') || '选择文件';
    
    // 将输入框移动到包装容器中
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(button);
    
    // 修改输入框样式
    input.style.position = 'absolute';
    input.style.width = '100%';
    input.style.height = '100%';
    input.style.opacity = '0';
    input.style.cursor = 'pointer';
    input.style.zIndex = '10';
    input.style.top = '0';
    input.style.left = '0';
    
    // 设置接受的文件类型
    if (!input.accept) {
        input.accept = '*/*'; // 允许所有文件类型
    }
    
    // 添加点击事件
    button.addEventListener('click', function(e) {
        console.log('自定义文件选择按钮被点击');
    });
    
    // 监听文件选择
    input.addEventListener('change', function(e) {
        handleFileSelection(this, e);
    });
}

// 处理文件选择
function handleFileSelection(input, event) {
    console.log('文件已选择:', input.files);
    
    if (!input.files || input.files.length === 0) {
        console.log('没有选择文件');
        return;
    }
    
    // 显示文件预览
    showFilePreview(input);
    
    // 如果有onchange事件，触发它
    if (input.onchange && typeof input.onchange === 'function') {
        input.onchange(event);
    }
    
    // 触发自定义事件
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
}

// 显示文件预览
function showFilePreview(input) {
    // 移除旧的预览
    const oldPreview = input.closest('.pakeplus-file-input-wrapper').nextElementSibling;
    if (oldPreview && oldPreview.classList.contains('pakeplus-file-preview')) {
        oldPreview.remove();
    }
    
    // 创建预览容器
    const preview = document.createElement('div');
    preview.className = 'pakeplus-file-preview';
    
    // 添加标题
    const title = document.createElement('div');
    title.textContent = '已选择文件:';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    preview.appendChild(title);
    
    // 添加文件列表
    Array.from(input.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'pakeplus-file-item';
        
        // 文件图标
        const icon = document.createElement('div');
        icon.className = 'pakeplus-file-icon';
        
        // 根据文件类型选择图标
        if (file.type.startsWith('image/')) {
            icon.textContent = '🖼️';
        } else if (file.type.startsWith('video/')) {
            icon.textContent = '🎬';
        } else if (file.type.startsWith('audio/')) {
            icon.textContent = '🎵';
        } else if (file.type.includes('pdf')) {
            icon.textContent = '📄';
        } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z')) {
            icon.textContent = '📦';
        } else {
            icon.textContent = '📎';
        }
        
        // 文件信息
        const info = document.createElement('div');
        info.className = 'pakeplus-file-info';
        
        const name = document.createElement('div');
        name.className = 'pakeplus-file-name';
        name.textContent = file.name;
        
        const size = document.createElement('div');
        size.className = 'pakeplus-file-size';
        size.textContent = formatFileSize(file.size);
        
        info.appendChild(name);
        info.appendChild(size);
        
        // 删除按钮
        const removeBtn = document.createElement('button');
        removeBtn.className = 'pakeplus-file-remove';
        removeBtn.textContent = '×';
        removeBtn.title = '移除文件';
        removeBtn.addEventListener('click', function() {
            removeFileFromInput(input, index);
        });
        
        fileItem.appendChild(icon);
        fileItem.appendChild(info);
        fileItem.appendChild(removeBtn);
        preview.appendChild(fileItem);
    });
    
    // 插入预览
    input.closest('.pakeplus-file-input-wrapper').after(preview);
}

// 从输入框中移除文件
function removeFileFromInput(input, fileIndex) {
    if (!input.files || input.files.length <= fileIndex) {
        return;
    }
    
    // 创建新的FileList
    const dt = new DataTransfer();
    
    Array.from(input.files).forEach((file, index) => {
        if (index !== fileIndex) {
            dt.items.add(file);
        }
    });
    
    // 更新输入框的文件列表
    input.files = dt.files;
    
    // 重新显示预览
    if (input.files.length > 0) {
        showFilePreview(input);
    } else {
        // 移除预览
        const preview = input.closest('.pakeplus-file-input-wrapper').nextElementSibling;
        if (preview && preview.classList.contains('pakeplus-file-preview')) {
            preview.remove();
        }
    }
    
    // 触发change事件
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 设置MutationObserver监听动态创建的元素
function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查是否是文件输入框
                        if (node.tagName === 'INPUT' && node.type === 'file') {
                            enhanceSingleFileInput(node);
                        }
                        // 检查子元素中是否有文件输入框
                        node.querySelectorAll('input[type="file"]').forEach(input => {
                            enhanceSingleFileInput(input);
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 添加上传区域
function addGlobalUploadArea() {
    // 检查是否已存在
    if (document.getElementById('pakeplus-global-upload')) {
        return;
    }
    
    // 创建上传区域
    const uploadArea = document.createElement('div');
    uploadArea.id = 'pakeplus-global-upload';
    uploadArea.className = 'pakeplus-upload-area';
    uploadArea.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">📁</div>
        <div style="font-weight: bold; margin-bottom: 5px;">点击或拖拽文件到此处上传</div>
        <div style="color: #666; font-size: 14px;">支持图片、文档、压缩包等文件格式</div>
    `;
    
    // 创建隐藏的文件输入框
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'pakeplus-global-file-input';
    fileInput.style.display = 'none';
    fileInput.multiple = true;
    fileInput.accept = '*/*';
    
    document.body.appendChild(fileInput);
    document.body.appendChild(uploadArea);
    
    // 点击上传区域
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 拖拽功能
    if (typeof DragEvent !== 'undefined') {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelection(fileInput, e);
            }
        });
    }
    
    // 文件选择事件
    fileInput.addEventListener('change', function(e) {
        handleFileSelection(this, e);
    });
}

// 初始化移动端文件上传增强
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceMobileFileUpload);
} else {
    enhanceMobileFileUpload();
}

// ===================================================
// 页面加载完成后的初始化
// ===================================================

window.addEventListener('load', function() {
    console.log('页面加载完成，PakePlus移动端文件上传增强脚本已激活');
    
    // 如果页面加载完成后再增强一次
    if (isMobileWebView()) {
        setTimeout(() => {
            enhanceExistingFileInputs();
        }, 1000);
    }
});

// ===================================================
// 控制台日志
// ===================================================

console.log('%cPakePlus 移动端文件上传下载增强脚本已加载', 
    'color: white; background: linear-gradient(90deg, #2196F3, #4CAF50); padding: 5px 10px; border-radius: 4px; font-weight: bold;');

console.log('%c移动端文件上传解决方案:', 'color: #4CAF50; font-weight: bold;');
console.log('1. 为文件输入框添加自定义按钮，解决点击问题');
console.log('2. 支持文件预览和移除功能');
console.log('3. 添加全局上传区域，支持拖拽上传');
console.log('4. 文件下载链接不会被拦截');

// 脚本加载完成
console.log('脚本加载完成，移动端文件上传问题已解决');