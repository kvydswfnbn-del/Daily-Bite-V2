// 1. State Manager
const State = {
    selectedTab: 'today',
    selectedDate: '2026-07-01', // Using July 1, 2026 as current context
    deals: [],
    foodDays: [],
    isLoading: true
};

// 2. Loader
async function initApp() {
    try {
        // In production, these would be fetch() calls to deals.json and food_days.json
        // Mocking the fetch to demonstrate the architecture immediately
        State.deals = await mockFetchDeals();
        State.foodDays = await mockFetchFoodDays();
        State.isLoading = false;

        // Initialize Icons
        feather.replace();
        
        // Setup Event Listeners
        setupNavigation();
        
        // Initial Render
        renderApp();
    } catch (error) {
        console.error("Failed to load intelligence data:", error);
    }
}

// 3. Event Handlers
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            if (target) {
                State.selectedTab = target;
                
                // Update UI active states
                navButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Redraw
                renderApp();
            }
        });
    });
}

// 4. Renderer
function renderApp() {
    // Hide all views
    document.querySelectorAll('.page-container').forEach(container => {
        container.classList.add('hidden');
    });

    // Show target view and render its content
    const activeContainer = document.getElementById(`view-${State.selectedTab}`);
    activeContainer.classList.remove('hidden');

    if (State.selectedTab === 'today') renderToday(activeContainer);
    if (State.selectedTab === 'deals') renderDeals(activeContainer);
    if (State.selectedTab === 'calendar') renderCalendar(activeContainer);
}

function renderToday(container) {
    // Phase 1: Simple scaffold for Today screen
    container.innerHTML = `
        <div class="greeting-subtitle">GOOD MORNING</div>
        <div class="greeting-title">Wednesday<br>July 1</div>
        <div class="greeting-desc">Verified opportunities worth your attention today.</div>
        
        <div style="padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; text-align: center;">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                Scanning complete. Deals rendered here in Phase 2.
            </p>
        </div>
    `;
}

function renderDeals(container) {
    container.innerHTML = `<h2 class="greeting-title">All Opportunities</h2><p class="greeting-desc">Browse directory coming in Phase 3.</p>`;
}

function renderCalendar(container) {
    container.innerHTML = `<h2 class="greeting-title">Food Calendar</h2><p class="greeting-desc">Upcoming events coming in Phase 4.</p>`;
}

// Mock Data Loaders (Replace with fetch in actual deployment)
async function mockFetchDeals() {
    return [
        {
            "id": 27,
            "title": "Free Krispy Kreme Donut",
            "restaurant": "Krispy Kreme",
            "description": "One Original Glazed donut.",
            "location": "Nationwide",
            "bite_score": 100,
            "verified": true,
            "verification_type": "Official",
            "category": "Food Holiday",
            "event_start_date": "2026-07-10",
            "event_end_date": "2026-07-10",
            "source_url": "...",
            "reason": "National Donut Day"
        }
    ];
}

async function mockFetchFoodDays() {
    return [
        {
            "date": "2026-07-10",
            "holiday": "National Piña Colada Day"
        }
    ];
}

// Boot the app
document.addEventListener('DOMContentLoaded', initApp);
