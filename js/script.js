
"use strict"

//menu burger
const iconMenu = document.querySelector('.menu__icon');
const bodyMenu = document.querySelector('.menu__body');
if (iconMenu) {
   iconMenu.addEventListener('click', function (e) {
      document.body.classList.toggle('_lock');
      iconMenu.classList.toggle('_active');
      bodyMenu.classList.toggle('_active');
   });
}

let windowWidth = document.documentElement;
console.log(windowWidth.clientWidth);


// Dynamic Adapt 
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
class DynamicAdapt {
   constructor(type) {
      this.type = type
   }
   init() {
      // масив об'єктів
      this.оbjects = []
      this.daClassname = '_dynamic_adapt_'
      // масив DOM-елементів
      this.nodes = [...document.querySelectorAll('[data-da]')]

      // наповнення оbjects об'єктами
      this.nodes.forEach((node) => {
         const data = node.dataset.da.trim()
         const dataArray = data.split(',')
         const оbject = {}
         оbject.element = node
         оbject.parent = node.parentNode
         оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
         оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
         оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
         оbject.index = this.indexInParent(оbject.parent, оbject.element)
         this.оbjects.push(оbject)
      })

      this.arraySort(this.оbjects)

      // масив унікальних медіа-запитів
      this.mediaQueries = this.оbjects
         .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
         .filter((item, index, self) => self.indexOf(item) === index)

      // навішування слухача на медіа-запит
      // та виклик оброблювача при першому запуску
      this.mediaQueries.forEach((media) => {
         const mediaSplit = media.split(',')
         const matchMedia = window.matchMedia(mediaSplit[0])
         const mediaBreakpoint = mediaSplit[1]

         // масив об'єктів з відповідним брейкпоінтом
         const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
         matchMedia.addEventListener('change', () => {
            this.mediaHandler(matchMedia, оbjectsFilter)
         })
         this.mediaHandler(matchMedia, оbjectsFilter)
      })
   }
   // Основна функція
   mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches) {
         оbjects.forEach((оbject) => {
            // оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination)
         })
      } else {
         оbjects.forEach(({ parent, element, index }) => {
            if (element.classList.contains(this.daClassname)) {
               this.moveBack(parent, element, index)
            }
         })
      }
   }
   // Функція переміщення
   moveTo(place, element, destination) {
      element.classList.add(this.daClassname)
      if (place === 'last' || place >= destination.children.length) {
         destination.append(element)
         return
      }
      if (place === 'first') {
         destination.prepend(element)
         return
      }
      destination.children[place].before(element)
   }
   // Функція повернення
   moveBack(parent, element, index) {
      element.classList.remove(this.daClassname)
      if (parent.children[index] !== undefined) {
         parent.children[index].before(element)
      } else {
         parent.append(element)
      }
   }
   // Функція отримання індексу всередині батьківського єлементу
   indexInParent(parent, element) {
      return [...parent.children].indexOf(element)
   }
   // Функція сортування масиву по breakpoint та place
   // за зростанням для this.type = min
   // за спаданням для this.type = max
   arraySort(arr) {
      if (this.type === 'min') {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0
               }
               if (a.place === 'first' || b.place === 'last') {
                  return -1
               }
               if (a.place === 'last' || b.place === 'first') {
                  return 1
               }
               return 0
            }
            return a.breakpoint - b.breakpoint
         })
      } else {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0
               }
               if (a.place === 'first' || b.place === 'last') {
                  return 1
               }
               if (a.place === 'last' || b.place === 'first') {
                  return -1
               }
               return 0
            }
            return b.breakpoint - a.breakpoint
         })
         return
      }
   }
}
const da = new DynamicAdapt("max");
da.init();


// Отримуємо масив елементів
const menuLinksWrappers = document.querySelectorAll('[data-line-effect]');
//отримуємо ширину екрану
const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// Якщо є елементи, запускаємо функцію
if (viewport_width < 768) {
   menuLinksWrappers.length ? menuEffect() : null;
}


// Основна функція
function menuEffect() {
   // Перебір елементів та пошук пунктів меню
   menuLinksWrappers.forEach(menuLinksWrapper => {
      const menuLinks = menuLinksWrapper.querySelectorAll('a');
      // Отримуємо швидкість ефекту (ms)
      const effectSpeed = menuLinksWrapper.dataset.lineEffect ? menuLinksWrapper.dataset.lineEffect : 200;
      // Якщо є пункти меню, запускаємо функцію
      menuLinks.length ? menuEffectItem(menuLinks, effectSpeed) : null;
   });

   function menuEffectItem(menuLinks, effectSpeed) {
      // Перелік констант зі стилями різних станів
      const effectTransition = `transition: transform ${effectSpeed}ms ease;`;
      const effectHover = `transform: translate3d(0px, 0%, 0px);`;
      const effectTop = `transform: translate3d(0px, -100%, 0px);`;
      const effectBottom = `transform: translate3d(0px, 100%, 0px);`;

      // Перебір елементів та додавання HTML-коду для роботи ефекту
      menuLinks.forEach(menuLink => {
         menuLink.insertAdjacentHTML('beforeend', `
				<span style="transform: translate3d(0px,100%,0px);" class="hover">
					<span style="transform: translate3d(0px,-100%,0px);" class="hover__text">${menuLink.textContent}</span>
				</span>
			`);
         // При виникнені подій наведення та переведення курсору
         // викликаємо функцію menuLinkActions()
         menuLink.onmouseenter = menuLink.onmouseleave = menuLinkActions;
      });

      // Функція подій курсору
      function menuLinkActions(e) {
         // Константи елементів
         const menuLink = e.target;
         const menuLinkItem = menuLink.querySelector('.hover');
         const menuLinkText = menuLink.querySelector('.hover__text');

         // Отримання половини висоти елементу
         const menuLinkHeight = menuLink.offsetHeight / 2;
         // Отримання позиції курсору при зваємодії з елементом
         const menuLinkPos = e.pageY - (menuLink.getBoundingClientRect().top + scrollY);

         // При наведенні курсору
         if (e.type === 'mouseenter') {
            // В залежності від позиції курсору додаємо певні стилі
            menuLinkItem.style.cssText = menuLinkPos > menuLinkHeight ? effectBottom : effectTop;
            menuLinkText.style.cssText = menuLinkPos > menuLinkHeight ? effectTop : effectBottom;
            // З певною затримкою змінюємо стилі та відображаємо ефект
            setTimeout(() => {
               menuLinkItem.style.cssText = effectHover + effectTransition;
               menuLinkText.style.cssText = effectHover + effectTransition;
            }, 5);
         }
         // При переведенні курсору
         if (e.type === 'mouseleave') {
            // В залежності від позиції курсору додаємо певні стилі
            menuLinkItem.style.cssText = menuLinkPos > menuLinkHeight ? effectBottom + effectTransition : effectTop + effectTransition;
            menuLinkText.style.cssText = menuLinkPos > menuLinkHeight ? effectTop + effectTransition : effectBottom + effectTransition;
         }
      }
   }
}