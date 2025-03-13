let currentSection = "personal-details";

function nextSection(nextId) {
    if (!validateSection(currentSection)) return;
    document.getElementById(currentSection).classList.remove("active");
    document.getElementById(nextId).classList.add("active");
    currentSection = nextId;
}

function prevSection(prevId) {
    document.getElementById(currentSection).classList.remove("active");
    document.getElementById(prevId).classList.add("active");
    currentSection = prevId;
}

function validateSection(sectionId) {
    const section = document.getElementById(sectionId);
    const inputs = section.querySelectorAll("input[required], select[required], input[type=radio]");
    let allValid = true;
    let firstInvalidField = null;

    // Remove existing error messages
    section.querySelectorAll('.error-message').forEach(msg => msg.remove());

    // Track already processed radio button groups
    const processedRadioGroups = new Set();

    inputs.forEach(input => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#a70000';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.margin = '5px 0';

        let isValid = true;

        // Validation for radio buttons
        if (input.type === "radio") {
            const groupName = input.name;

            if (!processedRadioGroups.has(groupName)) {
                processedRadioGroups.add(groupName);

                const isChecked = document.querySelector(`input[name="${groupName}"]:checked`);
                if (!isChecked) {
                    allValid = false;
                    if (!firstInvalidField) firstInvalidField = input;

                    errorElement.innerText = "Please select an option.";
                    const parentDiv = input.closest("div").parentElement;
                    
                    if (parentDiv.lastElementChild.tagName === "HR") {
                        parentDiv.insertBefore(errorElement, parentDiv.lastElementChild);
                    } else {
                        parentDiv.appendChild(errorElement);
                    }
                }
            }
        }


        // Validation for text, number, dropdowns, and range
        if (input.id === "age") {
            const age = parseInt(input.value);
            if (isNaN(age) || age < 18 || age > 65) {
                isValid = false;
                errorElement.innerText = "Age must be between 18 and 65.";
            }
        } else if (input.id === "cgpa") {
            const cgpa = parseFloat(input.value);
            if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
                isValid = false;
                errorElement.innerText = "CGPA must be between 0 and 10.";
            }
        } else if (input.required && input.tagName === "SELECT" && input.value === "") {
            isValid = false;
            errorElement.innerText = "Please select an option.";
        } else if (input.required && input.type === "range") {
            const rangeValue = input.value;
            if (rangeValue === "") {
                isValid = false;
                errorElement.innerText = "Please adjust the slider.";
            }
        }

        // Display errors if invalid
        if (!isValid) {
            allValid = false;
            if (!firstInvalidField) firstInvalidField = input;

            if (input.type !== "radio") {
                input.insertAdjacentElement('afterend', errorElement);
            }
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    // Focus on the first invalid field
    if (!allValid && firstInvalidField) {
        smoothScrollTo(firstInvalidField);
    }

    return allValid;
}

function createErrorMessage(input) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#a70000';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.margin = '5px 0';

    // Error message content based on input type
    if (input.type === 'text') errorElement.innerText = "This field cannot be empty.";
    else if (input.type === 'email') errorElement.innerText = "Please enter a valid email address.";
    else if (input.type === 'number') errorElement.innerText = "Please provide a valid number.";
    else if (input.type === 'radio') errorElement.innerText = "Please select an option.";

    return errorElement;
}

function attachDynamicValidation() {
    document.querySelectorAll("input[required], select[required], input[type=radio]").forEach(input => {
        if (input.type === "radio") {
            input.addEventListener("change", () => {
                const parentDiv = input.closest("div").parentElement;
                const errorMessage = parentDiv.querySelector(".error-message");
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
        } else {
            input.addEventListener("input", () => {
                validateField(input);
            });
        }
    });
}

function validateField(input) {
    const errorMessage = input.nextElementSibling; // Existing error message, if any
    const fieldId = input.id;
    let isValid = true;

    // Validation logic based on field ID
    if (fieldId === "age") {
        const age = parseInt(input.value);
        if (isNaN(age) || age < 18 || age > 65) {
            isValid = false;
            showError(input, "Age must be between 18 and 65.", errorMessage);
        }
    } else if (fieldId === "cgpa") {
        const cgpa = parseFloat(input.value);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            isValid = false;
            showError(input, "CGPA must be between 0 and 10.", errorMessage);
        }
    } else if (input.required && !input.value.trim()) {
        isValid = false;
        showError(input, "This field is required.", errorMessage);
    }

    if (isValid) {
        clearError(input, errorMessage);
    }
}

function showError(input, message, errorMessage) {
    if (!errorMessage || !errorMessage.classList.contains("error-message")) {
        const newErrorMessage = document.createElement("div");
        newErrorMessage.className = "error-message";
        newErrorMessage.style.color = "#a70000";
        newErrorMessage.style.fontSize = "0.9rem";
        newErrorMessage.style.margin = "5px 0";
        newErrorMessage.innerText = message;

        input.classList.add("error");
        input.classList.remove("valid");
        input.insertAdjacentElement("afterend", newErrorMessage);
    } else {
        errorMessage.innerText = message;
    }
}

function clearError(input, errorMessage) {
    input.classList.remove("error");
    input.classList.add("valid");

    if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.remove();
    }
}

function smoothScrollTo(element) {
    const yOffset = -100; // Offset for better positioning
    const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
        top: yPosition,
        behavior: "smooth",
    });

    if (element.type != "radio")
        element.focus({ preventScroll: true }); // Focus after scrolling
}

// Initialize dynamic validation on page load
document.addEventListener("DOMContentLoaded", attachDynamicValidation);


function showPreview() {
    if (!validateSection(currentSection)) return;

    const previewContent = document.getElementById("preview-content");

    // Personal Details
    const age = document.getElementById("age").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "Not provided";
    const cgpa = document.getElementById("cgpa").value;
    const sleepQuality = document.getElementById("sleep-quality").value || "Not selected";
    const physicalActivity = document.getElementById("physical-activity").value || "Not selected";
    const dietQuality = document.getElementById("diet-quality").value || "Not selected";
    const chronicConditions = document.querySelector('input[name="chronic-conditions"]:checked')?.value || "Not provided";
    const extracurricular = document.getElementById("extracurricular").value || "Not selected";
    const financialStress = document.getElementById("financial-stress").value;

    previewContent.innerHTML = `
        <h3>Personal Details</h3>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>CGPA:</strong> ${cgpa}</p>
        <p><strong>Sleep Quality:</strong> ${sleepQuality}</p>
        <p><strong>Physical Activity:</strong> ${physicalActivity}</p>
        <p><strong>Diet Quality:</strong> ${dietQuality}</p>
        <p><strong>Chronic Medical Conditions:</strong> ${chronicConditions}</p>
        <p><strong>Extracurricular Activities:</strong> ${extracurricular}</p>
        <p><strong>Financial Stress:</strong> ${financialStress} / 5</p>
        <br>
        <h3>Responses</h3>
        <div>${getAnswers('depression', 'Depression Questions')}</div>
        <div>${getAnswers('anxiety', 'Anxiety Questions')}</div>
        <div>${getAnswers('stress', 'Stress Questions')}</div>
    `;

    nextSection('preview');
}


function getAnswers(category, title) {
    let answersHTML = `<h4>${title}</h4>`;
    const questions = document.querySelectorAll(`#${category} > div > label`);
    questions.forEach((question, index) => {
        const answer = document.querySelector(`input[name="${category}_${index + 1}"]:checked`);
        answersHTML += `<p>${question.innerText} - <strong>${answer ? answer.value : 'Not answered'}</strong></p>`;
    });
    return answersHTML;
}

function submitForm() {
    if (!validateSection(currentSection)) return;

    // Show animated loading screen
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("show");

    // Collect form data
    const formData = {
        age: document.getElementById("age").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        cgpa: document.getElementById("cgpa").value,
        sleep_quality: document.getElementById("sleep-quality").value,
        physical_activity: document.getElementById("physical-activity").value,
        diet_quality: document.getElementById("diet-quality").value,
        chronic_illness: document.querySelector('input[name="chronic-conditions"]:checked')?.value,
        extracurricular: document.getElementById("extracurricular").value,
        financial_stress: document.getElementById("financial-stress").value
    };

    // Collect Likert-scale responses
    document.querySelectorAll('.question-section input[type="radio"]:checked').forEach((radio) => {
        formData[radio.name] = radio.value;
    });

    console.log("📨 Sending Data:", JSON.stringify(formData)); // Debugging

    // Send data to Flask server
    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("📩 Server Response:", data);

        if (data.prediction !== undefined) {
            // Store data in sessionStorage instead of URL
            sessionStorage.setItem("resultData", JSON.stringify(data));

            // Simulate loading time before redirection
            setTimeout(() => {
                window.open("/result", "_blank");
                if (loadingScreen) loadingScreen.classList.remove("show");
            }, 5000);
        } else {
            alert("Error: " + JSON.stringify(data));
            if (loadingScreen) loadingScreen.classList.remove("show");
        }
    })
    .catch(error => {
        console.error("❌ Fetch Error:", error);
        alert("An error occurred while submitting the form.");
        if (loadingScreen) loadingScreen.classList.remove("show");
    });
}


function fillRandomResponses() {
    console.log("Filling form with random responses...");

    // Fill Age (input type="number" or text)
    let ageInput = document.querySelector('input[name="age"], input#age');
    if (ageInput) {
        ageInput.value = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
        ageInput.dispatchEvent(new Event("input")); // Trigger event in case of listeners
    }

    // Fill CGPA (input type="number" or text)
    let cgpaInput = document.querySelector('input[name="cgpa"], input#cgpa');
    if (cgpaInput) {
        cgpaInput.value = (Math.random() * 10).toFixed(1); // One decimal place
        cgpaInput.dispatchEvent(new Event("input")); // Trigger event in case of listeners
    }

    // Fill select dropdowns (excluding the first option if it's a placeholder)
    document.querySelectorAll("select").forEach(select => {
        let options = select.options;
        if (options.length > 1) {
            let randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
            select.selectedIndex = randomIndex;
            select.dispatchEvent(new Event("change")); // Trigger change event
        }
    });

    // Fill radio buttons
    let radioGroups = {};
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        let name = radio.name;
        if (!radioGroups[name]) {
            radioGroups[name] = [];
        }
        radioGroups[name].push(radio);
    });

    Object.values(radioGroups).forEach(radios => {
        let randomRadio = radios[Math.floor(Math.random() * radios.length)];
        randomRadio.checked = true;
        randomRadio.dispatchEvent(new Event("change")); // Trigger change event
    });

    console.log("✅ Form filled with random values!");
}

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("financial-stress");
    const valueDisplay = document.getElementById("selected-value");

    // Define labels for each stress level
    const stressLevels = [
        "No Stress",
        "Mild Stress",
        "Moderate Stress",
        "High Stress",
        "Severe Stress"
    ];

    function updateValueDisplay(value) {
        valueDisplay.textContent = `Selected: ${value} (${stressLevels[value - 1]})`;
    }

    // Update value dynamically on slider input
    slider.addEventListener("input", function () {
        updateValueDisplay(this.value);
    });

    // Initialize with default value
    updateValueDisplay(slider.value);
});
