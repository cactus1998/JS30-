const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// 取得影片
function getVideo() {
  // 取得user的視訊裝置，回傳Promise狀態
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
    // 如果允許則把回傳的MediaStream寫進html的video tag中並播放
    .then(localMediaStream => {
      /* console.log(localMediaStream); */
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    // 當失敗時印出錯誤結果
    .catch(err => {
      console.error(`ERROR: `, err);
    })
}

// 用於將視訊畫面繪製到畫布上並進行處理
function paintToCanvas() {
  // 獲取視訊的寬度和高度
  const width = video.videoWidth;
  const height = video.videoHeight;
  // 設置畫布的寬度和高度
  canvas.width = width;
  canvas.height = height;

  // 定期執行一個匿名函式
  return setInterval(() => {
    // 將視訊畫面繪製到畫布上
    ctx.drawImage(video, 0, 0, width, height);
    // 取得畫布上的像素資料
    let pixels = ctx.getImageData(0, 0, width, height);

    // 進行像素處理
    pixels = rgbSplit(pixels);

    // 將處理後的像素資料放回畫布
    ctx.putImageData(pixels, 0, 0);
  }, 16); // 每 16 毫秒執行一次匿名函式
}

// 拍攝照片並顯示在網頁上
function takePhoto() {
  // 播放快門聲音
  snap.currentTime = 0;
  snap.play();

  // 將畫布中的內容轉換為 data URL 格式的圖片資料
  const data = canvas.toDataURL('image/jpeg');
  // 創建一個新的超連結元素
  const link = document.createElement('a');
  link.href = data;
  // 設置超連結的下載屬性和內容
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  // 在網頁上插入超連結，顯示拍攝的照片
  strip.insertBefore(link, strip.firstChild);
}

// 對像素資料進行紅色效果的處理
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // 增強紅色通道、減弱綠色通道、減弱藍色通道
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

// 定義 rgbSplit 函式，用於對像素資料進行 RGB 分離效果的處理
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // 將每個像素的 R、G、B 通道的值分別移到其他位置，產生分離效果
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

// 定義 greenScreen 函式，用於對像素資料進行綠幕效果的處理
function greenScreen(pixels) {
  // 定義顏色範圍的物件
  const levels = {};

  // 遍歷所有 .rgb input 元素，並將其值存入 levels 物件中
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // 遍歷所有像素
  for (let i = 0; i < pixels.data.length; i += 4) {
    // 分別取得紅、綠、藍、透明度通道的值
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // 檢查是否在指定的顏色範圍內
    if (red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax) {
      // 將在指定範圍內的像素設置為透明
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);
