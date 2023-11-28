// Accordion
document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('.main-block');
    accordions.forEach(acc => {
        acc.addEventListener('click', function (e) {
            const self = e.currentTarget;
            // const control = self.querySelector('.tr-control');
            const content = self.querySelector('.row-content');

            self.classList.toggle('open');
            // If accordeon is opened
            if (self.classList.contains('open')) {
                content.classList.toggle('visible')
                // control.setAttribute('aria-expanded', true);
                // self.setAttribute('aria-hidden', false);
                self.style.maxHeight = self.scrollHeight + 'px';
            } else {
                // control.setAttribute('aria-expanded', false);
                self.setAttribute('aria-hidden', true);
                self.style.maxHeight = null;
                content.classList.toggle('visible')
            }
        })
    })
})