// ═══════════════════════════════════════════
//  NAV PAGES CONFIG (single source of truth)
// ═══════════════════════════════════════════
const NAV_PAGES = [
    { id: 'root',                  label: '~/',                        action: null },
    { id: 'education',             label: 'education/',                action: null },
    { id: 'experience',            label: 'experience/',               action: null },
    { id: 'projects',              label: 'projects/',                 action: null },
    { id: 'skills',                label: 'skills/',                   action: null },
    { id: 'achievements',          label: 'achievements/',             action: null },
    { id: 'life_outside_terminal', label: 'life_outside_terminal/',    action: null },
    { id: 'contact',               label: 'contact/',                  action: 'ping' },
];

// Build nav links dynamically to eliminate redundancy
(function buildNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.innerHTML = '';
    NAV_PAGES.forEach((page, i) => {
        const a = document.createElement('a');
        a.id = 'link-' + page.id;
        a.textContent = page.label;
        if (i === 0) a.classList.add('active');
        a.addEventListener('click', () => {
            if (page.action === 'ping') {
                showPing();
            } else {
                switchPage(page.id);
            }
            closeMobileNav();
        });
        navLinks.appendChild(a);
    });
})();

// ═══════════════════════════════════════════
//  MATRIX RAIN
// ═══════════════════════════════════════════
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');
let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;
const CHARS   = '01';
const FSIZE   = 14;
let cols      = Math.floor(W / FSIZE);
let drops     = Array.from({length: cols}, () => Math.random() * -50);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0,10,0,0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#39ff14';
    ctx.font = FSIZE + 'px Share Tech Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
        ctx.fillText(CHARS[Math.floor(Math.random()*CHARS.length)], i*FSIZE, drops[i]*FSIZE);
        if (drops[i]*FSIZE > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);
window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / FSIZE);
    drops = Array.from({length: cols}, () => Math.random() * -50);
});

// ═══════════════════════════════════════════
//  DISK SPINNER → BOOT SEQUENCE
// ═══════════════════════════════════════════
const diskSpinner = document.getElementById('disk-spinner');
const diskLabelsEl = document.getElementById('diskLabels');
const bootScreen = document.getElementById('boot-screen');

// Populate spinning labels
const osLabels = ['linux','parrot','nmap','metasploit','burpsuite','openssl','gdb','gcc','python','bash','iptables','selinux','wireshark','docker','kubectl','terraform','oscp','htb','ctf','sec'];
osLabels.forEach((lbl, i) => {
    const angle = (i / osLabels.length) * 2 * Math.PI;
    const r = 95;
    const x = 110 + r * Math.cos(angle) - 10;
    const y = 110 + r * Math.sin(angle) - 5;
    const el = document.createElement('div');
    el.className = 'disk-label-item';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.textContent = lbl;
    diskLabelsEl.appendChild(el);
});

const genHex = () => '0x' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');

const bootLines = [
    {t:`[    0.000000] Linux version 6.7.0-parrot-sec (gcc version 12.2.0 (Debian 12.2.0-14))`, c:'boot-kernel'},
    {t:`[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz root=UUID=b4a9... ro quiet splash`, c:'boot-kernel'},
    {t:`[    0.012034] x86/CPU: CPU 0 initialized. Memory: ${genHex()}-${genHex()}`, c:''},
    {t:'[    0.045123] ACPI: Core revision 20230621', c:''},
    {t:'[    0.103948] secureboot: Could not determine secure boot state', c:'boot-warn'},
    {t:'[    0.203102] PCI: Using ACPI for IRQ routing', c:''},
    {t:'[    0.512349] random: crng init done', c:'boot-ok'},
    {t:'[  OK  ] Started udev Kernel Device Manager.', c:'boot-ok'},
    {t:'[  OK  ] Reached target Local File Systems.', c:'boot-ok'},
    {t:'[  OK  ] Started Network Manager.', c:'boot-ok'},
    {t:'[  OK  ] Started wpa_supplicant.service - WPA supplicant.', c:'boot-ok'},
    {t:'Starting sshd.service - OpenBSD Secure Shell server...', c:'boot-sys'},
    {t:'[  OK  ] Started sshd.service', c:'boot-ok'},
    {t:'[WARN  ] SELinux is operating in Enforcing mode.', c:'boot-warn'},
    {t:'[  OK  ] Mounted /mnt/projects  (6 repos found)', c:'boot-ok'},
    {t:'[  OK  ] Loaded module: ML_Isolation_Forest_Anomaly_Detection', c:'boot-ok'},
    {t:'[  OK  ] Loaded module: CloudHawk_SIEM_v1.0  (10,000 evt/s)', c:'boot-ok'},
    {t:'[  OK  ] Loaded module: Dynamic_One-Time_Pad_Algorithm_v2.0', c:'boot-ok'},
    {t:'[  OK  ] Initializing shell environment...', c:'boot-ok'},
    {t:'', c:''},
];

let li = 0;
function printBootLine() {
    if (li < bootLines.length) {
        const d  = li < 8 ? Math.random()*18+4 : Math.random()*80+18;
        const ld = bootLines[li];
        const div = document.createElement('div');
        div.className = `boot-line ${ld.c}`;
        div.textContent = ld.t || '\u00A0';
        bootScreen.appendChild(div);
        bootScreen.scrollTop = bootScreen.scrollHeight;
        li++;
        setTimeout(printBootLine, d);
    } else {
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => bootScreen.style.display = 'none', 600);
        }, 250);
    }
}
window.onload = () => {
    // Show disk spinner for ~2.8s then boot
    setTimeout(() => {
        diskSpinner.style.transition = 'opacity 0.5s';
        diskSpinner.style.opacity = '0';
        setTimeout(() => {
            diskSpinner.style.display = 'none';
            printBootLine();
        }, 500);
    }, 2500);
};

// ═══════════════════════════════════════════
//  ICMP PING ANIMATION
// ═══════════════════════════════════════════
function showPing() {
    const overlay = document.getElementById('ping-overlay');
    const linesEl = document.getElementById('ping-lines');
    linesEl.innerHTML = '';
    overlay.classList.add('show');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('link-contact').classList.add('active');

    const pingResults = [
        { delay: 0,    text: 'PING 0xns.dev: 56 data bytes', color: 'var(--muted)' },
        { delay: 400,  text: '64 bytes from 0xns.dev: icmp_seq=1 ttl=64 time=0.42 ms', color: 'var(--green)' },
        { delay: 800,  text: '64 bytes from 0xns.dev: icmp_seq=2 ttl=64 time=0.38 ms', color: 'var(--green)' },
        { delay: 1200, text: '64 bytes from 0xns.dev: icmp_seq=3 ttl=64 time=0.41 ms', color: 'var(--green)' },
        { delay: 1600, text: '64 bytes from 0xns.dev: icmp_seq=4 ttl=64 time=0.39 ms', color: 'var(--green)' },
        { delay: 2000, text: '--- 0xns.dev ping statistics ---', color: 'var(--cyan)' },
        { delay: 2100, text: '4 packets transmitted, 4 received, 0% packet loss', color: 'var(--cyan)' },
        { delay: 2200, text: 'rtt min/avg/max/mdev = 0.38/0.40/0.42/0.015 ms', color: 'var(--cyan)' },
        { delay: 2400, text: '[ HOST REACHABLE — amanns0525@gmail.com ]', color: 'var(--amber)' },
    ];
    pingResults.forEach(r => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'ping-line show';
            div.style.color = r.color;
            div.textContent = r.text;
            linesEl.appendChild(div);
        }, r.delay);
    });
    setTimeout(() => {
        overlay.querySelector('.ping-close').style.opacity = '1';
    }, 2500);
}

function closePing() {
    document.getElementById('ping-overlay').classList.remove('show');
    switchPage('contact');
}

// ═══════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════
function toggleMobileNav() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('navHamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
}

function closeMobileNav() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('navHamburger');
    nav.classList.remove('open');
    btn.classList.remove('open');
}

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('navHamburger');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
        closeMobileNav();
    }
});

function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => {
        s.classList.remove('active');
        s.style.animation = 'none';
        void s.offsetHeight;
        s.style.animation = null;
    });
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('link-' + pageId).classList.add('active');
    if (pageId === 'root') document.getElementById('commandInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════
//  TERMINAL
// ═══════════════════════════════════════════
const inputField  = document.getElementById('commandInput');
const historyDiv  = document.getElementById('history');
const termBody    = document.getElementById('terminalBody');
const pathDisplay = document.getElementById('term-prompt-path');
const titleBar    = document.getElementById('term-title-bar');
let currentDir    = '~';
let cmdHistory    = [];
let histIdx       = -1;

// availableDirs derived from NAV_PAGES (single source of truth, excludes root/contact special cases)
const availableDirs = NAV_PAGES
    .map(p => p.id)
    .filter(id => id !== 'root' && id !== 'contact')
    .concat(['contact']);

const FILES = {
    'education': { 'data.txt': `<span style="color:var(--cyan)">═══ EDUCATION ═══</span>

<span style="color:var(--green)">New York University — Tandon School of Engineering</span>
<span style="color:var(--amber)">M.S. Cybersecurity</span> | Brooklyn, NY | Sept 2025 – May 2027 | <span style="color:var(--green)">GPA: 4.0</span>
  Fall 2025   : Design & Analysis of Algorithms · Computer Networking · Network Security
  Spring 2026 : Penetration Testing · Cloud Computing · Applied Cryptography
  Fall 2026   : Information Security & Privacy · Application Security · Cloud Security
  Spring 2027 : Offensive Security · TBD

<span style="color:var(--green)">BITS Pilani — Goa Campus</span>
<span style="color:var(--amber)">B.E. Electronics & Communication Engineering</span> | Aug 2019 – Jun 2023 | <span style="color:var(--green)">CGPA: 8.10/10</span>
  Courses: DSA · Discrete Math · OOP (Java) · OS · Cryptography · Communication Networks · Probability · Linear Algebra` },

    'experience': { 'data.txt': `<span style="color:var(--cyan)">═══ EXPERIENCE ═══</span>

<span style="color:var(--green)">Salesforce — Network Software Cloud (Egress Gateway)</span>
<span style="color:var(--amber)">Member of Technical Staff (SWE II)</span> | Hyderabad | Feb 2025 – Aug 2025
  → Deployed GCP Secure Web Proxy + Cloud NAT via Terraform — enforced global ACLs
  → Enabled SELinux Enforcing mode on RHEL9 across Puppet, AIDE, Collectd, Docker
  → Mentored intern on AI Agents for Slack — reduced Time to Diagnose by <span style="color:var(--green)">90%</span>
  → Benchmarked AWS Intel vs. Graviton for scalability and cost efficiency
  → Migrated Publicproxy in GovCloud (GIA2H) via Falcon Developer Portal

<span style="color:var(--green)">Salesforce — Network Software Cloud (Egress Gateway)</span>
<span style="color:var(--amber)">Associate Member of Technical Staff (SWE I)</span> | Bengaluru | Jul 2023 – Jan 2025
  → Managed Tier-0 Egress Gateway securing internet access for all Salesforce customers
  → Led U.S. GovCloud PublicProxy deployment — <span style="color:var(--green)">60% ahead of schedule</span>
  → Resolved critical circular DNS/PublicProxy dependency with zero downtime
  → Upgraded Squid proxy to TLS 1.3; migrated CentOS 7 → RHEL9 on AWS + Alibaba Cloud
  → Led DDoS incident response — 24/7 on-call for production outages
  → Reduced customer queries by <span style="color:var(--green)">95%</span> via FEDX activity status tracking

<span style="color:var(--green)">Salesforce — Network Software Cloud (Egress Gateway)</span>
<span style="color:var(--amber)">Software Engineering Intern</span> | May 2022 – Jul 2022
  → Implemented private VPC endpoints (Interface + Gateway) for S3 and SQS
  → <span style="color:var(--green)">88% average daily cost savings</span> by routing traffic through AWS private network

<span style="color:var(--green)">Texas Instruments — Analog Signal Chain Team</span>
<span style="color:var(--amber)">Analog Intern</span> | Bengaluru | Jan 2023 – Jun 2023
  → Engineered high-speed SPI on Arty A7 FPGA using Verilog @ 120 MHz
  → <span style="color:var(--green)">45% cost reduction</span> vs NI-based setups
  → Built cross-platform GUI in Python (Tkinter/PySide6) for SPI data management` },

    'projects': {
        'cloudhawk.md': `<span style="color:var(--cyan)">═══ CloudHawk ═══</span>
Distributed SIEM | Python, Kafka, ML | Jan 2026
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/cloudhawk" target="_blank" class="term-link">github.com/Alien0525/cloudhawk</a>
Ingests AWS CloudTrail at 10,000+ events/sec via Kafka.
Sub-100ms detection via rule-based correlation, MITRE ATT&CK mapping,
and ML anomaly detection (Isolation Forest).
React dashboard with WebSocket live updates.
Stack: Kafka · Python · FastAPI · Docker · ML`,

        'shardguard.md': `<span style="color:var(--cyan)">═══ ShardGuard ═══</span>
LLM Security Framework | NYU Secure Systems Lab | Oct 2025 – Present
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/ShardGuard" target="_blank" class="term-link">github.com/Alien0525/ShardGuard</a>
AI security framework addressing prompt injection, data exfiltration,
and privilege escalation in LLM-powered agent systems.
Planning/execution LLM separation with opaque value handling
and least-privilege MCP access control.
Stack: Python · LLM Security · MCP · AI Security`,

        'otp-protocol.md': `<span style="color:var(--cyan)">═══ Dynamic Multiparty OTP ═══</span>
Python, Cryptography | Jan 2026
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/dynamic-multiparty-otp-protocol" target="_blank" class="term-link">github.com/Alien0525/dynamic-multiparty-otp-protocol</a>
Dynamic pad reallocation protocol maintaining perfect secrecy.
Validated across 80,000 executions (zero collisions).
Reduced pad waste to 2.0%–12.2% vs 66.7% baseline (up to 28× improvement).
Includes web visualizer, CLI test suite, and lightweight API.
Stack: Python · Cryptography · Distributed Systems`,

        'chatbot.md': `<span style="color:var(--cyan)">═══ Dining Concierge Chatbot ═══</span>
AWS Serverless | Feb 2026
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/dining-concierge-chatbot" target="_blank" class="term-link">github.com/Alien0525/dining-concierge-chatbot</a>
Fully serverless NLU-driven restaurant recommendation system.
Processes queries across 1,000+ restaurants using AWS Lambda, Lex, and OpenSearch.
Implements least-privilege IAM and event-driven microservices architecture.
Stack: AWS Lambda · Lex · DynamoDB · OpenSearch · Serverless`,

        'udp-toolkit.md': `<span style="color:var(--cyan)">═══ UDP Networking Toolkit ═══</span>
Python, Sockets | Nov 2025
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/udp-networking-toolkit" target="_blank" class="term-link">github.com/Alien0525/udp-networking-toolkit</a>
Built reliable transport protocols over raw UDP from scratch.
Implements RTT measurement, heartbeat failure detection,
and reliable file transfer using ACKs, retransmission, and adaptive timeouts.
Stack: Python · Socket Programming · Protocol Design`,

        'blockchain-vote.md': `<span style="color:var(--cyan)">═══ Blockchain Voting System ═══</span>
Solidity, Ethereum | May 2021
<span style="color:#bf5fff">$</span> open <a href="https://github.com/Alien0525/Blockchain-Based-Voting-System-For-Election" target="_blank" class="term-link">github.com/Alien0525/Blockchain-Based-Voting-System-For-Election</a>
Developed tamper-proof voting system using Ethereum smart contracts.
Ensures immutable vote storage and secure identity verification via MetaMask.
Deployed and tested on Ethereum Ropsten testnet.
Stack: Solidity · Ethereum · Smart Contracts · Web3`,

        'u2u-research.md': `<span style="color:var(--cyan)">═══ U2U Communication Outage Analysis ═══</span>
BITS Pilani Research | Aug 2022 – Dec 2022
Designed algorithm for optimal UAV relay selection in full-duplex cooperative networks.
Achieved ~50% reduction in outage probability via MATLAB simulations.
Co-authored research under faculty supervision.
Stack: MATLAB · Wireless Communication · Algorithm Design · Research`,
    },

    'skills': { 'data.txt': `<span style="color:var(--cyan)">═══ SKILLS ═══</span>

<span style="color:var(--amber)">// programming & scripting</span>
  Python · Go · C · C++ · Java · JavaScript · Bash · PowerShell · SQL · Solidity · Assembly · Verilog · MATLAB

<span style="color:var(--amber)">// cybersecurity</span>
  Network Penetration Testing · Cloud Security (AWS, GCP) · Vulnerability Assessment · Web Application Security
  CVE Analysis · OSINT · Reverse Engineering · OWASP Top 10 · MITRE ATT&CK

<span style="color:var(--amber)">// security tools</span>
  Burp Suite · Metasploit · Nmap · Wireshark · Gobuster · ffuf · Nikto · Hashcat
  John the Ripper · Netcat · Ghidra · GDB

<span style="color:var(--amber)">// cloud & devops</span>
  AWS · Google Cloud Platform · Docker · Kubernetes · Terraform · CI/CD · Git/GitHub

<span style="color:var(--amber)">// networking & systems</span>
  TCP/IP · DNS · HTTP/HTTPS · TLS · SSH · Firewalls · VPN · iptables · Linux · Network Traffic Analysis

<span style="color:var(--amber)">// detection & monitoring</span>
  Splunk · AWS CloudWatch · Grafana · Prometheus

<span style="color:var(--amber)">// backend & distributed systems</span>
  FastAPI · Node.js · Express.js · Django · REST APIs · Apache Kafka · Redis
  Elasticsearch · OpenSearch · MongoDB · PostgreSQL

<span style="color:var(--amber)">// ai / ml security</span>
  Machine Learning (scikit-learn) · LLM Security · Prompt Injection Security` },

    'life_outside_terminal': { 'data.txt': `<span style="color:var(--cyan)">═══ LIFE_OUTSIDE_TERMINAL ═══</span>

<span style="color:var(--amber)">// volunteering</span>
  Salesforce VTO        Earthforce, education drives, Green Diwali — Bengaluru & Hyderabad, 2023–2025
  Blue Cross Hyderabad  Animal care volunteer — feeding, cleaning, adoption drives, 2024–2025
  Nirmaan Organization  Free tutoring (Math/Sci/English) → 4 students cleared Navodaya Entrance Exam, 2020–2021

<span style="color:var(--amber)">// leadership</span>
  Placement Unit, BITS  Internship coordinator — 1,000+ students, 140+ companies onboarded, 2021–2022
  Salesforce G T&P Tour Team representative — Egress Gateway demos, Oct 2024

<span style="color:var(--amber)">// developer society</span>
  Developers' Society   Senior Web Dev — college fest sites (1,000+ attendees), 7+ hackathons, 2020–2021
  <span style="color:var(--muted)">// turns out I couldn't escape the terminal after all</span>` },

    'achievements': { 'data.txt': `<span style="color:var(--cyan)">═══ ACHIEVEMENTS ═══</span>

<span style="color:var(--amber)">// competitive programming</span>
  CodeChef    ★★★★ 1980  |  Global Rank <span style="color:var(--green)">176</span> — March Starters 2021
  Codeforces  Expert 1654 |  Global Rank <span style="color:var(--green)">929</span> — Round 744
  Google Kickstart 2021   |  Rank 398

<span style="color:var(--amber)">// hackathons & awards</span>
  🏆 Salesforce Futureforce'22 — Judge's Choice
     NLP platform converting text & speech to Indian Sign Language
  🤖 Salesforce Color of AI (2024)
     Automated release-note case creation via Git APIs + OpenAI — 90% dev efficiency gain
  💻 Salesforce Codegenie (2024)
     AI assistant integrating Stack Overflow directly into VS Code
  🏅 Engineering Excellence Award (EngX) 2024
     Salesforce Release 252 — quarterly award for outstanding performance
  🔓 BITSCTF 2021 Winner
     Led cryptography and web exploitation challenges` },

    'contact': { 'data.txt': `<span style="color:var(--cyan)">═══ CONTACT ═══</span>

  📧  amanns0525@gmail.com | aas10498@nyu.edu
  🐙  github.com/Alien0525
  💼  linkedin.com/in/amanns0525
  📱  +1 (201) 238-6376

<span style="color:var(--green)">Open to opportunities</span>
  Security Engineering · Offensive Security · Network Security · AI Red Teaming roles`, '.secret': `-----BEGIN CLASSIFIED-----
alias: Alien0525
clearance: OSCP-in-progress | HTB-active
current_op: ShardGuard - LLM security research @ NYU
0day_interest: LLM prompt injection, cloud misconfigs, supply chain
ctf_stack: pwntools, radare2, z3, angr, ghidra
fun_fact: broke prod once, fixed it before anyone noticed
coffee_dependency: critical
hire_probability: 99.7% (if you got this far)
-----END CLASSIFIED-----` },
};

const ROOT_HIDDEN = {
    '.bashrc': 'export PS1="guest@aman-sec:\\w\\$ "\nalias ll="ls -la"\nalias cls="clear"\nexport EDITOR=vim\n# i was wondering when you\'d open this',
    '.ssh/': { isDir: true, msg: 'drwx------ (go away)' },
    '.secret': `0x666c61677b637572696f736974795f6c65645f75735f66726f6d5f666972655f746f5f6669726577616c6c737d`
};

const SUDO_RESPONSES = [
    '<span style="color:var(--amber)">[SUDO] Checking if guest has root...</span>',
    '<span style="color:var(--red)">guest is not in the sudoers file. This incident will be reported.</span>',
    '<span style="color:var(--green)">(try: sudo hire me)</span>',
];

function appendOutput(promptHtml, responseHtml) {
    historyDiv.innerHTML += promptHtml + (responseHtml ? `<div class="output">${responseHtml}</div>` : '');
    termBody.scrollTop = termBody.scrollHeight;
}

function buildPrompt(cmd) {
    return `<div class="prompt-line" style="margin-top:4px"><span class="user-host">guest@0xns</span>:<span class="path">${currentDir}</span><span class="prompt-char">$</span> ${esc(cmd)}</div>`;
}
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const val  = inputField.value.trim();
        const args = val.split(' ');
        const last = args[args.length-1];
        if (args[0].toLowerCase() === 'cd' && currentDir === '~') {
            const match = availableDirs.find(d => d.startsWith(last.toLowerCase()));
            if (match) { args[args.length-1] = match; inputField.value = args.join(' ') + ' '; }
        } else if (args[0].toLowerCase() === 'cat' && currentDir !== '~') {
            const dir = currentDir.replace('~/','');
            const files = Object.keys(FILES[dir]||{});
            const match = files.find(f => f.startsWith(last.toLowerCase()));
            if (match) { args[args.length-1] = match; inputField.value = args.join(' '); }
        }
        return;
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; inputField.value = cmdHistory[histIdx]; }
        return;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx < cmdHistory.length-1) { histIdx++; inputField.value = cmdHistory[histIdx]; }
        else { histIdx = cmdHistory.length; inputField.value = ''; }
        return;
    }

    if (e.key !== 'Enter') return;

    const cmdString = inputField.value.trim();
    if (!cmdString) return;

    cmdHistory.push(cmdString);
    histIdx = cmdHistory.length;

    const args = cmdString.split(' ').filter(Boolean);
    const cmd  = args[0].toLowerCase();
    const prompt = buildPrompt(cmdString);
    let response = '';

    if (cmd === 'clear') {
        historyDiv.innerHTML = '';
        inputField.value = '';
        return;
    }

    if (cmd === 'help') {
        response = `<span style="color:var(--cyan)">═══ AVAILABLE COMMANDS ═══</span>

  <span style="color:var(--amber)">ls [-la]</span>         List files and directories
  <span style="color:var(--amber)">cd &lt;dir&gt;</span>         Change directory (Tab autocomplete works!)
  <span style="color:var(--amber)">cd ..</span>            Go back to ~
  <span style="color:var(--amber)">cat &lt;file&gt;</span>       Read file contents
  <span style="color:var(--amber)">whoami</span>           Print user info
  <span style="color:var(--amber)">pwd</span>              Print working directory
  <span style="color:var(--amber)">uname -a</span>         System info
  <span style="color:var(--amber)">sudo hire me</span>     Try it 👀
  <span style="color:var(--amber)">nmap -sV aman</span>    Scan the target
  <span style="color:var(--amber)">history</span>          Command history
  <span style="color:var(--amber)">clear</span>            Clear terminal

<span style="color:var(--muted)">Tip: Use the nav bar above for formatted GUI views.</span>`;

    } else if (cmd === 'whoami') {
        response = `<span style="color:var(--cyan)">Aman Ahmed N S</span>
Role   : MS Cybersecurity @ NYU Tandon | Ex-Salesforce SWE II
Focus  : Cloud Security · Offensive Security · AI Security
Status : <span style="color:var(--green)">Open to opportunities</span>
HTB    : Active | OSCP prep in progress`;

    } else if (cmd === 'pwd') {
        response = `/home/guest/${currentDir}`;

    } else if (cmd === 'uname') {
        response = `AmanOS 6.7.0-parrot-sec #1 SMP NYU-Tandon x86_64 GNU/Linux`;

    } else if (cmd === 'ls' || (cmd === 'ls' && args[1])) {
        const showHidden = args.includes('-la') || args.includes('-a');
        if (currentDir === '~') {
            const dirs = availableDirs.map(d => `<span style="color:var(--cyan);font-weight:bold">${d}/</span>`).join('   ');
            if (showHidden) {
                const hidden = Object.keys(ROOT_HIDDEN).map(f => `<span style="color:var(--muted)">${f}</span>`).join('   ');
                response = `total ${availableDirs.length + Object.keys(ROOT_HIDDEN).length}\n${hidden}   ${dirs}`;
            } else {
                response = `total ${availableDirs.length}\n${dirs}\n<span style="color:var(--muted)">// hidden files exist — try ls -la</span>`;
            }
        } else {
            const dirName = currentDir.replace('~/','');
            const files = FILES[dirName];
            if (files) {
                response = Object.keys(files)
                    .filter(f => showHidden || !f.startsWith('.'))
                    .map(f => f.startsWith('.') ? `<span style="color:var(--muted)">${f}</span>` : `<span style="color:var(--green)">${f}</span>`)
                    .join('\n');
                if (!showHidden && Object.keys(files).some(f => f.startsWith('.'))) {
                    response += `\n<span style="color:var(--muted)">// hidden files exist — try ls -la</span>`;
                }
            } else {
                response = `(empty directory)`;
            }
        }

    } else if (cmd === 'cd') {
        const rawTarget = (args[1]||'').replace(/\/$/,'');
        const target = rawTarget.toLowerCase();
        if (!target || target === '~' || target === '..') {
            currentDir = '~';
            pathDisplay.innerText = '~';
            titleBar.innerText = 'guest@0xns : ~';
        } else if (currentDir === '~' && (target === '.ssh' || target === '.ssh/')) {
            response = `<span style="color:var(--red)">drwx------ (go away)</span>`;
        } else if (target.startsWith('../')) {
            const dest = target.slice(3);
            if (availableDirs.includes(dest)) {
                currentDir = `~/${dest}`;
                pathDisplay.innerText = currentDir;
                titleBar.innerText = `guest@0xns : ${currentDir}`;
                response = `<span style="color:var(--muted)">Entered ${currentDir}. Run <span style="color:var(--amber)">ls</span> to list files.</span>`;
            } else {
                response = `<span style="color:var(--red)">cd: ${esc(rawTarget)}: No such directory</span>`;
            }
        } else if (currentDir === '~' && availableDirs.includes(target)) {
            currentDir = `~/${target}`;
            pathDisplay.innerText = currentDir;
            titleBar.innerText = `guest@0xns : ${currentDir}`;
            response = `<span style="color:var(--muted)">Entered ${currentDir}. Run <span style="color:var(--amber)">ls</span> to list files.</span>`;
        } else if (currentDir !== '~' && availableDirs.includes(target)) {
            currentDir = `~/${target}`;
            pathDisplay.innerText = currentDir;
            titleBar.innerText = `guest@0xns : ${currentDir}`;
            response = `<span style="color:var(--muted)">Entered ${currentDir}. Run <span style="color:var(--amber)">ls</span> to list files.</span>`;
        } else {
            response = `<span style="color:var(--red)">cd: ${esc(rawTarget)}: No such directory</span>`;
        }

    } else if (cmd === 'cat') {
        const target = (args[1]||'');
        const targetLower = target.toLowerCase();
        if (!target) {
            response = `<span style="color:var(--red)">cat: missing operand</span>`;
        } else if (currentDir === '~' && (targetLower === '.ssh' || targetLower === '.ssh/')) {
            // Throws a directory error for cat to maintain the illusion
            response = `<span style="color:var(--red)">cat: .ssh: Is a directory</span>`;
        } else if (currentDir !== '~') {
            const dirName = currentDir.replace('~/','');
            const files   = FILES[dirName]||{};
            const key = files[target] !== undefined ? target : Object.keys(files).find(k => k.toLowerCase() === targetLower);
            if (key !== undefined && files[key] !== undefined) {
                response = `<span style="color:var(--muted)">// ${currentDir}/${key}</span>\n${files[key]}`;
            } else {
                response = `<span style="color:var(--red)">cat: ${esc(target)}: No such file. Run <span style="color:var(--amber)">ls -la</span> to see all files.</span>`;
            }
        } else if (ROOT_HIDDEN[target] || ROOT_HIDDEN[targetLower]) {
            const content = ROOT_HIDDEN[target] || ROOT_HIDDEN[targetLower];
            response = `<span style="color:var(--muted)">// ~/${target}</span>\n${content}`;
        } else if (availableDirs.includes(targetLower.replace(/\/$/,''))) {
            response = `<span style="color:var(--red)">cat: ${esc(target)}: Is a directory. Use <span style="color:var(--amber)">cd ${target}</span> first.</span>`;
        } else {
            response = `<span style="color:var(--red)">cat: ${esc(target)}: No such file or directory</span>`;
        }

    } else if (cmd === 'sudo') {
        if (args.slice(1).join(' ').toLowerCase() === 'hire me') {
            appendOutput(prompt, `<span style="color:var(--amber)">[sudo] password for guest: ········</span>`);
            inputField.value = '';
            const authSteps = [
                `<span style="color:var(--muted)">Verifying credentials...</span>`,
                `<span style="color:var(--muted)">Checking sudoers database...</span>`,
                `<span style="color:var(--cyan)">Authenticating...  <span id=\"auth-bar\"></span></span>`,
            ];
            let ai = 0;
            function showAuthStep() {
                if (ai < authSteps.length) {
                    historyDiv.innerHTML += `<div class=\"output\">${authSteps[ai]}</div>`;
                    termBody.scrollTop = termBody.scrollHeight;
                    ai++;
                    if (ai === 3) {
                        setTimeout(() => {
                            let pct = 0;
                            const bar = document.getElementById('auth-bar');
                            const barInt = setInterval(() => {
                                if (!bar) { clearInterval(barInt); return; }
                                pct += 4;
                                bar.textContent = '[' + '█'.repeat(Math.floor(pct/4)) + '░'.repeat(25-Math.floor(pct/4)) + '] ' + pct + '%';
                                bar.style.color = pct < 50 ? 'var(--amber)' : pct < 90 ? 'var(--cyan)' : 'var(--green)';
                                if (pct >= 100) {
                                    clearInterval(barInt);
                                    bar.textContent = '[█████████████████████████] 100%';
                                    setTimeout(() => {
                                        historyDiv.innerHTML += `<div class=\"output\"><span style=\"color:var(--green)\">✓ Authentication successful.</span></div>`;
                                        setTimeout(() => {
                                            historyDiv.innerHTML += `<div class=\"output\"><span style=\"color:var(--cyan)\">╔══════════════════════════════════════════════════════╗\n║                     WHY HIRE AMAN N S?                     ║\n╚══════════════════════════════════════════════════════╝</span>\n\n  → Software engineer with 2+ years building Tier-0 distributed systems at Salesforce\n  → Experience in networking, cloud infrastructure, and production reliability\n  → Hands-on with DevOps, infrastructure as code, and large-scale cloud environments\n  → Actively developing offensive security and AI red teaming expertise\n  → MS Cybersecurity @ NYU (GPA: 4.0) · Top of class in Network Security\n  → CTF player · Competitive programmer · Security-focused engineer\n  → Proven ability to design, deploy, and operate production-grade systems\n\n  Target: Summer 2026 Security Internship\n\n<span style=\"color:var(--cyan)\">📬 amanns0525@gmail.com  ·  github.com/Alien0525</span></div>`;
                                            termBody.scrollTop = termBody.scrollHeight;
                                        }, 300);
                                        termBody.scrollTop = termBody.scrollHeight;
                                    }, 300);
                                }
                            }, 40);
                        }, 100);
                    } else {
                        setTimeout(showAuthStep, 400);
                    }
                }
            }
            setTimeout(showAuthStep, 300);
            return;
        } else {
            response = SUDO_RESPONSES.join('\n');
        }

    } else if (cmd === 'nmap') {
        response = `<span style=\"color:var(--muted)\">Starting Nmap 7.94 scan on 0xns.dev...</span>\n\nPORT      STATE  SERVICE     VERSION\n<span style=\"color:var(--green)\">22/tcp    open   ssh         OpenSSH 9.3 (protocol 2.0)</span>\n<span style=\"color:var(--green)\">80/tcp    open   http        nginx 1.24</span>\n<span style=\"color:var(--green)\">443/tcp   open   https       TLS 1.3</span>\n<span style=\"color:var(--amber)\">8001/tcp  open   opportunity seeking security internship</span>\n<span style=\"color:var(--cyan)\">9000/tcp  open   collab      open to AI security + research projects</span>\n\nHost script results:\n<span style=\"color:var(--green)\">| target-info:</span>\n|   status: <span style=\"color:var(--amber)\">actively seeking Summer 2026 security internship</span>\n|   interests: offensive security · cloud security · AI/LLM security\n|   projects: ShardGuard (NYU) · CloudHawk SIEM — <span style=\"color:var(--cyan)\">collab welcome</span>\n|   htb: active daily | oscp: in progress\n|_  contact: amanns0525@gmail.com\n\nOS: AmanOS 6.7.0-parrot-sec | Skills: Python Go C++ AWS GCP Terraform\n<span style=\"color:var(--muted)\">Nmap done. Host is UP. 5 ports open.</span>`;

    } else if (cmd === 'history') {
        if (!cmdHistory.length) {
            response = '(no history)';
        } else {
            response = cmdHistory.map((c,i) => `  <span style=\"color:var(--muted)\">${String(i+1).padStart(3)}</span>  ${esc(c)}`).join('\n');
        }

    } else {
        response = `<span style=\"color:var(--red)\">bash: ${esc(cmd)}: command not found</span>\n<span style=\"color:var(--muted)\">Type <span style=\"color:var(--amber)\">help</span> for available commands.</span>`;
    }

    appendOutput(prompt, response);
    inputField.value = '';
});