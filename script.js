// Основная структура сайта с авторизацией и разделением на пользователя и администратора

const users = {
    admin: {
        password: 'admin123'
    }
};

let currentUser = null;

function showUserPage() {
    document.body.innerHTML = `
        <h2>Бронирование стиральной машины</h2>
        <button onclick="showLoginPage()" style="float: right;">Вход для администратора</button>
        <input type="text" id="name" placeholder="Фамилия Имя">
        <input type="text" id="room" placeholder="Номер комнаты">
        <input type="text" id="phone" placeholder="Телефон">
        <select id="daySelect"></select>
        <select id="timeSelect">
            ${Array.from({ length: 14 }, (_, i) => `<option>${9 + i}:00</option>`).join('')}
        </select>
        <button onclick="bookSlot()">Забронировать</button>
        <table id="scheduleTable">
            <thead>
                <tr>
                    <th>Время</th>
                    <th>Понедельник</th>
                    <th>Вторник</th>
                    <th>Среда</th>
                    <th>Четверг</th>
                    <th>Пятница</th>
                    <th>Суббота</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    createTable();
    populateDays();
}

function showLoginPage() {
    document.body.innerHTML = `
        <h2>Вход для администратора</h2>
        <input type="text" id="username" placeholder="Логин">
        <input type="password" id="password" placeholder="Пароль">
        <button onclick="login()">Войти</button>
    `;
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert('Вход выполнен!');
        showAdminPanel();
    } else {
        alert('Неверный логин или пароль!');
    }
}

function showAdminPanel() {
    document.body.innerHTML = `
        <h2>Админ-панель</h2>
        <button onclick="showUserPage()">Переключиться на вид пользователя</button>
        <button onclick="clearTable()">Очистить таблицу</button>
        <button onclick="exportLog()">Экспорт лога</button>
        <div id="log"></div>
        <table id="scheduleTable">
            <thead>
                <tr>
                    <th>Время</th>
                    <th>Понедельник</th>
                    <th>Вторник</th>
                    <th>Среда</th>
                    <th>Четверг</th>
                    <th>Пятница</th>
                    <th>Суббота</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    createTable();
}

function createTable() {
    const tableBody = document.querySelector('#scheduleTable tbody');
    tableBody.innerHTML = '';

    for (let hour = 9; hour <= 22; hour++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = `${hour}:00`;
        row.appendChild(timeCell);

        for (let day = 1; day <= 6; day++) {
            const cell = document.createElement('td');
            cell.contentEditable = currentUser === 'admin';

            if (currentUser === 'admin') {
                cell.addEventListener('input', () => logChange(hour, day, cell.textContent));
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function populateDays() {
    const daySelect = document.getElementById('daySelect');
    ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'].forEach((day, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = day;
        daySelect.appendChild(option);
    });
}

function bookSlot() {
    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    const phone = document.getElementById('phone').value;
    const day = document.getElementById('daySelect').value;
    const time = document.getElementById('timeSelect').value;

    if (!name || !room || !phone) {
        alert('Заполните все поля!');
        return;
    }

    const rows = document.querySelectorAll('#scheduleTable tbody tr');
    for (const row of rows) {
        if (row.children[0].textContent === time) {
            const cell = row.children[day];
            if (cell.textContent) {
                alert('Время уже занято!');
                return;
            }
            cell.textContent = `${name}, ${room}, ${phone}`;
            logChange(time, day, `${name}, ${room}, ${phone}`);
            alert('Бронирование выполнено!');
            return;
        }
    }
}

function logChange(time, day, newValue) {
    const log = document.getElementById('log');
    if (log) {
        const entry = document.createElement('div');
        entry.textContent = `${new Date().toLocaleString()} - Время: ${time}, День: ${day}, Данные: ${newValue}`;
        log.appendChild(entry);
    }
}

function clearTable() {
    document.querySelectorAll('#scheduleTable tbody td[contenteditable="true"]').forEach(cell => cell.textContent = '');
    logChange('Все', 'Все', 'Таблица очищена');
}

function exportLog() {
    const log = document.getElementById('log').innerText;
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'log.txt';
    a.click();
    URL.revokeObjectURL(url);
}

showUserPage();
