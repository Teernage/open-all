document.addEventListener('DOMContentLoaded', function () {
  const urlInput = document.getElementById('urlInput');
  const openBtn = document.getElementById('openBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');

  // 恢复上次保存的输入
  chrome.storage.local.get(['savedUrls'], function (result) {
    if (result.savedUrls) {
      urlInput.value = result.savedUrls;
    }
  });

  // 自动保存输入内容
  urlInput.addEventListener('input', function () {
    chrome.storage.local.set({ savedUrls: urlInput.value });
  });

  // 清空按钮
  clearBtn.addEventListener('click', function () {
    urlInput.value = '';
    chrome.storage.local.remove(['savedUrls']);
    showStatus('已清空');
  });

  // 打开URL按钮
  openBtn.addEventListener('click', function () {
    const urls = getUrls(urlInput.value);
    if (urls.length === 0) {
      showStatus('请输入有效的URL');
      return;
    }

    // 创建新窗口并一次性打开所有URL
    chrome.windows.create(
      {
        url: urls, // 直接传入数组即可在新窗口中打开多个标签
        focused: true,
        type: 'normal',
      },
      function () {
        urlInput.value = '';
        chrome.storage.local.remove(['savedUrls']);
        showStatus(`已打开 ${urls.length} 个URL`);
      }
    );
  });

  // 解析URL
  function getUrls(input) {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line && (line.startsWith('http://') || line.startsWith('https://'))
      );
  }

  // 显示状态
  function showStatus(message) {
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }
});
