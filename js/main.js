// 当前日期显示
function updateCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// 习惯数据结构
const habits = [
    { id: 1, name: 'Wake Up at 8 AM', icon: '⏰' },
    { id: 2, name: 'Morning Focus (1h)', icon: '🎯' },
    { id: 3, name: 'Exercise (1h)', icon: '💪' },
    { id: 4, name: 'Read 10 Pages', icon: '📚' },
    { id: 5, name: 'Study (1h)', icon: '📝' },
    { id: 6, name: 'Healthy Diet', icon: '🥗' }
];

// 初始化今日数据
function initTodayData() {
    const today = new Date();
    const todayData = {
        habits: habits.reduce((acc, habit) => {
            acc[habit.id] = false;
            return acc;
        }, {}),
        reflection: ''
    };
    
    storageManager.saveDateData(today, todayData);
    return todayData;
}

// 更新习惯状态显示
function updateHabitDisplay() {
    const today = new Date();
    let todayData = storageManager.getDateData(today);
    
    if (!todayData) {
        todayData = initTodayData();
    }
    
    habits.forEach(habit => {
        const card = document.querySelector(`.habit-card[data-id="${habit.id}"]`);
        if (todayData.habits[habit.id]) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });
    
    // 更新今日感悟
    document.getElementById('dailyReflection').value = todayData.reflection || '';
}

// 切换习惯完成状态
function toggleHabit(habitId) {
    const today = new Date();
    let todayData = storageManager.getDateData(today);
    
    if (!todayData) {
        todayData = initTodayData();
    }
    
    todayData.habits[habitId] = !todayData.habits[habitId];
    storageManager.saveDateData(today, todayData);
    
    updateHabitDisplay();
}

// 保存今日感悟
function saveReflection() {
    const today = new Date();
    let todayData = storageManager.getDateData(today);
    
    if (!todayData) {
        todayData = initTodayData();
    }
    
    const reflection = document.getElementById('dailyReflection').value;
    todayData.reflection = reflection;
    storageManager.saveDateData(today, todayData);
    
    // 显示保存成功提示
    const button = document.getElementById('saveReflection');
    const originalText = button.textContent;
    button.textContent = 'Saved';
    button.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// 初始化页面
function initializePage() {
    updateCurrentDate();
    updateHabitDisplay();
    
    // 添加打卡按钮点击事件
    document.querySelectorAll('.habit-check').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡到卡片
            const habitId = parseInt(button.closest('.habit-card').dataset.id);
            toggleHabit(habitId);
        });
    });
    
    // 添加习惯卡片点击事件（跳转到详情页）
    document.querySelectorAll('.habit-card').forEach(card => {
        card.addEventListener('click', () => {
            const habitId = card.dataset.id;
            window.location.href = `detail.html?id=${habitId}`;
        });
    });
    
    // 添加保存感悟按钮事件
    document.getElementById('saveReflection').addEventListener('click', saveReflection);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage); 