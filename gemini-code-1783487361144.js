// NOTE: Students must replace this empty string URL with their actual live running n8n Test/Prod Webhook URL endpoint
const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

// Front-end local source dataset array mapping for instant autocomplete suggestions matrix lookup
const supportQueries = [
  { en: "What is the campus WiFi password?", hi: "वाईफाई का पासवर्ड क्या है?" },
  { en: "Are power extension boards allowed?", hi: "क्या पावर एक्सटेंशन बोर्ड लाने की अनुमति है?" },
  { en: "Can we change team members now?", hi: "क्या हम अपनी टीम के सदस्यों को बदल सकते हैं?" },
  { en: "Where is the vehicle parking zone?", hi: "गाड़ी पार्क करने की जगह कहाँ है?" },
  { en: "What is the reporting time for the event?", hi: "इवेंट के लिए रिपोर्टिंग का समय क्या है?" }
];

let currentLanguage = "en";

document.addEventListener("DOMContentLoaded", () => {
  initTimestamp();
  
  if (document.getElementById("registrationForm")) {
    initRegistration();
  }
  if (document.getElementById("supportForm")) {
    initSupportDesk();
  }
});

// Sets the global tracking systemic execution time stamp component 
function initTimestamp() {
  const timeElements = document.querySelectorAll(".stamp-time");
  const now = new Date();
  const formatted = now.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) + " | " + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  timeElements.forEach(el => el.textContent = formatted);
}

// Handler execution pipeline for capturing student inputs and submitting payload target to n8n Webhook
function initRegistration() {
  const form = document.getElementById("registrationForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Explicitly package input to preserve raw unformatted styling constraints for Lab sanitization practice
    const payload = {
      student_name: document.getElementById("studentName").value,
      contact_email: document.getElementById("contactEmail").value,
      mobile_number: document.getElementById("mobileNumber").value,
      college: document.getElementById("collegeName").value,
      raw_skills: document.getElementById("rawSkills").value,
      hackathon_idea: document.getElementById("hackathonIdea").value
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Registration Received into Onboarding pipeline!");
        form.reset();
      } else {
        alert("Server transmission error. Validation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network exception error connection failed to contact n8n pipeline.");
    }
  });
}

// Support search interface orchestration logic
function initSupportDesk() {
  const searchInput = document.getElementById("supportQuery");
  const suggestBox = document.getElementById("autocompleteBox");
  const micBtn = document.getElementById("micBtn");
  const langBtns = document.querySelectorAll(".lang-btn");

  // Local Language State Toggler Switcher Engine
  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      langBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLanguage = btn.dataset.lang;
      searchInput.value = "";
      searchInput.placeholder = currentLanguage === "en" ? "Type or use microphone your query here..." : "यहाँ टाइप करें या माइक का उपयोग करें...";
      suggestBox.innerHTML = "";
    });
  });

  // Structural Input Event Engine matching text against the context arrays array vectors
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    suggestBox.innerHTML = "";
    if (!val) return;

    const filtered = supportQueries.filter(q => q[currentLanguage].toLowerCase().includes(val));
    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "autocomplete-item";
      div.textContent = item[currentLanguage];
      div.addEventListener("click", () => {
        searchInput.value = item[currentLanguage];
        suggestBox.innerHTML = "";
      });
      suggestBox.appendChild(div);
    });
  });

  // Hides the dropdown context array menu element when clicking away outside of container
  document.addEventListener("click", (e) => {
    if (e.target !== searchInput) suggestBox.innerHTML = "";
  });

  // Native Browser Web Speech Interface Integration API Layer Architecture
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
      // Switches speech localization modules based on front end state configs
      recognition.lang = currentLanguage === "en" ? "en-IN" : "hi-IN";
      if (micBtn.classList.contains("recording")) {
        recognition.stop();
      } else {
        micBtn.classList.add("recording");
        recognition.start();
      }
    });

    recognition.onresult = (event) => {
      const voiceResult = event.results[0][0].transcript;
      searchInput.value = voiceResult;
      searchInput.dispatchEvent(new Event('input')); // Forces UI autocomplete box to scan tracking array list
    };

    recognition.onend = () => {
      micBtn.classList.remove("recording");
    };

    recognition.onerror = () => {
      micBtn.classList.remove("recording");
      alert("Voice interface capture error. Check system audio configuration permissions.");
    };
  } else {
    micBtn.style.display = "none";
    console.log("Web Speech Core module rendering skipped: Browser layout engine architecture unsupported.");
  }

  // Final Action routing payload configuration engine linking to the support helpdesk router nodes
  document.getElementById("supportForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const queryPayload = {
      student_name: document.getElementById("ticketName").value,
      student_email: document.getElementById("ticketEmail").value,
      student_phone: document.getElementById("ticketPhone").value,
      ticket_message: searchInput.value
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryPayload)
      });
      if (response.ok) {
        alert("Your request ticket has been catalogued. System dispatch sent.");
        document.getElementById("supportForm").reset();
      }
    } catch (err) {
      alert("Failed routing target to backend engine logs.");
    }
  });
}