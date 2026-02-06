const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 100;
const connectionDistance = 150;
const mouseRange = 200;

let mouse = { x: null, y: null };

// Resize Canvas
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Mouse Move
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
        this.color = '#d4af37'; // Gold
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRange) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseRange - distance) / mouseRange;
                const directionX = forceDirectionX * force * 2; // Push/Pull factor
                const directionY = forceDirectionY * force * 2;

                // Gentle attraction
                this.vx += directionX * 0.05;
                this.vy += directionY * 0.05;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Init Particles
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

init();

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
    connectScale();

    requestAnimationFrame(animate);
}

function connectScale() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

            if (distance < (connectionDistance * connectionDistance)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(212, 175, 55,' + opacityValue * 0.5 + ')'; // Gold lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

animate();

// Existing Navigation Script
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animate');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden-text, .hidden-img, .hidden-item');
hiddenElements.forEach((el) => observer.observe(el));

// --- AI Chat Assistant Logic ---
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// Internal Knowledge Base
const internalData = {
    personal: {
        name: "Sakthiselvan P",
        designation: "Design Engineer",
        education: "BE. Mechanical",
        location: "Tamil Nadu, India",
        bio: "Dedicated Design Engineer with expertise in mechanical design, 3D modeling, and engineering analysis."
    },
    skills: [
        "Microsoft Office (Word, Excel, PowerPoint)",
        "SolidWorks (3D Modeling, Assembly, Simulation)",
        "AutoCAD (2D Drafting, Layout Design)",
        "HyperMesh (FEA pre-processing, Mesh generation)"
    ],
    projects: [
        {
            title: "IoT Based Energy Smart Light System",
            type: "Mini Project",
            description: "An intelligent lighting solution optimizing energy consumption using IoT sensors and automation.",
            tech: ["IoT", "Sensors", "Automation"]
        },
        {
            title: "Mechanical Property Analysis of MIG and TIG Welding",
            type: "Main Project",
            description: "Comparative analysis using AL6061 base metal and ER4043 filler material to evaluate joint strength.",
            tech: ["Manufacturing", "Welding", "Process Optimization"]
        }
    ],
    contact: {
        phone: "+91 86083 44289",
        email: "sakthiselvan05@gmail.com",
        linkedin: "https://www.linkedin.com/in/sakthiselvan-p-b347082a5",
        whatsapp: "https://wa.me/qr/J2O64GWBOF45J1"
    }
};

// Toggle Chat
chatToggle.addEventListener('click', () => {
    chatContainer.classList.add('active');
    chatInput.focus();
});

closeChat.addEventListener('click', () => {
    chatContainer.classList.remove('active');
});

// Handle User Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI Thinking
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(message.toLowerCase());
        addMessage(response, 'ai');
    }, 1000);
});

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator', 'ai');
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function generateAIResponse(input) {
    // Skills
    if (input.includes('skill') || input.includes('tool') || input.includes('software')) {
        return `Sakthiselvan is proficient in several engineering tools:<br><br><ul>${internalData.skills.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }
    
    // Projects
    if (input.includes('project') || input.includes('work')) {
        let resp = "Here are Sakthiselvan's key projects:<br><br>";
        internalData.projects.forEach(p => {
            resp += `<strong>${p.title}</strong> (${p.type}):<br>${p.description}<br><em>Tech: ${p.tech.join(', ')}</em><br><br>`;
        });
        return resp;
    }

    // IoT Project Specifically
    if (input.includes('iot') || input.includes('light')) {
        const p = internalData.projects[0];
        return `<strong>${p.title}</strong>:<br>${p.description}<br><br>Features: Automation, Ambient light adjustment, and Energy optimization.`;
    }

    // Welding Project Specifically
    if (input.includes('welding') || input.includes('mig') || input.includes('tig')) {
        const p = internalData.projects[1];
        return `<strong>${p.title}</strong>:<br>${p.description}<br><br>This project comparative evaluation of joint strength using AL6061 and ER4043 material.`;
    }

    // Contact
    if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('reach')) {
        return `You can reach Sakthiselvan via:<br><br>
                📞 Phone: <a href="tel:${internalData.contact.phone}">${internalData.contact.phone}</a><br>
                📧 Email: <a href="mailto:${internalData.contact.email}">${internalData.contact.email}</a><br>
                🔗 <a href="${internalData.contact.linkedin}" target="_blank">LinkedIn Profile</a>`;
    }

    // Education
    if (input.includes('education') || input.includes('degree') || input.includes('be')) {
        return `Sakthiselvan holds a <strong>${internalData.personal.education}</strong> degree.`;
    }

    // Basic Info / Bio
    if (input.includes('who') || input.includes('about') || input.includes('sakthiselvan') || input.includes('hello') || input.includes('hi')) {
        return `I am Sakthiselvan's personal AI assistant. ${internalData.personal.bio} How can I help you regarding his career and projects?`;
    }

    // Out of Scope
    return "That information is not available in my internal data.";
}
