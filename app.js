const storageKey = 'focus-path-topics-v1';
let topics = JSON.parse(localStorage.getItem(storageKey) || '[]');

const $ = (selector) => document.querySelector(selector);
const topicForm = $('#topicForm');
const logForm = $('#logForm');
const today = new Date();
const localDate = (date = new Date()) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

$('#todayLabel').textContent = today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
$('#topicDue').min = localDate();
$('#logDate').value = localDate();

function save() { localStorage.setItem(storageKey, JSON.stringify(topics)); }
function minutesText(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  const hourText = hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
  const minuteText = mins ? `${mins} ${mins === 1 ? 'minute' : 'minutes'}` : '';
  return [hourText, minuteText].filter(Boolean).join(' ') || '0 minutes';
}
function studied(topic) { return topic.logs.reduce((sum, log) => sum + log.minutes, 0); }
function daysUntil(dateString) { const target = new Date(`${dateString}T23:59:59`); return Math.ceil((target - new Date()) / 86400000); }

function render() {
  const totalMinutes = topics.reduce((sum, topic) => sum + studied(topic), 0);
  const todayMinutes = topics.reduce((sum, topic) => sum + topic.logs.filter(log => log.date === localDate()).reduce((value, log) => value + log.minutes, 0), 0);
  const onTrack = topics.filter(topic => {
    const total = topic.totalMinutes;
    const start = new Date(topic.createdAt);
    const end = new Date(`${topic.dueDate}T23:59:59`);
    const elapsed = Math.min(1, Math.max(0, (Date.now() - start) / Math.max(1, end - start)));
    return studied(topic) >= total * elapsed || studied(topic) >= total;
  }).length;
  $('#focusedMinutes').textContent = minutesText(totalMinutes);
  $('#todayMinutes').textContent = minutesText(todayMinutes);
  $('#todayPrompt').textContent = todayMinutes ? 'Nice work — keep the rhythm' : 'Start with 25 minutes';
  $('#onTrackCount').textContent = `${onTrack} / ${topics.length}`;
  $('#emptyState').hidden = topics.length > 0;
  const list = $('#topicList'); list.innerHTML = '';
  topics.slice().sort((a,b) => a.dueDate.localeCompare(b.dueDate)).forEach(topic => {
    const node = $('#topicTemplate').content.cloneNode(true);
    const completed = studied(topic); const percent = Math.min(100, Math.round((completed / topic.totalMinutes) * 100));
    const days = daysUntil(topic.dueDate); const remaining = Math.max(0, topic.totalMinutes - completed);
    node.querySelector('.topic-title').textContent = topic.name;
    node.querySelector('.topic-meta').textContent = `${minutesText(topic.totalMinutes)} planned · due ${new Date(`${topic.dueDate}T00:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric'})}`;
    node.querySelector('.progress-fill').style.width = `${percent}%`;
    node.querySelector('.progress-label').textContent = `${percent}%`;
    node.querySelector('.pace').textContent = completed >= topic.totalMinutes ? 'Completed — excellent!' : days < 0 ? `${minutesText(remaining)} still to finish` : `${minutesText(Math.ceil(remaining / Math.max(1, days + 1)))} / day to finish`;
    node.querySelector('.due-status').textContent = days < 0 ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue` : days === 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} left`;
    node.querySelector('.delete-btn').addEventListener('click', () => { topics = topics.filter(item => item.id !== topic.id); save(); render(); });
    list.append(node);
  });
  const select = $('#logTopic'); const oldSelection = select.value; select.innerHTML = '';
  if (!topics.length) { select.innerHTML = '<option value="">Add a topic first</option>'; select.disabled = true; logForm.querySelector('button').disabled = true; }
  else { select.disabled = false; logForm.querySelector('button').disabled = false; topics.forEach(topic => { const option = new Option(topic.name, topic.id); select.add(option); }); select.value = oldSelection || topics[0].id; }
}

topicForm.addEventListener('submit', event => {
  event.preventDefault();
  const amount = Number($('#topicLength').value); const unit = $('#lengthUnit').value;
  topics.push({ id: crypto.randomUUID(), name: $('#topicName').value.trim(), dueDate: $('#topicDue').value, totalMinutes: unit === 'hours' ? amount * 60 : amount, createdAt: new Date().toISOString(), logs: [] });
  save(); topicForm.reset(); $('#topicDue').min = localDate(); $('#formNote').textContent = 'Topic added and saved on this device.'; render();
});
logForm.addEventListener('submit', event => {
  event.preventDefault(); const topic = topics.find(item => item.id === $('#logTopic').value); if (!topic) return;
  const value = Number($('#logMinutes').value); topic.logs.push({ date: $('#logDate').value, minutes: $('#logUnit').value === 'hours' ? value * 60 : value });
  save(); logForm.reset(); $('#logDate').value = localDate(); $('#formNote').textContent = 'Study session recorded and saved — nice work.'; render();
});
$('#clearAll').addEventListener('click', () => { if (topics.length && confirm('Remove every topic and study log?')) { topics = []; save(); render(); } });
render();
