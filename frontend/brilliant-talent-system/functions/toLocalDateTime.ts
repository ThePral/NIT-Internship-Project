import React from 'react'

export const toLocalDateTime = ({ date, type }: { date?: Date, type: "justNumbersToFarsi" | "DateToFarsi" | "DateTimeToFarsi" }) => {
    if (!date) return
    if (type == "justNumbersToFarsi") {
        const date2 = new Date(date);
        const year = date2.getFullYear();
        const month = String(date2.getMonth() + 1).padStart(2, "0");
        const day = String(date2.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
    } else if (type == "DateToFarsi") {
        return new Date(date).toLocaleDateString('fa-IR')
    } else if (type == 'DateTimeToFarsi') {
        return new Date(date)?.toLocaleDateString("fa-IR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // برای نمایش زمان به صورت 24 ساعته
        })
    }
}
