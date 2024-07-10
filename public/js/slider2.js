(function($) {
    function doneResizing() {
        var totalScroll = $('.resource-slider-frame').scrollLeft();
        var itemWidth = $('.resource-slider-item').width();
        var difference = totalScroll % itemWidth;
        if (difference !== 0) {
            $('.resource-slider-frame').animate({
                scrollLeft: '-=' + difference
            }, 500, function() {
                // check arrows
                checkArrows();
            });
        }
    }

    function checkArrows() {
        var totalWidth = $('#resource-slider .resource-slider-item').length * $('.resource-slider-item').width();
        var frameWidth = $('.resource-slider-frame').width();
        var itemWidth = $('.resource-slider-item').width();
        var totalScroll = $('.resource-slider-frame').scrollLeft();

        if (((totalWidth - frameWidth) - totalScroll) < itemWidth) {
            $(".next").css("visibility", "hidden");
        } else {
            $(".next").css("visibility", "visible");
        }
        if (totalScroll < itemWidth) {
            $(".prev").css("visibility", "hidden");
        } else {
            $(".prev").css("visibility", "visible");
        }
    }

    $('.arrow').on('click', function() {
        var $this = $(this),
            width = $('.resource-slider-item').width(),
            speed = 500;
        if ($this.hasClass('prev')) {
            $('.resource-slider-frame').animate({
                scrollLeft: '-=' + width
            }, speed, function() {
                // check arrows
                checkArrows();
            });
        } else if ($this.hasClass('next')) {
            $('.resource-slider-frame').animate({
                scrollLeft: '+=' + width
            }, speed, function() {
                // check arrows
                checkArrows();
            });
        }
    }); // end on arrow click

    $(window).on("load resize", function() {
        checkArrows();
        $('#resource-slider .resource-slider-item').each(function(i) {
            var $this = $(this),
                left = $this.width() * i;
            $this.css({
                left: left
            })
        }); // end each
    }); // end window resize/load

    var resizeId;
    $(window).resize(function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(doneResizing, 500);
    });

    // Remove auto-scroll behavior
    $('.resource-slider-frame').removeClass('animate-pulse');

})(jQuery); // end function


// Reapply the loading class after the page is loaded
window.addEventListener('load', function() {
  // Add a delay before removing the loading class
  setTimeout(function() {
    // Remove the loading class from all card elements
    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.remove('loading');
    });
  }, 500); // Adjust the delay time as needed (in milliseconds)
});

// Remove the loading class from cards after a delay
window.addEventListener('load', function() {
  setTimeout(function() {
    document.querySelectorAll('.loading').forEach(function(card) {
      card.classList.remove('loading');
    });
  }, 1500); // Adjust the delay time (in milliseconds)
});
document.addEventListener('DOMContentLoaded', function () {
    // Get the carousel element
    var carousel = document.getElementById('resource-slider');

    // Disable the carousel interval
    if (carousel) {
      var carouselInstance = new bootstrap.Carousel(carousel, {
        interval: false
      });
    }
  });

    console.log("hello kioko")




document.getElementById('toggle-button').addEventListener('click', function() {
        var menuItems = document.getElementById('menu-items');
        if (menuItems.classList.contains('hidden')) {
            menuItems.classList.remove('hidden');
            menuItems.classList.add('block');
        } else {
            menuItems.classList.remove('block');
            menuItems.classList.add('hidden');
        }
    });

document.querySelector('button').addEventListener('click', function() {
    var dropdown = this.nextElementSibling;
    dropdown.classList.toggle('hidden');
  });


document.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    profileImage.addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
    });

    // Close the dropdown menu when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!dropdownMenu.contains(event.target) && !profileImage.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Toggle dropdown when clicking on user avatar icon
    document.querySelector('.fa-user-circle').addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
    });

    // Close the dropdown when clicking outside of it or on the toggle button
    document.addEventListener('click', function(event) {
        if (!dropdownMenu.contains(event.target) && event.target.id !== 'toggle-button' && !document.querySelector('.fa-user-circle').contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Toggle sidebar when clicking on the toggle button
    document.getElementById('toggle-button').addEventListener('click', function() {
        // Add your toggle sidebar logic here
    });
});



document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const offcanvasNavbar = document.getElementById('offcanvasNavbar');
  const closeButton = document.getElementById('closeButton');

  toggleButton.addEventListener('click', () => {
    if (offcanvasNavbar) {
      if (offcanvasNavbar.className.includes('hidden')) {
        offcanvasNavbar.className = offcanvasNavbar.className.replace('hidden', '').trim();
      } else {
        offcanvasNavbar.className += ' hidden';
      }
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (offcanvasNavbar) {
        offcanvasNavbar.className += ' hidden';
      }
    });
  }
});

function showErrorPopup(message) {
    document.querySelector("#errorPopup .alert").innerText = message;
    document.getElementById("errorPopup").style.display = "block";
}

function closeErrorPopup() {
    document.getElementById("errorPopup").style.display = "none";
}




methods: {
  formatAmount(amount) {
    return amount.toLocaleString();
  }
}



// function scrollToSection() {
//       document.getElementById('resource-slider').scrollIntoView({ behavior: 'smooth' });
//       console.log("hey test")
//     }