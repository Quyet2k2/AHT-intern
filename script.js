"use strict";

let weekArr = getFromStorage("weekArr", []);

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, defaultVal) {
  const value = localStorage.getItem(key);

  if (value === "" || value === "NaN" || value === "undefined")
    return defaultVal;
  else return JSON.parse(value);
}

// NAV LOGIC
const elements = {
  staff: {
    trigger: document.querySelector(".js-staff"),
    icon: document.querySelector(".js-staff-icon"),
    list: document.querySelector(".js-staff-list"),
  },
  fillter: {
    trigger: document.querySelector(".js-fillter"),
    icon: document.querySelector(".js-fillter-icon"),
    list: document.querySelector(".js-fillter-list"),
  },
  job: {
    trigger: document.querySelector(".js-job"),
    icon: document.querySelector(".js-job-icon"),
    list: document.querySelector(".js-job-list"),
  },
  state: {
    trigger: document.querySelector(".js-state"),
    icon: document.querySelector(".js-state-icon"),
    list: document.querySelector(".js-state-list"),
  },
  project: {
    trigger: document.querySelector(".js-project"),
    icon: document.querySelector(".js-project-icon"),
    list: document.querySelector(".js-project-list"),
  },
  updateTime: {
    trigger: document.querySelector(".js-update-time"),
    icon: document.querySelector(".js-update-time-icon"),
    list: document.querySelector(".js-update-time-list"),
  },
};

// Hàm cập nhật trạng thái
function toggleVisibility(activeKey) {
  Object.keys(elements).forEach((key) => {
    const { trigger, icon, list } = elements[key];

    if (key === activeKey) {
      const isVisible = list.classList.contains("visible");
      list.classList.toggle("visible", !isVisible);
      list.classList.toggle("hidden", isVisible);
      icon.classList.toggle("fa-caret-up", !isVisible);
      icon.classList.toggle("fa-caret-down", isVisible);
    } else {
      list.classList.remove("visible");
      list.classList.add("hidden");
      icon.classList.remove("fa-caret-up");
      icon.classList.add("fa-caret-down");
    }
  });
}

// Xử lý sự kiện nhấp chuột vào các phần tử điều khiển
Object.keys(elements).forEach((key) => {
  const { trigger } = elements[key];
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleVisibility(key);
  });
});

// Xử lý sự kiện nhấp chuột toàn trang
document.addEventListener("click", () => {
  toggleVisibility(null); // Đóng tất cả các danh sách
});

// Hàm cập nhật DOM
function updateDOM() {
  const mainContent = document.querySelector(".js-main-content");
  mainContent.innerHTML = `<div class="d-flex w-100 align-content-center justify-content-center py-2">
          <button type="button" class="btn btn-danger js-reset-data-btn">
            reset model data
          </button>
        </div>`; // Xóa nội dung hiện tại
  document
    .querySelector(".js-reset-data-btn")
    .addEventListener("click", function () {
      modelData();
      alert("Vui lòng tải lại trang!");
    });
  weekArr.forEach((weekItem, weekIndex) => {
    if (weekItem.weekJobItems.length > 0) {
      const weekHtml = `<div class="week js-week${weekIndex + 1}">
            <div class="week-heading">
              <p class="js-week-time border-bottom border-2 opacity-75 pb-1 pt-3 text-uppercase">
                Tuần ${weekItem.weekTime}
              </p>
            </div>
            <div class="week-content js-week-content-${
              weekIndex + 1
            }">  </div>`;
      mainContent.insertAdjacentHTML("beforeend", weekHtml);

      const weekContent = document.querySelector(
        `.js-week-content-${weekIndex + 1}`
      );
      weekItem.weekJobItems.forEach((e) => {
        const weekItemHtml = `<div class="js-week-item-${e.id}">
              <div class="week-item">
                <div class="week-item-right-content">
                  <input type="radio" class="js-job-check job-check" />
                  <div class="week-item-main-content">
                    <div class="week-item-main-top-content">
                      <p class="fw-bold fs-6">${e.itemName}</p>
                    </div>
                    <div class="week-item-main-bottom-content">
                      <span>Công việc của TNG</span>
                      <span class="opacity-50 fw-bold">Tạo bởi ${e.createUser}</span>
                    </div>
                  </div>
                </div>
                <div class="week-item-left-content">
                  <div class="week-item-left-top-content">
                    <span class="d-inline-block job-time">${e.jobTime}</span>
                    <span class="d-inline-block">
                      <img src="${e.ownerSrcImg}" alt="" class="owner-img" />
                      ${e.owner}
                    </span>
                    <i class="fa-regular fa-star ${e.favoriteState}"></i>
                  </div>
                  <div class="week-item-left-bottom-content">
                    <i class="fa-solid fa-square-pen"></i>
                    <i class="fa-regular fa-calendar-days"></i>
                    <i class="fa-solid fa-circle-play"></i>
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <i class="fa-solid fa-bookmark ${e.bookmarkState}"></i>
                    <i class="fa-solid fa-bell"></i>
                    <i class="fa-regular fa-trash-can js-trash-can" data-job-id="${e.id}"></i>
                  </div>
                </div>
              </div>
            </div>`;
        weekContent.insertAdjacentHTML("beforeend", weekItemHtml);
      });
    }
  });
  saveToStorage("weekArr", weekArr);
}

// Xử lý sự kiện xóa công việc
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("js-trash-can")) {
    // Lấy ID công việc từ thuộc tính data-job-id
    const jobId = parseInt(e.target.getAttribute("data-job-id"), 10);

    // Tìm phần tử công việc trong DOM
    const jobItem = e.target.closest(".week-item");
    if (jobItem) {
      // Xóa phần tử công việc từ DOM
      jobItem.remove();

      // Cập nhật dữ liệu trong mảng
      weekArr.forEach((week) => {
        week.weekJobItems = week.weekJobItems.filter((job) => job.id !== jobId);
      });

      // Nếu không còn công việc nào trong tuần, xóa tuần đó
      weekArr = weekArr.filter((week) => week.weekJobItems.length > 0);

      // Cập nhật DOM
      updateDOM();
    }
  }
});

// Khởi tạo giao diện khi trang được tải
updateDOM();

// // model data
function modelData() {
  // Dữ liệu công việc
  let weekArr = [
    {
      weekTime: "15/07 - 21/07/24",
      weekJobItems: [
        {
          id: 101,
          itemName: "Họp tiến độ triển khai dự án",
          ownerSrcImg: "./user-img.png",
          owner: "TNG",
          jobTime: "27/01/2024",
          createUser: "@TRETNG",
          favoriteState: false,
          bookmarkState: true,
        },
        {
          id: 102,
          itemName: "Xây dựng timline triển khai dự án VPS - An Khánh",
          ownerSrcImg: "./user-img.png",
          owner: "TNG",
          jobTime: "",
          createUser: "@TRETNG",
          favoriteState: false,
          bookmarkState: true,
        },
      ],
    },
    {
      weekTime: "08/07 - 14/07/24",
      weekJobItems: [
        {
          id: 201,
          itemName: "Tạo bảng phân tích chức năng",
          ownerSrcImg: "./user-img.png",
          owner: "TNG",
          jobTime: "16/07/2024",
          createUser: "@TRETNG",
          favoriteState: false,
          bookmarkState: true,
        },
      ],
    },
  ];
  saveToStorage("weekArr", weekArr);
}
