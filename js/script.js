const chat = document.getElementById('chat');
const input = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');
const chips = document.querySelectorAll('.chip');

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.classList.add('message', type);
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function sendQuestion(question) {
  if (!question) return;

  addMessage(question, 'user');
  input.value = '';
  sendBtn.disabled = true;

  const typing = document.createElement('div');
  typing.classList.add('message', 'ai');
  typing.textContent = 'Thinking...';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    typing.remove();

    if (res.status === 429) {
      addMessage(
        '🚦 AI is temporarily rate limited (free tier). Please wait a few seconds and try again.',
        'ai'
      );
      return;
    }

    if (!res.ok) {
      addMessage(
        data.error ||
          'AI response delayed. Free-tier limits sometimes cause this.',
        'ai'
      );
      return;
    }

    addMessage(data.answer || 'No response generated.', 'ai');
  } catch (err) {
    typing.remove();
    addMessage(
      'Hmm… looks like the AI is thinking a bit too hard. Please try again.',
      'ai'
    );
  }

  sendBtn.disabled = false;
}

sendBtn.addEventListener('click', () => {
  sendQuestion(input.value.trim());
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendQuestion(input.value.trim());
  }
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    sendQuestion(chip.textContent);
  });
});

// ===== Auto Experience Counter =====
const startYear = 2023;
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - startYear;

document.getElementById('experienceYears').textContent = yearsOfExperience;
// ===== Auto Experience Counter =====

const roles = [
  'Senior Software Engineer',
  'System Architect',
  'Fintech Backend Specialist',
  'Co-Founder (Intrix Digital)',
];

const roleElement = document.getElementById('roleText');
let roleIndex = 0;
let charIndex = 0;

function typeRole() {
  if (charIndex < roles[roleIndex].length) {
    roleElement.textContent += roles[roleIndex][charIndex];
    charIndex++;
    setTimeout(typeRole, 40);
  } else {
    setTimeout(eraseRole, 1500);
  }
}

function eraseRole() {
  if (charIndex > 0) {
    roleElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseRole, 25);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 300);
  }
}

typeRole();

// ===== AI Last Updated =====
const aiLastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
});
document.getElementById('aiLastUpdated').textContent = aiLastUpdated;
