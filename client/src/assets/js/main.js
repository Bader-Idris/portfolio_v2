const $ = (selector) => {
  const elements = document.querySelectorAll(selector)
  return elements.length === 1 ? elements[0] : elements
}
Element.prototype.$ = function (selector) {
  const elements = this.querySelectorAll(selector)
  return elements.length === 1 ? elements[0] : elements
}
const ParentMegaMenu = $('.mega-menu').parentElement,
  progressSpans = $('.the-progress span'),
  section = $('.our-skills'),
  nums = $('.stats .number'),
  statsSection = $('.stats'),
  scroller = $('.scroller')
ParentMegaMenu.onclick = (e) => {
  ParentMegaMenu.$('.mega-menu').classList.toggle('open')
}
window.addEventListener('click', (e) => {
  if (e.target != ParentMegaMenu.children[0]) {
    ParentMegaMenu.$('.mega-menu').classList.remove('open')
  }
})

let started = false // Function Started ? No
window.addEventListener('scroll', function () {
  // Skills Animate Width
  if (window.scrollY >= section.offsetTop - 250) {
    progressSpans.forEach((span) => {
      span.style.width = span.dataset.width
    })
  }
  // Stats Increase Number
  if (window.scrollY >= statsSection.offsetTop - 300) {
    if (!started) {
      nums.forEach((num) => startCount(num))
    }
    started = true
  }
})
function startCount(el) {
  let goal = el.dataset.goal
  let count = setInterval(() => {
    el.textContent++
    if (el.textContent == goal) {
      clearInterval(count)
    }
  }, 2000 / goal)
}

let countDownDate = new Date('June 31, 2023 23:59:59').getTime()
let counter = setInterval(() => {
  let dateNow = new Date().getTime()
  // Now && Countdown
  let dateDiff = countDownDate - dateNow,
    days = Math.floor(dateDiff / (1000 * 60 * 60 * 24)),
    hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds = Math.floor((dateDiff % (1000 * 60)) / 1000)
  $('.days').innerHTML = days < 10 ? `0${days}` : days
  $('.hours').innerHTML = hours < 10 ? `0${hours}` : hours
  $('.minutes').innerHTML = minutes < 10 ? `0${minutes}` : minutes
  $('.seconds').innerHTML = seconds < 10 ? `0${seconds}` : seconds
  if (dateDiff < 0) clearInterval(counter)
}, 1000)

//--------------------- Out Of the Course -----------------------------
/*
  scrollHeight: •Entire Content & Padding • (Visible or Not)
  clientHeight: -Visible Content & Padding
   */
document.addEventListener('DOMContentLoaded', () => {
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  window.addEventListener('scroll', function () {
    let scrollTop = document.documentElement.scrollTop
    scroller.style.width = `${(scrollTop / height) * 100}%`
  })
})

// use me when needed

// 🔴increase number on scrolling🔴
// E:\coding_and_programming\HTML_and_CSS_Elzero\JavaScript-Course\front-end_tutorials\increase-numbers-on-scrolling.html

// 🔴count-input-characters-and-fill-borders🔴
// E:\coding_and_programming\HTML_and_CSS_Elzero\JavaScript-Course\front-end_tutorials\count-input-characters-and-fill-borders.html
