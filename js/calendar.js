// Habit details
const habitDetails = {
    1: {
        title: 'Wake Up at 8 AM'
    },
    2: {
        title: 'Morning Focus (1h)'
    },
    3: {
        title: 'Exercise (1h)'
    },
    4: {
        title: 'Read 10 Pages'
    },
    5: {
        title: 'Study (1h)'
    },
    6: {
        title: 'Healthy Diet'
    },
    7: {
        title: 'Today\'s Reflection'
    }
};

// Get habit ID from URL
function getHabitId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Update page title
function updatePageInfo(habitId) {
    const habit = habitDetails[habitId];
    if (habit) {
        document.getElementById('habitTitle').textContent = habit.title;
    }
}

// Generate 50-day progress grid
function generateCalendar(habitId) {
    const calendar = document.getElementById('habitCalendar');
    calendar.innerHTML = '';
    
    // Get current day count (starting from 1)
    const startDate = new Date(storageManager.getFirstRecordDate() || new Date());
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate 50 progress cells
    for (let i = 1; i <= 50; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        // Check if today
        if (i === daysPassed && daysPassed <= 50) {
            dayElement.classList.add('today');
        }
        
        // Check if future date
        if (i > daysPassed) {
            dayElement.classList.add('future');
        }
        
        // Check if completed
        if (i <= daysPassed) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i - 1);
            const dayData = storageManager.getDateData(date);
            
            if (habitId === 7) {
                if (dayData && dayData.reflection && dayData.reflection.trim() !== '') {
                    dayElement.classList.add('completed');
                }
            } else {
                if (dayData && dayData.habits && dayData.habits[habitId]) {
                    dayElement.classList.add('completed');
                }
            }
        }
        
        calendar.appendChild(dayElement);
    }
}

// Update statistics
function updateStats(habitId) {
    const stats = habitId === 7 ? 
        storageManager.getReflectionStats() : 
        storageManager.getHabitStats(habitId);
    
    document.getElementById('daysCompleted').textContent = `${stats.completed}`;
    document.getElementById('completionRate').textContent = `${stats.percentage}%`;
    
    // Calculate current streak
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
        const dayData = storageManager.getDateData(currentDate);
        
        if (habitId === 7) {
            if (dayData && dayData.reflection && dayData.reflection.trim() !== '') {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        } else {
            if (dayData && dayData.habits && dayData.habits[habitId]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    
    document.getElementById('currentStreak').textContent = `${streak}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const habitId = getHabitId();
    if (habitId && habitDetails[habitId]) {
        updatePageInfo(habitId);
        generateCalendar(habitId);
        updateStats(habitId);
    } else {
        window.location.href = 'index.html';
    }
}); 