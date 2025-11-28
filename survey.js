(function () {
  /** @type {HTMLHeadingElement} */
  const surveyTitle = document.getElementById('surveyTitle');
  /** @type {HTMLDivElement} */
  const qaForm = document.getElementById('qaForm');
  /** @type {HTMLButtonElement} */
  const submitBtn = document.getElementById('submitBtn');
  /** @type {HTMLParagraphElement} */
  const resultMessage = document.getElementById('resultMessage');
  /** @type {HTMLElement} */
  const printSection = document.getElementById('printSection');
  /** @type {HTMLButtonElement} */
  const printBtn = document.getElementById('printBtn');
  /** @type {HTMLElement} */
  const badgeProgram = document.getElementById('badgeProgram');
  /** @type {HTMLElement} */
  const badgeName = document.getElementById('badgeName');
  /** @type {HTMLElement} */
  const badgeOrg = document.getElementById('badgeOrg');

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

  function findAnswer(payload, answers, keywords) {
    const questions = payload.questions || [];
    for (let i = 0; i < questions.length; i++) {
      const qText = (questions[i].question || '').toLowerCase();
      if (keywords.some(keyword => qText.includes(keyword))) {
        return answers[i] || '';
      }
    }
    return '';
  }

  function showResult(text, isSuccess = true) {
    if (!resultMessage) return;
    resultMessage.textContent = text;
    resultMessage.style.color = isSuccess ? '#059669' : '#dc2626';
  }

  function renderBadge(payload, answers) {
    if (!printSection) return;
    const nameValue = findAnswer(payload, answers, ['이름', '성명', 'name']);
    const orgValue = findAnswer(payload, answers, ['소속', '부서', 'organization', 'team']);

    if (badgeProgram) badgeProgram.textContent = payload.programName || '교육명';
    if (badgeName) badgeName.textContent = nameValue || '이름 미입력';
    if (badgeOrg) badgeOrg.textContent = orgValue || '소속 미입력';

    printSection.classList.remove('hidden');
    printSection.setAttribute('aria-hidden', 'false');
  }

  function handleSubmit(payload) {
    const answers = Array.from(qaForm.querySelectorAll('input[name^="answer_"]'))
      .map((el) => el.value.trim());
    const submission = {
      programName: payload.programName,
      qas: (payload.questions || []).map((q, i) => ({ question: q.question, answer: answers[i] || '' })),
      submittedAt: new Date().toISOString()
    };

    alert('제출되었습니다.\n' + JSON.stringify(submission, null, 2));
    renderBadge(payload, answers);
    showResult('제출 완료되었습니다. 아래 이름표를 확인하고 출력해 주세요.');

    // 자동으로 인쇄 실행 (사용자가 취소 가능)
    setTimeout(() => window.print(), 400);
  }

  const payload = parsePayloadFromUrl();
  if (!payload) {
    qaForm.innerHTML = '<p>설문 데이터를 찾을 수 없습니다. 올바른 QR을 사용해 주세요.</p>';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  renderForm(payload);

  submitBtn.addEventListener('click', () => handleSubmit(payload));
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
})();