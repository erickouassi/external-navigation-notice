// Leaving‑Site Alert – Smart Outbound Detection (Blogger Version with console logs)

(function () {
    console.log("[LSA] Script loaded");

    // CONFIGURATION
    const countdownSeconds = 5;
    const modalText = "You are about to leave this site.";
    const continueText = "Continue";
    const cancelText = "Cancel";

    // CREATE MODAL HTML
    const modal = document.createElement("div");
    modal.id = "leavingSiteAlertModal";
    modal.innerHTML = `
        <div class="lsa-overlay"></div>
        <div class="lsa-modal">
            <img src="https://yourimageshare.com/ib/aIlspbGrN3.png" class="brand-logo" alt="Warning Icon" />
            <h3>${modalText}</h3>
            <p>Redirecting in <span id="lsa-countdown">${countdownSeconds}</span> seconds...</p>
            <div class="lsa-buttons">
                <button id="lsa-continue">${continueText}</button>
                <button id="lsa-cancel">${cancelText}</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    console.log("[LSA] Modal injected into DOM");

    // STYLE (CSS)
    const style = document.createElement("style");
    style.innerHTML = `
        #leavingSiteAlertModal { 
            display:none; 
            position:fixed; 
            top:0; left:0; 
            width:100%; height:100%; 
            z-index:99999; 
        }
        .lsa-overlay { 
            position:absolute; 
            width:100%; height:100%; 
            background:rgba(0,0,0,0.6); 
        }
        .lsa-modal { 
            position:relative; 
            background:#fff; 
            width:90%; 
            max-width:400px; 
            margin:100px auto; 
            padding:20px; 
            border-radius:8px; 
            text-align:center; 
            box-shadow:0 0 20px rgba(0,0,0,0.3);
        }
        .brand-logo {
            width:60px;
            height:60px;
            margin-bottom:10px;
        }
        .lsa-buttons button { 
            margin:10px; 
            padding:10px 20px; 
            cursor:pointer; 
            border:none; 
            border-radius:5px; 
        }
        #lsa-continue { background:#007bff; color:#fff; }
        #lsa-cancel { background:#ccc; }
    `;
    document.head.appendChild(style);
    console.log("[LSA] Styles injected into DOM");

    // LOGIC
    let targetUrl = null;
    let countdownInterval = null;

    function startCountdown() {
        let timeLeft = countdownSeconds;
        const counter = document.getElementById("lsa-countdown");
        console.log("[LSA] Countdown started:", timeLeft);

        countdownInterval = setInterval(() => {
            timeLeft--;
            counter.textContent = timeLeft;
            console.log("[LSA] Countdown tick:", timeLeft);

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                console.log("[LSA] Countdown finished, opening:", targetUrl);
                window.open(targetUrl, "_blank");
                closeModal();
            }
        }, 1000);
    }

    function openModal(url) {
        targetUrl = url;
        console.log("[LSA] Opening modal for URL:", url);
        document.getElementById("leavingSiteAlertModal").style.display = "block";
        startCountdown();
    }

    function closeModal() {
        console.log("[LSA] Closing modal");
        clearInterval(countdownInterval);
        document.getElementById("leavingSiteAlertModal").style.display = "none";
    }

    // BUTTON EVENTS
    document.getElementById("lsa-continue").onclick = () => {
        console.log("[LSA] Continue clicked, opening:", targetUrl);
        window.open(targetUrl, "_blank");
        closeModal();
    };

    document.getElementById("lsa-cancel").onclick = () => {
        console.log("[LSA] Cancel clicked");
        closeModal();
    };

    // DETECT EXTERNAL LINKS
    document.addEventListener("click", function (e) {
        const link = e.target.closest("a");

        if (!link) return;

        console.log("[LSA] Click detected on link:", link.href);

        if (link.hasAttribute("data-exit-ignore")) {
            console.log("[LSA] data-exit-ignore present, skipping");
            return;
        }
        if (link.classList.contains("no-exit")) {
            console.log("[LSA] .no-exit class present, skipping");
            return;
        }

        const url = link.href;
        const currentDomain = location.hostname;

        try {
            const linkDomain = new URL(url).hostname;
            console.log("[LSA] Current domain:", currentDomain, "Link domain:", linkDomain);

            if (linkDomain !== currentDomain) {
                console.log("[LSA] External link detected, intercepting");
                e.preventDefault();
                openModal(url);
            } else {
                console.log("[LSA] Internal link, no modal");
            }
        } catch (err) {
            console.log("[LSA] Invalid URL, skipping:", url, err);
        }
    });

    console.log("[LSA] Event listeners attached");
})();
