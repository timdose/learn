document.addEventListener('DOMContentLoaded', function() {
    // Helper function to determine if a date is in EDT
    const isEDT = (date) => {
        // EDT starts on the second Sunday in March
        // EDT ends on the first Sunday in November
        const year = date.getFullYear();
        
        // Create dates for start and end of EDT
        const marchSecondSunday = new Date(year, 2, 1);
        while (marchSecondSunday.getDay() !== 0) {
            marchSecondSunday.setDate(marchSecondSunday.getDate() + 1);
        }
        marchSecondSunday.setDate(marchSecondSunday.getDate() + 7);
        marchSecondSunday.setHours(2, 0, 0, 0);

        const novemberFirstSunday = new Date(year, 10, 1);
        while (novemberFirstSunday.getDay() !== 0) {
            novemberFirstSunday.setDate(novemberFirstSunday.getDate() + 1);
        }
        novemberFirstSunday.setHours(2, 0, 0, 0);

        return date >= marchSecondSunday && date < novemberFirstSunday;
    };

    document.querySelectorAll('.local-time').forEach(span => {
        const originalTime = span.dataset.originalTime;
        const [dayOfWeek, timeString] = originalTime.split(' ');
        const timeRange = timeString.split('(')[0].trim();
        const [startTime, endTime] = timeRange.split('-');
        
        // Function to convert time to hours and minutes
        const parseTime = (time) => {
            const isPM = time.toLowerCase().includes('pm');
            const [hourMin, period] = time.split(/(?=[ap]m)/i);
            let [hours, minutes = 0] = hourMin.split(':').map(num => parseInt(num));
            
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            
            return { hours, minutes };
        };
        
        // Get the next occurrence of the specified day
        const getDayDate = (dayName) => {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const today = new Date();
            const targetDay = days.indexOf(dayName.toLowerCase());
            const currentDay = today.getDay();
            let daysUntilTarget = targetDay - currentDay;
            
            if (daysUntilTarget < 0) daysUntilTarget += 7;
            
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + daysUntilTarget);
            return targetDate;
        };
        
        // Convert start and end times
        const startParts = parseTime(startTime);
        const endParts = parseTime(endTime);
        
        // Create date objects for start and end times using the next occurrence of the day
        const baseDate = getDayDate(dayOfWeek);
        
        // Create dates with explicit timezone handling
        const createDateInET = (baseDate, hours, minutes) => {
            // Determine if we're in EDT or EST
            const inEDT = isEDT(baseDate);
            const etOffset = inEDT ? '-04:00' : '-05:00';
            
            // Create a date string in ET
            const dateString = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${etOffset}`;
            return new Date(dateString);
        };
        
        const startDate = createDateInET(baseDate, startParts.hours, startParts.minutes);
        const endDate = createDateInET(baseDate, endParts.hours, endParts.minutes);
        
        // Format the times
        const formatTime = (date, baseDate) => {
            const originalDay = baseDate.getDay();
            const localDay = date.getDay();
            
            let timeStr = date.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            // Add day indicator if the day changes
            if (localDay !== originalDay) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                timeStr = `${days[localDay]} ${timeStr}`;
            }
            
            return timeStr;
        };
        
        const localStartTime = formatTime(startDate, baseDate);
        const localEndTime = formatTime(endDate, baseDate);
        
        // Only show local time if either time is different
        if (localStartTime !== startTime || localEndTime !== endTime) {
            span.textContent = ` (${localStartTime}-${localEndTime} your time)`;
        }
    });
});
