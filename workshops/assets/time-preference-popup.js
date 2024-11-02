document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.local-time').forEach(span => {
        const originalTime = span.dataset.originalTime; // Format: "Thursdays 12:30pm-2:30pm"
        
        // Extract just the time portion and handle possible "(Eastern Time)" suffix
        const timeRange = originalTime.split(' ')[1].split('(')[0].trim(); // "12:30pm-2:30pm"
        const [startTime, endTime] = timeRange.split('-'); // ["12:30pm", "2:30pm"]
        
        // Function to convert time to hours and minutes
        const parseTime = (time) => {
            const isPM = time.toLowerCase().includes('pm');
            const [hourMin, period] = time.split(/(?=[ap]m)/i);
            let [hours, minutes = 0] = hourMin.split(':').map(num => parseInt(num));
            
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            
            return { hours, minutes };
        };
        
        // Convert start and end times
        const startParts = parseTime(startTime);
        const endParts = parseTime(endTime);
        
        // Create date objects for start and end times
        const startDate = new Date();
        startDate.setHours(startParts.hours, startParts.minutes);
        
        const endDate = new Date();
        endDate.setHours(endParts.hours, endParts.minutes);
        
        // Format the times
        const formatTime = (date) => date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const localStartTime = formatTime(startDate);
        const localEndTime = formatTime(endDate);
        
        // Only show local time if either time is different
        if (localStartTime !== startTime || localEndTime !== endTime) {
            span.textContent = ` (${localStartTime}-${localEndTime} your time)`;
        }
    });
});
