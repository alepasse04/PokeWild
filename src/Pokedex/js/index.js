const loaded = new Set()
window.init = window.init || {}
$('.time').html(new Date().toDateString())
const toTitle = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`
const currentUrl = new URL(document.URL)
const path = currentUrl.pathname.replace('/', '')
const evalPath = ['terms', 'shop', 'items', 'calculator']
const index = evalPath.indexOf(path)
const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
let currentContentTitle = evalPath[index] ? toTitle(evalPath[index]) : ''
const flavorText = {
    Terms: 'Terms Of Service',
    Add: 'Add To Server',
    Calculator: 'IV Calculator'
}
if (!hasTouch) {
    $('nav a, .buttons a').on('mouseenter', function () {
        const goTo = $(this).attr('data')
        $('.goto').html(`> ${flavorText[goTo] || goTo}`)
    })
    $('nav a, .buttons a').on('mouseleave', function () {
        $('.goto').html(currentContentTitle)
    })
}
const displayContent = content => {
    const contentNameParsed = toTitle(content)
    if (document.title.endsWith(contentNameParsed) || !evalPath.includes(content)) return
    currentContentTitle = `> ${flavorText[contentNameParsed] || contentNameParsed}`
    if (content === 'shop') $('.logout').removeClass('disableLogout')
    else $('.logout').addClass('disableLogout')
    $('.maintext p').load(`./pages/${content}.html`, function () {
        $(this).scrollTop(0)
        $(this).attr('class', content)
        $('.goto').html(currentContentTitle)
        window.history.replaceState(null, '', `${content}${window.location.search}`)
        document.title = `Pokecord++ | ${contentNameParsed}`
        const scriptUrl = `./js/${content}.js`
        if (loaded.has(scriptUrl)) {
            if (window.init.hasOwnProperty(content)) window.init[content]()
        } else {
            loaded.add(scriptUrl)
            $.getScript(scriptUrl, function () {
                window.init[content]()
            })
        }
    })
}
if (index !== -1) displayContent(evalPath[index])
$(document).ready(function () {
    $('nav a, .buttons a').on('click', function () {
        const goTo = $(this).attr('data')
        displayContent(goTo.toLowerCase())
    })
})