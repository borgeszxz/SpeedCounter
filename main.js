function rand(min, max, decimals = 0) {
  const value = Math.random() * (max - min) + min;
  return decimals ? value.toFixed(decimals) : Math.round(value);
}
function fakeIP() {
  return [rand(10,223),rand(0,255),rand(0,255),rand(1,254)].join(".");
}

const goBtn = document.getElementById('goBtn');
const goBtnText = document.getElementById('goBtnText');
const loaderGo = document.getElementById('loaderGo');
const pingValue = document.getElementById('pingValue');
const jitterValue = document.getElementById('jitterValue');
const lossValue = document.getElementById('lossValue');
const downloadValue = document.getElementById('downloadValue');
const uploadValue = document.getElementById('uploadValue');
const downloadNeedle = document.getElementById('downloadNeedle');
const uploadNeedle = document.getElementById('uploadNeedle');
const userIp = document.getElementById('userIp');

function valueToAngle(val, min, max) {
  const percent = Math.min((val - min) / (max - min), 1);
  return -90 + 180 * percent;
}

function gerarResultadosFinais() {
  return {
    ping: rand(6, 38),
    jitter: rand(1, 12),
    loss: rand(0, 2),
    download: rand(120, 930, 2),
    upload: rand(21, 340, 2)
  }
}
const rangeDownload = { min: 0, max: 1000 };
const rangeUpload = { min: 0, max: 350 };

async function startSpeedTest() {
  goBtn.classList.add('disabled');
  goBtnText.style.visibility = "hidden";
  loaderGo.classList.remove('hidden');
  pingValue.textContent = '...';
  jitterValue.textContent = '...';
  lossValue.textContent = '...';
  downloadValue.textContent = '...';
  uploadValue.textContent = '...';
  downloadNeedle.style.transform = `rotate(-90deg)`;
  uploadNeedle.style.transform = `rotate(-90deg)`;

  const final = gerarResultadosFinais();
  userIp.textContent = fakeIP();

  await new Promise(r => setTimeout(r, 700));
  pingValue.textContent = rand(8, 40);
  jitterValue.textContent = rand(2, 18);
  lossValue.textContent = rand(0, 5);
  await new Promise(r => setTimeout(r, 350));
  pingValue.textContent = final.ping;
  jitterValue.textContent = final.jitter;
  lossValue.textContent = final.loss;

  await animateNeedleAndValue({
    valueElem: downloadValue,
    needleElem: downloadNeedle,
    finalValue: final.download,
    min: rangeDownload.min,
    max: rangeDownload.max,
    unit: "Mbps",
    duration: 2800,
    float: 2,
  });

  await new Promise(r => setTimeout(r, 600));
  await animateNeedleAndValue({
    valueElem: uploadValue,
    needleElem: uploadNeedle,
    finalValue: final.upload,
    min: rangeUpload.min,
    max: rangeUpload.max,
    unit: "Mbps",
    duration: 1800,
    float: 2,
  });

  goBtn.classList.remove('disabled');
  loaderGo.classList.add('hidden');
  goBtnText.style.visibility = "visible";
}

function animateNeedleAndValue({
  valueElem,
  needleElem,
  finalValue,
  min,
  max,
  unit,
  duration,
  float = 0
}) {
  return new Promise((resolve) => {
    let t = 0;
    const steps = Math.round(duration / 15);
    function animateStep() {
      t++;
      let progress = t / steps;
      if (progress > 1) progress = 1;
      const ease = 1 - Math.pow(1 - progress, 2.2);

      const curVal = min + (finalValue - min) * ease;
      const angle = valueToAngle(curVal, min, max);
      needleElem.style.transform = `rotate(${angle}deg)`;

      if (progress < 0.98) {
        valueElem.textContent = rand(
          Math.max(min, curVal - 15),
          curVal + 5,
          float
        );
      } else {
        valueElem.textContent = finalValue;
      }

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        needleElem.style.transform = `rotate(${valueToAngle(finalValue, min, max)}deg)`;
        valueElem.textContent = finalValue;
        resolve();
      }
    }
    animateStep();
  });
}

goBtn.addEventListener('click', () => {
  if(!goBtn.classList.contains('disabled')) startSpeedTest();
});

downloadNeedle.style.transform = `rotate(-90deg)`;
uploadNeedle.style.transform = `rotate(-90deg)`;

userIp.textContent = fakeIP();
