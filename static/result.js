document.addEventListener("DOMContentLoaded", function () {
    const storedData = sessionStorage.getItem("resultData");

    if (storedData) {
        const data = JSON.parse(storedData);

        // Update page content with retrieved data
        updateRiskBar(data.prediction);
        animateGauge("depression-gauge", data.depression_score);
        animateGauge("anxiety-gauge", data.anxiety_score);
        animateGauge("stress-gauge", data.stress_score);
        updateRecommendations(data.prediction);
    } else {
        console.warn("⚠️ No result data found. Please submit the form again.");
    }
});


// Risk Level Bar Animation - Starts from "Normal" and Moves Upwards
function updateRiskBar(targetScore) {
    const bar = document.getElementById("risk-bar");
    const labels = document.querySelectorAll(".risk-labels .label");

    const colors = ["green", "yellowgreen", "orange", "orangered", "red"];
    const segmentWidth = 100 / labels.length;

    let currentScore = 0; // Start from "Normal"

    function animate() {
        if (currentScore <= targetScore) {
            bar.style.width = `${segmentWidth * currentScore + segmentWidth / 2}%`;
            bar.style.backgroundColor = colors[currentScore];

            labels.forEach((label, index) => {
                label.classList.toggle("highlighted", index === currentScore);
            });

            currentScore++;
            setTimeout(animate, 200); // Adjust speed for smooth transition
        }
    }

    animate();
}

function animateGauge(canvasId, targetScore) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Ensure consistent dimensions for all gauges
    canvas.width = 260;
    canvas.height = 170;

    let currentScore = 0;

    function drawGauge(score) {
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height;
        const radius = Math.min(width, height) * 0.6;
        const needleLength = radius * 0.95;
        const needleBaseOffset = 15;

        ctx.clearRect(0, 0, width, height);

        // Background Arc (Gray)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 40;
        ctx.stroke();

        // Progress Arc (Colored)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * (score / 100)), false);
        ctx.strokeStyle = getGaugeColor(score);
        ctx.lineWidth = 40;
        ctx.stroke();

        // Needle
        const angle = Math.PI + (Math.PI * (score / 100));
        const needleBaseX = centerX + Math.cos(angle) * needleBaseOffset;
        const needleBaseY = centerY + Math.sin(angle) * needleBaseOffset;
        const needleX = centerX + Math.cos(angle) * needleLength;
        const needleY = centerY + Math.sin(angle) * needleLength;

        ctx.beginPath();
        ctx.moveTo(needleBaseX, needleBaseY); // Adjusted start position
        ctx.lineTo(needleX, needleY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8; // Thicker needle for better visibility
        ctx.stroke();

        // Score Text
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(`${score}%`, centerX, centerY - radius - 30); // Adjusted position
    }

    function update() {
        if (currentScore <= targetScore) {
            drawGauge(currentScore);
            setTimeout(update, 25);
            currentScore++;
        }
    }

    update();
}

// Color Gradient for Gauge
function getGaugeColor(score) {
    if (score <= 25) return "green";
    if (score <= 50) return "yellow";
    if (score <= 75) return "orange";
    return "red";
}



// Dynamic Do's, Don'ts, and Suggestions Based on Risk Level
function updateRecommendations(score) {
    const recommendations = [
        {
            dos: [
                "Sleep 7-9 hours per night for peak brain function.",
                "Drink at least 2.5L of water daily to prevent fatigue.",
                "Engage in 30 minutes of light movement (walking, stretching, yoga).",
                "Follow the 50-10 rule (50 minutes of work, 10 minutes break) for focus.",
                "Interact with friends or family at least once daily.",
                "Reduce blue light exposure one hour before bed."
            ],
            donts: [
                "Ignore small stressors—they can accumulate over time.",
                "Overcommit—rest is as important as productivity.",
                "Assume mental health isn't important because you feel fine now."
            ],
            suggestions: [
                "Try gratitude journaling (write three things you're thankful for daily).",
                "Practice five minutes of deep breathing before bed.",
                "Schedule a weekly 'Me Time' activity (music, hobbies, reading)."
            ]
        },
        {
            dos: [
                "Stick to a fixed sleep schedule (same bedtime and wake-up time).",
                "Eat balanced meals rich in protein and fiber to stabilize mood.",
                "Practice 10-15 minutes of deep breathing, meditation, or stretching.",
                "Talk to at least one trusted person per week for social support.",
                "Limit caffeine intake to a maximum of one to two cups daily."
            ],
            donts: [
                "Stay up late using your phone—this worsens sleep and mood.",
                "Skip meals or rely on junk food—it affects energy and mental clarity.",
                "Keep stress to yourself—sharing helps process emotions."
            ],
            suggestions: [
                "Reduce screen time by 30 minutes before bed for better sleep.",
                "Try an audio-guided meditation app (Calm, Headspace).",
                "Spend 10 minutes outdoors daily—sunlight improves mood."
            ]
        },
        {
            dos: [
                "Aim for 7-8 hours of sleep and avoid naps longer than 20 minutes.",
                "Drink at least 2.5 liters of water daily to prevent brain fog.",
                "Engage in 15-30 minutes of moderate exercise (walking, stretching).",
                "Write down negative thoughts and challenge them through journaling.",
                "Consider talking to a counselor or therapist."
            ],
            donts: [
                "Assume it'll go away on its own—early action prevents bigger problems.",
                "Overload yourself—reduce stressors and learn to say no.",
                "Use caffeine or alcohol as stress relief—it worsens mood swings."
            ],
            suggestions: [
                "Track moods with a mood-tracking app (Daylio, Reflectly).",
                "Try the 4-7-8 breathing technique to lower stress (inhale for four seconds, hold for seven seconds, exhale for eight seconds).",
                "Do one self-care activity per day (reading, music, nature walks)."
            ]
        },
        {
            dos: [
                "Stick to at least seven hours of sleep—poor sleep increases stress and anxiety.",
                "Eat high-protein and fiber-rich meals to stabilize mood.",
                "Reduce stressors by setting clear boundaries.",
                "Find a mental health professional to discuss your feelings.",
                "Have crisis helplines and trusted contacts saved for emergencies."
            ],
            donts: [
                "Keep pushing through extreme stress—your mind and body need recovery.",
                "Use social media excessively—comparison can worsen anxiety.",
                "Ignore symptoms—your mental health is a priority, not an afterthought."
            ],
            suggestions: [
                "Try progressive muscle relaxation to relieve body tension.",
                "Limit caffeine to one small cup daily—it can worsen anxiety.",
                "If overwhelmed, complete small tasks to regain a sense of control."
            ]
        },
        {
            dos: [
                "Follow a strict bedtime routine (warm tea, reading) if struggling with sleep.",
                "Call a crisis helpline or therapist—you are not alone.",
                "Tell someone you trust about your struggles.",
                "Have a crisis plan with emergency contacts ready.",
                "Use grounding techniques like the 5-4-3-2-1 method (name five things you see, four you touch, three you hear, two you smell, one you taste)."
            ],
            donts: [
                "Ignore suicidal thoughts—seek immediate help.",
                "Stay isolated—social connection can save lives.",
                "Assume you're beyond help—healing is always possible."
            ],
            suggestions: [
                "Call or text a mental health crisis helpline (display emergency numbers).",
                "Ask someone to stay with you if you feel unsafe.",
                "Remove harmful objects from your surroundings."
            ]
        }
    ];

    document.getElementById("dos-list").innerHTML = `<li>${recommendations[score].dos.join("</li><li>")}</li>`;
    document.getElementById("donts-list").innerHTML = `<li>${recommendations[score].donts.join("</li><li>")}</li>`;
    document.getElementById("suggestions-list").innerHTML = `<li>${recommendations[score].suggestions.join("</li><li>")}</li>`;
}

function generatePDF() {
    // Show the loading screen
    document.getElementById("loading-screen").classList.add("show");

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.height;
        let margin = 10; // Margin for the border

        // Draw a border around the entire page
        pdf.setDrawColor(0); // Black border
        pdf.setLineWidth(1);
        pdf.rect(5, 5, pdf.internal.pageSize.width - 10, pdf.internal.pageSize.height - 10); 


        let yPos = 5; // Initial y position

        // Add Logo and Name Side by Side
        const logo = document.getElementById("logo-img");
        if (logo && logo.src) {
            pdf.addImage(logo.src, "PNG", 40, yPos, 50, 50); // Enlarged sideways
        }
    
        // Add "Mind Tapestry" beside the logo
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(35);
        pdf.setTextColor(100); // Light gray color to match the webpage
        pdf.text("Mind Tapestry", 95, yPos + 25); // Adjusted position beside logo

        yPos += 55; // Adjust spacing for the next section

        // Add Report Title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(22);
        pdf.setTextColor(0);
        pdf.text("Mental Health Report", 105, yPos, { align: "center" });

        yPos += 15;

        // Add Risk Level Section
        pdf.setFontSize(16);
        pdf.text("Your Risk Level:", 105, yPos, { align: "center" });

        const riskContainer = document.getElementById("risk-bar-container");
        const riskLabels = document.querySelector(".risk-labels");

        if (riskContainer && riskLabels) {
            const riskCaptureDiv = document.createElement("div");
            riskCaptureDiv.style.position = "absolute";
            riskCaptureDiv.style.left = "-9999px";
            riskCaptureDiv.appendChild(riskContainer.cloneNode(true));
            riskCaptureDiv.appendChild(riskLabels.cloneNode(true));

            document.body.appendChild(riskCaptureDiv);

            html2canvas(riskCaptureDiv, { scale: 2 }).then(canvas => {
                const riskBarImg = canvas.toDataURL("image/png");
                pdf.addImage(riskBarImg, "PNG", 15, yPos + 5, 180, 20);
                document.body.removeChild(riskCaptureDiv);
                addGaugeMeters(pdf, yPos + 40);
            });
        } else {
            addGaugeMeters(pdf, yPos + 40);
        }

    function addGaugeMeters(pdf, yPos) {
        pdf.setFontSize(16);
        pdf.text("Your Scores:", 105, yPos, { align: "center" });

        const gaugeData = [
            { label: "Depression", id: "depression-gauge" },
            { label: "Anxiety", id: "anxiety-gauge" },
            { label: "Stress", id: "stress-gauge" }
        ];

        let xPos = 15;

        gaugeData.forEach(({ label, id }) => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const imgData = canvas.toDataURL("image/png");
                pdf.addImage(imgData, "PNG", xPos, yPos, 50, 40);
                pdf.text(label, xPos + 25, yPos + 45, { align: "center" });
            }
            xPos += 65;
        });

        addRecommendations(pdf, yPos + 65);
    }

    function addRecommendations(pdf, yPos) {
        pdf.setFontSize(16);
        pdf.text("Recommendations:", 105, yPos, { align: "center" });
        yPos += 5;

        const headers = [["Do's", "Don'ts", "Suggestions"]];
        const dos = [...document.querySelectorAll("#dos-list li")].map(li => li.innerText).filter(text => text.trim());
        const donts = [...document.querySelectorAll("#donts-list li")].map(li => li.innerText).filter(text => text.trim());
        const suggestions = [...document.querySelectorAll("#suggestions-list li")].map(li => li.innerText).filter(text => text.trim());

        const maxRows = Math.max(dos.length, donts.length, suggestions.length);
        const data = Array.from({ length: maxRows }, (_, i) => [
            dos[i] || "", 
            donts[i] || "", 
            suggestions[i] || ""
        ]);

        pdf.autoTable({
            startY: yPos,
            head: headers,
            body: data,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [240, 240, 240], textColor: 0 },
            columnStyles: { 0: { cellWidth: "auto" }, 1: { cellWidth: "auto" }, 2: { cellWidth: "auto" } }
        });

        
        // Draw Border Again (For pages with recommendations)
        pdf.setLineWidth(1);
        pdf.rect(5, 5, pdf.internal.pageSize.width - 10, pdf.internal.pageSize.height - 10);


            // Create Blob URL for the PDF
            const pdfBlob = pdf.output("blob");
            const pdfURL = URL.createObjectURL(pdfBlob);

            // Hide the loading screen
            document.getElementById("loading-screen").classList.remove("show");

            // Open the PDF in a new tab
            window.open(pdfURL, "_blank");
        }
    }, 2500); // Loading animation for 2.5 seconds
}
