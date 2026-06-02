// ==========================================
// 1. АНИМАЦИЯ ФОНА CANVAS (СЕТЬ ЧАСТИЦ)
// ==========================================
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 255, 102, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCanvas() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 8000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 102, ${0.2 - distance/600})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}

initCanvas();
animateCanvas();

// ==========================================
// 2. ЛОГИКА ТЕРМИНАЛА И LIVE-ОБНОВЛЕНИЙ
// ==========================================
const outputDiv = document.getElementById('terminal-output');

const bootLogs = [
    "Initiating system diagnostics...",
    "Loading kernel modules... [OK]",
    "Mounting virtual filesystems... [OK]",
    "Establishing secure connection to GitHub gateway...",
    "Bypassing firewall... [SUCCESS]",
    "Launching Live Telemetry Dashboard..."
];

let lineIndex = 0;
let charIndex = 0;
let currentLineElement = null;
const cursor = document.createElement('span');
cursor.className = 'cursor';

// Функция печати логов загрузки
function typeBootLogs() {
    if (lineIndex < bootLogs.length) {
        if (charIndex === 0) {
            currentLineElement = document.createElement('div');
            currentLineElement.className = 'terminal-line';
            outputDiv.appendChild(currentLineElement);
            outputDiv.appendChild(cursor);
        }

        if (charIndex < bootLogs[lineIndex].length) {
            currentLineElement.innerHTML += bootLogs[lineIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeBootLogs, 5); // Очень быстрая печать логов
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeBootLogs, 150);
        }
        outputDiv.scrollTop = outputDiv.scrollHeight;
    } else {
        // Когда логи закончились, очищаем терминал и запускаем дашборд
        setTimeout(launchLiveDashboard, 500);
    }
}

// Запуск живого дашборда
function launchLiveDashboard() {
    // Очищаем консоль
    outputDiv.innerHTML = '';
    
    // Вставляем шаблон с ID для динамических данных
    const dashboardHTML = `
<div class="terminal-line">=======================================================================</div>
<div class="terminal-line">                     HOST SYSTEM CORE SPECIFICATIONS                   </div>
<div class="terminal-line">=======================================================================</div>
<div class="terminal-line">KERNEL:       Linux 6.12.4-cyber-node_x86_64</div>
<div class="terminal-line">UPTIME:       <span id="sys-uptime" class="dynamic-val">00 days, 00:00:00</span></div>
<div class="terminal-line">STATUS:       <span class="dynamic-val">ONLINE // SECURE_MODE_ACTIVE</span></div>
<div class="terminal-line"> </div>
<div class="terminal-line">[+] HARDWARE ENGINE LIVE:</div>
<div class="terminal-line">-----------------------------------------------------------------------</div>
<div class="terminal-line">CPU USAGE:    [<span id="cpu-bar">|||||                        </span>] <span id="sys-cpu" class="dynamic-val">12.4</span>%  (Intel Core i3-6100)</div>
<div class="terminal-line">RAM USAGE:    [<span id="ram-bar">||||||||                     </span>] <span id="sys-ram" class="dynamic-val">4.21</span>GB / 16GB</div>
<div class="terminal-line">NET PING:     <span id="sys-ping" class="dynamic-val">14</span>ms to gateway</div>
<div class="terminal-line"> </div>
<div class="terminal-line">[+] ACTIVE DAEMONS & RUNNING PROCESSES:</div>
<div class="terminal-line">-----------------------------------------------------------------------</div>
<div class="terminal-line">[PID 1024]  python3 tg_scraper.py      | MEM: <span id="pid-1" class="dynamic-val">4.2</span>% | STATUS: RUNNING</div>
<div class="terminal-line">[PID 2048]  wine win_app_manager.exe   | MEM: <span id="pid-2" class="dynamic-val">2.1</span>% | STATUS: POLLING</div>
<div class="terminal-line">[PID 4096]  node password_vault.js     | MEM: <span id="pid-3" class="dynamic-val">1.8</span>% | STATUS: CRYPTO</div>
<div class="terminal-line"> </div>
<div class="terminal-line">=======================================================================</div>
<div class="terminal-line">> Access Source Code: <a href="https://github.com/ТВОЙ_НИК" target="_blank" style="color: #00ffff; text-decoration: underline; font-weight: bold;">[OPEN_GITHUB_REPOSITORIES]</a></div>
`;
    
    outputDiv.innerHTML = dashboardHTML;
    outputDiv.appendChild(cursor);
    
    startLiveUpdates();
}

// Генерация случайных живых данных
function startLiveUpdates() {
    let uptimeSeconds = 3654300; // Начальное время работы (около 42 дней)

    setInterval(() => {
        // Обновление времени работы (Uptime)
        uptimeSeconds++;
        let d = Math.floor(uptimeSeconds / 86400);
        let h = Math.floor((uptimeSeconds % 86400) / 3600).toString().padStart(2, '0');
        let m = Math.floor((uptimeSeconds % 3600) / 60).toString().padStart(2, '0');
        let s = (uptimeSeconds % 60).toString().padStart(2, '0');
        document.getElementById('sys-uptime').innerText = `${d} days, ${h}:${m}:${s}`;

        // Обновление CPU
        let cpuLoad = (Math.random() * 15 + 5).toFixed(1); // от 5 до 20%
        document.getElementById('sys-cpu').innerText = cpuLoad;
        let cpuBars = Math.floor(cpuLoad / 1.5);
        document.getElementById('cpu-bar').innerText = '||'.repeat(cpuBars) + '  '.repeat(15 - cpuBars);

        // Обновление RAM
        let ramLoad = (Math.random() * 0.4 + 4.0).toFixed(2); // легкие колебания памяти
        document.getElementById('sys-ram').innerText = ramLoad;

        // Обновление Ping
        document.getElementById('sys-ping').innerText = Math.floor(Math.random() * 15 + 8); // от 8 до 23мс

        // Обновление нагрузки процессов
        document.getElementById('pid-1').innerText = (Math.random() * 0.5 + 4.0).toFixed(1);
        document.getElementById('pid-2').innerText = (Math.random() * 0.3 + 2.0).toFixed(1);
        document.getElementById('pid-3').innerText = (Math.random() * 0.2 + 1.7).toFixed(1);

    }, 1000); // Обновление каждую секунду
}

// Старт
setTimeout(typeBootLogs, 500);