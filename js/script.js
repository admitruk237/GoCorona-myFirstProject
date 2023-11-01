
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
      // array of objects
      this.оbjects = []
      this.daClassname = '_dynamic_adapt_'
      // an array of DOM elements
      this.nodes = [...document.querySelectorAll('[data-da]')]

      // filling objects with objects
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

      // an array of unique media queries
      this.mediaQueries = this.оbjects
         .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
         .filter((item, index, self) => self.indexOf(item) === index)

      // hanging a listener on a media request
      // and calling the handler on first startup
      this.mediaQueries.forEach((media) => {
         const mediaSplit = media.split(',')
         const matchMedia = window.matchMedia(mediaSplit[0])
         const mediaBreakpoint = mediaSplit[1]

         // an array of objects with the corresponding breakpoint
         const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
         matchMedia.addEventListener('change', () => {
            this.mediaHandler(matchMedia, оbjectsFilter)
         })
         this.mediaHandler(matchMedia, оbjectsFilter)
      })
   }
   // Main function
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
   // Move function
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
   // Return function
   moveBack(parent, element, index) {
      element.classList.remove(this.daClassname)
      if (parent.children[index] !== undefined) {
         parent.children[index].before(element)
      } else {
         parent.append(element)
      }
   }
   // Function to get the index inside the parent element
   indexInParent(parent, element) {
      return [...parent.children].indexOf(element)
   }
   // Array sorting function by breakpoint and place
   // by growth for this.type = min
   // descending for this.type = max
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


//Transition to trigger the burger menu link for mobile 
// define the width of the screen
const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
if (viewport_width < 767) {
   document.addEventListener("DOMContentLoaded", function () {
      var links = document.querySelectorAll('[data-line-effect] .menu__link');

      links.forEach(function (link) {
         link.addEventListener('click', function (event) {
            event.preventDefault(); // Stop the link (by default)

            setTimeout(function () {
               window.location.href = link.getAttribute('href');
            }, 300); // 300 milliseconds
         });
      });
   });
}
