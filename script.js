function showSchedule(week) {
    var week1Schedule = document.getElementById('schedule-week-1');
    var week2Schedule = document.getElementById('schedule-week-2');

    if (week === 1) {
        week1Schedule.style.display = 'block';
        week2Schedule.style.display = 'none';
    } else if (week === 2) {
        week1Schedule.style.display = 'none';
        week2Schedule.style.display = 'block';
    }
}
