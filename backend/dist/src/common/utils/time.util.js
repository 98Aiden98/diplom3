"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayOfWeek = exports.rangesOverlap = exports.minutesToTime = exports.timeToMinutes = void 0;
const timeToMinutes = (value) => {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
};
exports.timeToMinutes = timeToMinutes;
const minutesToTime = (value) => {
    const hours = Math.floor(value / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};
exports.minutesToTime = minutesToTime;
const rangesOverlap = (startA, endA, startB, endB) => {
    const aStart = (0, exports.timeToMinutes)(startA);
    const aEnd = (0, exports.timeToMinutes)(endA);
    const bStart = (0, exports.timeToMinutes)(startB);
    const bEnd = (0, exports.timeToMinutes)(endB);
    return aStart < bEnd && bStart < aEnd;
};
exports.rangesOverlap = rangesOverlap;
const getDayOfWeek = (date) => {
    const day = new Date(`${date}T00:00:00`).getDay();
    return day === 0 ? 7 : day;
};
exports.getDayOfWeek = getDayOfWeek;
//# sourceMappingURL=time.util.js.map