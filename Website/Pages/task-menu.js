const mainCollapse = document.getElementById('mainTasks')
const mainIcon = document.getElementById('mainIcon')

mainCollapse.addEventListener('show.bs.collapse', event => {
    mainIcon.classList.add("fa-rotate-180");
})

mainCollapse.addEventListener('hide.bs.collapse', event => {
    mainIcon.classList.remove("fa-rotate-180");
})

const extensionCollapse = document.getElementById('extensionTasks')
const extensionIcon = document.getElementById('extensionIcon')

extensionCollapse.addEventListener('show.bs.collapse', event => {
    extensionIcon.classList.add("fa-rotate-180");
})

extensionCollapse.addEventListener('hide.bs.collapse', event => {
    extensionIcon.classList.remove("fa-rotate-180");
})

const systemCollapse = document.getElementById('systemTask')
const systemIcon = document.getElementById('systemIcon')

systemCollapse.addEventListener('show.bs.collapse', event => {
    systemIcon.classList.add("fa-rotate-180");
})

systemCollapse.addEventListener('hide.bs.collapse', event => {
    systemIcon.classList.remove("fa-rotate-180");
})