// ===============================
// DailyBite
// app.js
// ===============================

// -------------------------------
// State Manager
// -------------------------------
const State = {
    selectedTab: "today",
    selectedDate: new Date().toISOString().split("T")[0],
    deals: [],
    foodDays: [],
    isLoading: true
};

// -------------------------------
// Initialize App
// -------------------------------
async function initApp() {
    try {

        const dealsResponse = await fetch("./deals.json");
        const foodDaysResponse = await fetch("./food_days.json");

        if (!dealsResponse.ok) {
            throw new Error("Unable to load deals.json");
        }

        if (!foodDaysResponse.ok) {
            throw new Error("Unable to load food_days.json");
        }

        State.deals = await dealsResponse.json();
        State.foodDays = await foodDaysResponse.json();

        State.isLoading = false;

        console.log("Deals Loaded:", State.deals);
        console.log("Food Days Loaded:", State.foodDays);

        if (window.feather) {
            feather.replace();
        }

        setupNavigation();

        renderApp();

    } catch (error) {

        console.error(error);

        document.body.innerHTML = `
            <div style="
                color:white;
                padding:40px;
                font-family:sans-serif;
            ">
                <h2>Failed to load DailyBite data.</h2>
                <p>${error.message}</p>
                <p>Verify that deals.json and food_days.json exist in the project root.</p>
            </div>
        `;
    }
}

// -------------------------------
// Navigation
// -------------------------------
function setupNavigation() {

    const navButtons =
        document.querySelectorAll(".nav-item");

    navButtons.forEach(btn => {

        btn.addEventListener("click", e => {

            const target =
                e.currentTarget.dataset.target;

            if (!target) return;

            State.selectedTab = target;

            navButtons.forEach(b =>
                b.classList.remove("active")
            );

            e.currentTarget.classList.add("active");

            renderApp();

        });

    });

}

// -------------------------------
// Render Router
// -------------------------------
function renderApp() {

    document
        .querySelectorAll(".page-container")
        .forEach(page =>
            page.classList.add("hidden")
        );

    const active =
        document.getElementById(
            `view-${State.selectedTab}`
        );

    if (active)
        active.classList.remove("hidden");

    switch (State.selectedTab) {

        case "today":
            renderToday(active);
            break;

        case "deals":
            renderDeals(active);
            break;

        case "calendar":
            renderCalendar(active);
            break;

    }

}

// -------------------------------
// Today Screen
// -------------------------------
function renderToday(container) {

    const today =
        State.selectedDate;

    const todayDeals =
        State.deals
            .filter(deal =>
                deal.event_start_date <= today &&
                deal.event_end_date >= today
            )
            .sort((a, b) =>
                b.bite_score - a.bite_score
            );

    const formattedDate =
        new Date(today).toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

    container.innerHTML = `
        <div class="greeting-subtitle">
            GOOD MORNING
        </div>

        <div class="greeting-title">
            ${formattedDate}
        </div>

        <div class="greeting-desc">
            Verified opportunities worth your attention today.
        </div>

        ${
            todayDeals.length
                ? todayDeals
                    .map(createDealCard)
                    .join("")
                : `
                <div class="empty-state">
                    <p>No verified deals today.</p>
                </div>
                `
        }
    `;

}

// -------------------------------
// Browse Screen
// -------------------------------
function renderDeals(container) {

    const sorted =
        [...State.deals]
            .sort((a, b) =>
                b.bite_score - a.bite_score
            );

    container.innerHTML = `

        <div class="greeting-title">
            All Opportunities
        </div>

        <div class="greeting-desc">
            Browse every verified DailyBite opportunity.
        </div>

        ${sorted.map(createDealCard).join("")}

    `;

}

// -------------------------------
// Calendar Screen
// -------------------------------
function renderCalendar(container) {

    const holidays =
        State.foodDays
            .map(day => `
                <div class="holiday-row">

                    <strong>
                        ${day.holiday}
                    </strong>

                    <div>
                        ${day.date}
                    </div>

                </div>
            `)
            .join("");

    container.innerHTML = `

        <div class="greeting-title">
            Food Calendar
        </div>

        <div class="greeting-desc">
            Upcoming National Food Holidays
        </div>

        ${holidays}

    `;

}

// -------------------------------
// Deal Card
// -------------------------------
function createDealCard(deal) {

    return `

    <div class="deal-card">

        <div class="deal-score">

            ${deal.bite_score}

        </div>

        <div class="deal-content">

            <h3>${deal.title}</h3>

            <p>${deal.description}</p>

            <small>

                ${deal.restaurant}

                •

                ${deal.location}

            </small>

            <br><br>

            <a
                href="${deal.source_url}"
                target="_blank"
            >
                View Source
            </a>

        </div>

    </div>

    `;

}

// -------------------------------
// Boot
// -------------------------------
document.addEventListener(
    "DOMContentLoaded",
    initApp
);