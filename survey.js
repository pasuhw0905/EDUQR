(function () {
  /** @type {HTMLHeadingElement} */
  const surveyTitle = document.getElementById('surveyTitle');
  /** @type {HTMLDivElement} */
  const qaForm = document.getElementById('qaForm');
  /** @type {HTMLButtonElement} */
  const submitBtn = document.getElementById('submitBtn');

  function parsePayloadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (!data) return null;
    try {
      const json = atob(data);
      const decoded = decodeURIComponent(json);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('설문 데이터 해석 실패', e);
      return null;
    }
  }

  function renderForm(payload) {
    qaForm.innerHTML = '';
    if (surveyTitle) surveyTitle.textContent = payload.programName || '교육 출석 체크';

    (payload.questions || []).forEach((q, idx) => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'survey-field';

      const label = document.createElement('label');
      label.className = 'field-label';
      label.textContent = q.question || '';

      const answer = document.createElement('input');
      answer.className = 'input';
      answer.type = 'text';
      answer.placeholder = `${q.question || ''}을(를) 입력하세요`;
      answer.name = `answer_${idx + 1}`;

      fieldWrapper.appendChild(label);
      fieldWrapper.appendChild(answer);
      qaForm.appendChild(fieldWrapper);
    });
  }

  function handleSubmit(payload) {
    const answers = Array.from(qaForm.querySelectorAll('input[name^="answer_"]'))
      .map((el) => el.value);
    const submission = {
      programName: payload.programName,
      qas: (payload.questions || []).map((q, i) => ({ question: q.question, answer: answers[i] || '' })),
      submittedAt: new Date().toISOString()
    };
    alert('제출되었습니다.\n' + JSON.stringify(submission, null, 2));
  }

  const payload = parsePayloadFromUrl();
  if (!payload) {
    qaForm.innerHTML = '<p>설문 데이터를 찾을 수 없습니다. 올바른 QR을 사용해 주세요.</p>';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  renderForm(payload);

  submitBtn.addEventListener('click', () => handleSubmit(payload));
})(); 