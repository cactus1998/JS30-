/* Get Our Elements */
// 獲取播放器的各個元素
const player = document.querySelector('.player');
const video = player.querySelector('.viewer'); // 影片元素
const progress = player.querySelector('.progress'); // 進度條外層元素
const progressBar = player.querySelector('.progress__filled'); // 進度條填充元素
const toggle = player.querySelector('.toggle'); // 播放按鈕
const skipButtons = player.querySelectorAll('[data-skip]'); // 跳過按鈕
const ranges = player.querySelectorAll('.player__slider'); // 音量/速度控制滑塊


// 切換播放/暫停狀態
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    // 這裡使用了動態屬性存取 (Dynamic Property Access) 的方式，根據 method 的值，動態地決定要調用的方法。
    video[method]();
}

// 根據影片的播放狀態更新播放按鈕的圖標
function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

// 根據按鈕的設定值跳過指定時間
function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

// 根據音量/速度控制滑塊的值更新影片相應的屬性
function handleRangeUpdate() {
    video[this.name] = this.value;
}

// 根據影片的當前播放時間更新進度條的寬度
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

// 根據滑鼠點擊或拖動的位置調整影片的播放時間
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

/* Hook up the event listeners */
// 綁定事件監聽器

// 影片元素綁定點擊、播放、暫停、時間更新事件
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

// 播放按鈕綁定點擊事件，切換播放/暫停
toggle.addEventListener('click', togglePlay);

// 跳過按鈕綁定點擊事件，實現快進/快退
skipButtons.forEach(button => button.addEventListener('click', skip));

// 音量/速度控制滑塊綁定改變和滑鼠移動事件，更新相應的影片屬性
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// 進度條綁定點擊、滑鼠移動、滑鼠按下和釋放事件，實現拖動進度條來調整播放時間
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
