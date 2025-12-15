export function getWeekNumber(currentDate: Date, startDate: Date): number {
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // If diffDays is negative, we are before start. Return 1 or 0? 
    // Usually week 1 starts on startDate.
    // diffDays = 0 -> Week 1. diffDays = 7 -> Week 2.
    return Math.floor(diffDays / 7) + 1;
}

export function parseWeekRange(connection: string): number[] {
    // connection string format: "[1-16周]" or "[1-2,4-16周]" or "[3-5周] 星期二"
    // First extract the content inside [].
    const match = connection.match(/\[(.*?)\]/);
    if (!match) return []; // Fallback: show always? or never?

    const content = match[1]; // "1-16周" or "1-2,4-16周"
    const cleanContent = content.replace("周", ""); // "1-16" or "1-2,4-16"

    const ranges = cleanContent.split(',');
    const weeks: number[] = [];

    ranges.forEach(range => {
        if (range.includes('-')) {
            const parts = range.split('-');
            if (parts.length === 2) {
                const start = parseInt(parts[0]);
                const end = parseInt(parts[1]);
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        weeks.push(i);
                    }
                }
            }
        } else {
            const week = parseInt(range);
            if (!isNaN(week)) {
                weeks.push(week);
            }
        }
    });

    return weeks;
}

export function isCourseActiveInWeek(connection: string, week: number): boolean {
    const weeks = parseWeekRange(connection);
    // If parse failed (empty), maybe assume it's valid? 
    // Or strict? If strict, we might hide courses with malformed strings.
    // Let's be permissive if empty: return true.
    if (weeks.length === 0) return true;

    return weeks.includes(week);
}
