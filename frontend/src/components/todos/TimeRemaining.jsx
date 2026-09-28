import { useEffect, useMemo, useState } from "react";

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function formatRemaining(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
}

function getTargetTime(targetDate) {
    if (!targetDate) return null;

    const date = new Date(targetDate);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

export default function TimeRemaining({ todo }) {
    const [now, setNow] = useState(Date.now());

    const targetTime = useMemo(() => {
        return getTargetTime(todo.targetDate);
    }, [todo.targetDate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const remainingMs = targetTime ? targetTime.getTime() - now : null;

    useEffect(() => {
        if (!targetTime || todo.done || remainingMs === null) return;
        if (remainingMs <= 0 || remainingMs > TWELVE_HOURS_MS) return;

        const notificationKey = `todo-notification-${todo.id}`;

        if (localStorage.getItem(notificationKey)) return;

        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Todo deadline is near", {
                body: `"${todo.description}" is due in ${formatRemaining(remainingMs)}.`,
            });

            localStorage.setItem(notificationKey, "sent");
        }
    }, [targetTime, remainingMs, todo]);

    if (!targetTime) {
        return <span className="text-muted">No valid time</span>;
    }

    if (todo.done) {
        return <span className="text-success">Completed</span>;
    }

    if (remainingMs <= 0) {
        return <span className="text-danger fw-bold">Overdue</span>;
    }

    const isLessThan12Hours = remainingMs <= TWELVE_HOURS_MS;

    return (
        <span className={isLessThan12Hours ? "text-danger fw-bold" : ""}>
            {formatRemaining(remainingMs)}
        </span>
    );
}