// Tabs
const tabHeaders = document.querySelectorAll('[data-tab]');
const contentBoxes = document.querySelectorAll('[data-tab-content]');
tabHeaders.forEach((tab, index) => {

  tab.addEventListener('click', function () {
    tabHeaders.forEach(tab => {
      tab.classList.remove('active');
    });
    tab.classList.add('active')

    contentBoxes.forEach(function (box) {
      box.classList.add('hidden');

    });

    const contentBox = document.querySelector('#' + this.dataset.tab);
    contentBox.classList.remove('hidden');
  });
});

// Lodic for App
class Route {
  constructor(id, start, end, total, totalH, totalM, other, routeNum, locoModel, locoNum) {
    this.id = this.generateId();
    this.start = new Date(start).getTime();
    this.end = new Date(end).getTime();
    this.total = this.total();
    this.totalH = this.totalH();
    this.totalM = this.totalM();
    this.other = other;
    this.routeNum = routeNum;
    this.locoNum = locoNum;
    this.locoModel = locoModel;
  }
  total() {
    return Math.abs(Math.floor(this.end - this.start))
  }
  totalH() {
    const ms = Math.floor(this.end - this.start)
    return Math.floor((ms / (1000 * 60 * 60)) % 24)
  }
  totalM() {
    const ms = Math.floor(this.end - this.start)
    return Math.floor((ms / 1000 / 60) % 60)
  }
  generateId() {
    return Math.floor(Math.random() * 100000)
  }

  calcAllHours() {
    const routes = Store.getRoutes();
    const getMonth = routes.filter((month) => {
      const currentMonth = document.querySelector('.month-select select').value;
      const date = new Date(month.start);
      const mth = date.getMonth() + 1;
      if (mth === Number(currentMonth)) {
        return mth;
      }
    });
    const allhours = getMonth.map((routes) => routes.total)
    const total = allhours.reduce((acc, item) => (acc += item), 0)

    return (Math.floor(total / (1000 * 60 * 60)))
  }
  progressBar() {
    const progressBar = document.querySelector('.top-progress-bar');
    const topBar = document.querySelector('.top-bar');
    let width = ((this.calcAllHours() / 170).toFixed(2) * 100);
    let coeffic = topBar.offsetWidth / 100;
    let offsetWidth = coeffic * width;
    progressBar.style.width = `${offsetWidth}px`;
  }
}

// Store Class
class Store {
  static getRoutes() {
    let routes
    if (localStorage.getItem('routes') === null) {
      routes = []
    } else {
      routes = JSON.parse(localStorage.getItem('routes'))
    }
    return routes
  }
  static addRoute(route) {
    let routes = Store.getRoutes()
    routes.push(route)
    localStorage.setItem('routes', JSON.stringify(routes))
  }

  static displayRoutes() {
    const routes = Store.getRoutes();
    const getMonth = routes.filter((month) => {
      const currentMonth = document.querySelector('.month-select select').value;
      const date = new Date(month.start);
      const mth = date.getMonth() + 1;
      if (mth === Number(currentMonth)) {
        return mth;
      }
    });
    // Sort array by Date
    getMonth.sort((a, b) => a.start - b.start);
    getMonth.forEach(route => {
      const ui = new UI()
      ui.addRouteToList(route)
    });
  }
  // static startMonth() {
  //   const rrr = Store.getRoutes();
  //   const getMonth = rrr.filter((month) => {
  //     const currentMonth = document.querySelector('.month-select select').value;
  //     const date = new Date(month.start);
  //     const mth = date.getMonth() + 1;
  //     if (mth === Number(currentMonth)) {
  //       return mth;
  //     }
  //   });
  // }
}

class UI {
  static setMonthYear() {
    const currentMonth = new Date().toLocaleDateString('uk-UA', { month: '2-digit' });
    const currentYear = new Date().toLocaleDateString('uk-UA', { year: 'numeric' });
    const selectMonth = document.querySelector('.month-select select');
    const selectYear = document.querySelector('.year-select select');
    selectMonth.value = currentMonth;
    selectYear.value = currentYear;
  }
  addRouteToList(route) {
    const tableDiv = document.querySelector('.table-div')
    const div = document.createElement('div')
    const mainBlock = document.createElement('div');
    const options = {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }

    div.innerHTML = `
      <div>${new Date(route.start).toLocaleString(
      'uk-UA',
      options,
    )}</div
        <div class="">${new Date(route.end).toLocaleString('uk-UA', options)}</div>
        <div id="totalH">${!route.totalH ? '0' : route.totalH}г${!route.totalM ? '0' : route.totalM}хв</div>
        <div class="last-cell" style="text-align:center">${route.other}</div>
        <div class="delete"><button type="button" class="delete-btn"></div>
      `;

    div.classList.add('output-grid');
    div.querySelector('.last-cell').dataset.id = `${route.id}`;
    mainBlock.innerHTML = `
        <div class="row-content">
          <span><strong>Маршрут №:</strong> ${route.routeNum}</span>
          <span><strong>Локомотив:</strong> ${route.locoModel}-${route.routeNum}</span>
        </div>
    `;

    mainBlock.classList.add('main-block');
    mainBlock.setAttribute('aria-expanded', false)

    tableDiv.appendChild(mainBlock)
    mainBlock.insertAdjacentElement('afterbegin', div)
  }

  // Delete route from the DOM
  removeRouteDOM(target) {
    if (target.className === 'delete-btn') {
      target.parentElement.parentElement.remove();
      console.log(target)
    }
  }
  clearFields() {
    document.querySelector('#start-input').value = '';
    document.querySelector('#end-input').value = '';
    document.querySelector('#other').value = '';
    document.querySelector('#route-num').value = '';
    document.querySelector('#loco-num').value = '';
  }
}

document.querySelector('.submit-btn').addEventListener('click', function (e) {
  e.preventDefault()

  const start = document.querySelector('#start-input').value;

  const end = document.querySelector('#end-input').value;

  const other = document.querySelector('#other').value;
  const routeNum = document.querySelector('#route-num').value;
  const locoModel = document.querySelector('#loco').value;
  let locoNum = document.querySelector('#loco-num').value;

  const id = this.id;
  const total = this.total;
  const totalH = this.totalH;
  const totalM = this.totalM;

  const route = new Route(id, start, end, total, totalH, totalM, other, routeNum, locoModel, locoNum);

  Store.addRoute(route);

  const ui = new UI()
  ui.addRouteToList(route)
  ui.clearFields()
  document.querySelector('#total-hours').textContent = `${route.calcAllHours()}г`;
  route.progressBar();

  // Move to initial tab
  document.querySelector('#tab-3').classList.add('hidden');
  document.querySelector('#add-tab').classList.remove('active');
  document.querySelector('#tab-1').classList.remove('hidden');
  document.querySelector('#home-tab').classList.add('active');


});
// Repaint DOM on month change
// document.querySelector('.month-select select').addEventListener('change', () => {
//   // UI.setMonth();
//   Store.displayRoutes();
// });

// Calculate all worked hours
document.addEventListener('DOMContentLoaded', () => {
  UI.setMonthYear();
  Store.displayRoutes();

  const route = new Route();
  route.calcAllHours();
  document.querySelector('#total-hours').textContent = `${route.calcAllHours()}г`;
  route.progressBar();
});



// Event listener for delete action
document.addEventListener('DOMContentLoaded', () => {
  const deleteBtn = document.querySelectorAll('.delete-btn');
  deleteBtn.forEach((btn) => {
    btn.addEventListener('click', delR)
    console.log('btn.target')
  })
})


// Filter method
function delR(e) {
  console.log('delte')
  let routes = JSON.parse(localStorage.getItem('routes'));
  const data = e.target.parentElement.previousElementSibling;
  // const data = document.querySelector('.last-cell')[0];
  const att = data.getAttribute('data-id')
  const find = routes.find((item) => {
    return item.id === att
  })
  let index = routes.indexOf(find)
  routes.splice(index)

  localStorage.setItem('routes', JSON.stringify(routes))

  Store.displayRoutes(routes)
  document.location.reload();

  console.log(routes)
  document.location.reload();
}

