import Card from "../components/cards.js";
import {
  createCardInfoTemplate,
  createEditorTemplate,
} from "../components/templates.js";
import createModal from "../components/modal.js";
import { columnData } from "../../index.js";

const targetIdList = {
  add: addCard,
  inputTitle: checkRegisterStatus,
  inputContent: checkRegisterStatus,
  cancelBtn: cancelHandler,
  registerBtn: registerCard,
  saveBtn: saveHandler,
  deleteBtn: deleteHandler,
  editBtn: editCard,
};

export default function customEventHandler(event) {
  const target = event.target;
  const parentTarget = event.currentTarget;

  targetIdList[target.id]({ target, parentTarget });
}

// Column의 '+' 버튼 클릭시 카드 추가 함수
function addCard({ target }) {
  const column = target.closest(".column");
  const isExistCard = column.querySelector(".newCard");
  if (!isExistCard) {
    const card = Card();
    column.appendChild(card);
  } else {
    isExistCard.remove();
  }
}

// 등록 함수 활성화 판단 함수
function checkRegisterStatus({ parentTarget }) {
  const title = parentTarget.querySelector(".title");
  const content = parentTarget.querySelector(".content");
  const register = parentTarget.querySelector(".register");
  let status = !(title.value.trim() && content.value.trim());

  register.disabled = status;
  register.style.opacity = status ? 0.3 : 1;
}

// Card 등록 함수
function registerCard({ target, parentTarget }) {
  const card = target.closest(".newCard");
  const title = card.querySelector(".title");
  const content = card.querySelector(".content");
  const countBox = parentTarget.querySelector(".countBox");

  const newCount = Number(countBox.textContent) + 1;
  countBox.innerHTML = newCount;

  card.className = "registeredCard";

  const originalTitle = title.value;
  const originalContent = content.value;

  card.innerHTML = createCardInfoTemplate(originalTitle, originalContent);
  return card;
}

function editCard({ target }) {
  const columnId = target.closest(".column").id;
  const card = target.closest(".registeredCard");
  const title = card.querySelector(".registeredTitle").textContent;
  const content = card.querySelector(".registeredContent").textContent;
  localStorage.setItem(`originalTitle-${columnId}`, title);
  localStorage.setItem(`originalContent-${columnId}`, content);

  console.log(title, content);
  card.className = "newCard";
  card.innerHTML = createEditorTemplate(title, content, true);
}

function saveHandler({ target }) {
  const card = target.closest(".newCard");
  const newTitle = card.querySelector(".title").value;
  const newContent = card.querySelector(".content").value;
  card.className = "registeredCard";

  card.innerHTML = createCardInfoTemplate(newTitle, newContent);
}

function cancelHandler({ target }) {
  const columnId = target.closest(".column").id;
  const card = target.closest(".newCard");
  const currentStatus = card.querySelector(".register").textContent;
  const status = currentStatus === "저장";

  if (status) {
    const title = localStorage.getItem(`originalTitle-${columnId}`);
    const content = localStorage.getItem(`originalContent-${columnId}`);
    console.log(title, content);
    card.className = "registeredCard";
    card.innerHTML = createCardInfoTemplate(title, content);
    return;
  }
  card.remove();
}

function deleteHandler({ target, parentTarget }) {
  const registeredCard = target.closest(".registeredCard");
  createModal(parentTarget, registeredCard);
}
