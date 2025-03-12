// 存储管理类
class StorageManager {
    constructor() {
        this.storageKey = 'habitTracker';
        this.initializeStorage();
    }

    // 初始化存储
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                habits: {},
                lastReset: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    // 获取特定日期的数据
    getDateData(date) {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        const dateKey = this.formatDate(date);
        return data.habits[dateKey] || null;
    }

    // 保存特定日期的数据
    saveDateData(date, habitData) {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        const dateKey = this.formatDate(date);
        data.habits[dateKey] = habitData;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // 获取日期范围内的数据
    getDateRangeData(startDate, endDate) {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        const result = {};
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateKey = this.formatDate(currentDate);
            result[dateKey] = data.habits[dateKey] || null;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return result;
    }

    // 检查是否需要重置
    checkReset() {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        const lastReset = new Date(data.lastReset);
        const now = new Date();
        
        // 如果最后重置时间不是今天，则需要重置
        if (this.formatDate(lastReset) !== this.formatDate(now)) {
            data.lastReset = now.toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        }
        return false;
    }

    // 格式化日期为YYYY-MM-DD
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // 清除所有数据（用于测试）
    clearAll() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    // 获取习惯完成统计
    getHabitStats(habitId) {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        let completed = 0;
        let total = 0;
        
        for (const dateKey in data.habits) {
            if (data.habits[dateKey] && data.habits[dateKey].habits) {
                total++;
                if (data.habits[dateKey].habits[habitId]) {
                    completed++;
                }
            }
        }
        
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // 获取感悟完成统计
    getReflectionStats() {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        let completed = 0;
        let total = 0;
        
        for (const dateKey in data.habits) {
            if (data.habits[dateKey]) {
                total++;
                if (data.habits[dateKey].reflection && data.habits[dateKey].reflection.trim() !== '') {
                    completed++;
                }
            }
        }
        
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // 获取第一次记录的日期
    getFirstRecordDate() {
        const data = JSON.parse(localStorage.getItem(this.storageKey));
        const dates = Object.keys(data.habits).sort();
        return dates.length > 0 ? dates[0] : null;
    }

    // 导出数据
    exportData() {
        return localStorage.getItem(this.storageKey);
    }

    // 导入数据
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.habits && data.lastReset) {
                localStorage.setItem(this.storageKey, jsonData);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}

// 创建全局存储管理器实例
const storageManager = new StorageManager(); 