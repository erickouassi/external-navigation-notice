// Leaving‑Site Alert – Smart Outbound Detection (Blogger Version)

/*  
exit-redirect-widget.js
Mobile-friendly exit redirect widget that works on ANY page, automatically detects 
external links, and supports bypass rules for ignored links.

Author: Eric Kouassi (https://erickouassi.com)
*/

(function () {

  let time = 5;                 
  const originalTime = time;    

  // Automatically detect external link clicks
  document.addEventListener("click", (e) => {
    // Find closest <a> tag if user clicked an icon/span inside a link
    const link = e.target.closest("a");

    if (!link) return;

    // IGNORE CHECK: Bypass if the link has data-exit-ignore or no-exit class
    if (
      link.hasAttribute("data-exit-ignore") || 
      link.dataset.exitIgnore === "true" || 
      link.classList.contains("no-exit")
    ) {
      return; // Let the link behave normally
    }

    const href = link.getAttribute("href");

    // Skip empty hrefs, anchor links, javascript calls, or mailto/tel links
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    // Check if link destination domain differs from current domain
    if (link.hostname && link.hostname !== window.location.hostname) {
      e.preventDefault();
      launchExitWidget(link.href);
    }
  });

  function launchExitWidget(target) {
    let canceled = false;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "exit-overlay";
    overlay.className = "exit-overlay";
    document.body.appendChild(overlay);

    // Create wrapper
    const box = document.createElement("div");
    box.id = "redirect-box";
    box.className = "redirect-card";
    document.body.appendChild(box);

    // Inject widget HTML
    box.innerHTML = `
      <img src="https://yourimageshare.com/ib/aIlspbGrN3.png" class="brand-logo" alt="Warning Icon" />

      <div class="exit-title">You're heading to another site</div>

      <div class="destination-link">
        We’ll take you to:<br>
        <a id="destLink" href="${target}" target="_blank">${target}</a>
      </div>

      <div class="redirect-message">
        Opening in <span id="count">${time}</span> seconds…
      </div>

      <button id="cancelBtn" class="cancel-btn">Stay Here</button>
    `;

    // Inject CSS (only if not already added)
    if (!document.getElementById("exit-widget-styles")) {
      const style = document.createElement("style");
      style.id = "exit-widget-styles";
      style.textContent = `
        .exit-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(2px);
          z-index: 9998;
        }

        .redirect-card {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;

          width: 90%;
          max-width: 360px;
          padding: 22px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          font-family: Arial, sans-serif;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .brand-logo {
          width: 70px;
          margin-bottom: 15px;
        }

        .exit-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .destination-link {
          font-size: 15px;
          margin-bottom: 15px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          max-width: 100%;
        }

        .destination-link a {
          display: inline-block;
          max-width: 100%;
          word-break: break-all;
          color: #0078ff;
          font-weight: 600;
          text-decoration: none;
        }

        .redirect-message {
          font-size: 18px;
          margin-bottom: 15px;
        }

        #count {
          font-size: 26px;
          color: #0078ff;
          font-weight: bold;
        }

        .cancel-btn {
          background: #e0e0e0;
          color: #333;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          transition: background 0.2s ease;
        }

        .cancel-btn:hover {
          background: #d5d5d5;
        }

        .popup-warning {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          background: #fff4f4;
          padding: 20px 25px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          font-size: 17px;
          font-weight: 600;
          color: #d92f2f;
          text-align: center;
          max-width: 320px;
          width: 90%;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `;
      document.head.appendChild(style);
    }

    // Countdown
    const interval = setInterval(() => {
      if (canceled) return;

      document.getElementById("count").textContent = time;
      time--;

      if (time < 0) {
        clearInterval(interval);

        // Try redirect in new tab
        const newTab = window.open(target, "_blank");

        // Remove widget + overlay
        document.getElementById("redirect-box").remove();
        document.getElementById("exit-overlay").remove();

        // Reset countdown
        time = originalTime;

        // If popup blocked → show friendly warning
        if (!newTab) {
          const warn = document.createElement("div");
          warn.className = "popup-warning";
          warn.textContent =
            "We tried to open the page in a new tab, but your browser blocked it. Please allow popups for this site.";
          document.body.appendChild(warn);

          // Auto-remove warning after 4 seconds
          setTimeout(() => warn.remove(), 4000);
        }
      }
    }, 1000);

    // Cancel button — remove widget + reset countdown
    document.getElementById("cancelBtn").addEventListener("click", () => {
      canceled = true;
      clearInterval(interval);

      // Remove widget + overlay
      document.getElementById("redirect-box").remove();
      document.getElementById("exit-overlay").remove();

      // Reset countdown automatically
      time = originalTime;
    });
  }

})();
