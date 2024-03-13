// https://kimmobrunfeldt.github.io/progressbar.js/

$(document).ready(function () {
  const vita = new ProgressBar.Circle("#health", {
    color: '#F03E3E', 
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const cibo = new ProgressBar.Circle("#hunger", {
    color: '#E8590C', 
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const acqua = new ProgressBar.Circle("#thirst", {
    color: '#1864AB', 
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const ossigeno = new ProgressBar.Circle("#oxygen", {
    color: '#A61E4D',  
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const corsa = new ProgressBar.Circle("#stamina", {
    color: '#A61E4D',
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const scudo = new ProgressBar.Circle("#armour", {
    color: '#087F5B', 
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  const microfono = new ProgressBar.Circle("#voice", {
    color: '#FFE066',
    trailColor: '#39393980',
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });


  window.addEventListener('message', function (event) {
    const data = event.data;

    switch (data.message) {
        case 'toggle':
            $("body").toggle(data.value);
            break;

        case 'update_voice':
          switch (data.livellovoce) {
              case 1:
                  data.livellovoce = 33;
                  break;
              case 2:
                  data.livellovoce = 66;
                  break;
              case 3:
                  data.livellovoce = 100;
                  break;
              default:
                  data.livellovoce = 33;
                break;
          } 
          microfono.animate(data.livellovoce / 100);
        break;

        case 'update_hud':
            document.getElementById("id").innerHTML = data.id + ' <i class="fa-solid fa-fingerprint" style="color: rgba(255, 255, 255, 0.2); font-size: 1.4em;"></i>';
            vita.animate(data.health / 100);
            cibo.animate(data.hunger / 100);
            acqua.animate(data.thirst / 100);
            corsa.animate(data.stamina / 100);
            scudo.animate(data.armour / 100);
            

            if (data.oxygen < 0) {
                ossigeno.animate(0);
            } else {
                ossigeno.animate(data.oxygen / 100);
            }

            if (data.attiva) {
                $('#ossigeno').fadeIn();
            } else {
                $('#ossigeno').fadeOut();
            }

            if (data.stamina < 100) {
                $('#stamina1').fadeIn();
            } else {
                $('#stamina1').fadeOut();
            }


            if (data.armour > 1) {
                $("#scudo1").fadeIn();
                $("#scudo2").fadeOut();
            } else {
                $("#scudo2").fadeOut();
                $("#scudo1").fadeOut();
            }

            break;
          }

            if (data.voice == 1) {
              microfono.path.setAttribute("stroke", "#FFE066");
          } else if (data.voice == false) {
              microfono.path.setAttribute("stroke", "#495057");
          }
      });
  });


// AUDIO DELLA CINTURA
window.addEventListener('message', function (event) {
  var audio = null;
  var data = event.data;

  if (data.type == "playSound") {

      if (audio != null) {
          audio.pause();
      }

      audio = new Audio("./sounds/" + data.file + ".ogg");
      audio.volume = data.volume;
      audio.play();
  }
});

// VEICOLO HUD
let lastGear = null;

window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("message", async (e) => {
    if (e.data.action === "show") {
      $(".contenitore_speed").removeClass("hidden");

      let speed = e.data.isMetric
        ? e.data.speed * 3.6
        : e.data.speed * 2.236936;
      let misura = e.data.isMetric ? "kmh" : "mph";
      let rpm = e.data.rpm * 100;

      $(".speed").text(speed.toFixed(0));
      $(".misura").text(misura);
      $(".rpm").css("width", `${rpm}%`);

      if (rpm >= 50 && rpm <= 80) {
        $(".rpm").css("backgroundColor", "#E67700");
      } else if (rpm > 80) {
        $(".rpm").css("backgroundColor", "#C92A2A");
      } else {
        $(".rpm").css("backgroundColor", "");
      }

      if (e.data.fuel !== undefined) {
        let livello = (e.data.fuel / 100) * 100;
        $(".livello_benzina").css({ width: `${livello}%` });
        if (livello > 90) {
          $(".livello_benzina").css("backgroundColor", "#12B886");
        } else if (livello <= 90 && livello > 20) {
          $(".livello_benzina").css("backgroundColor", "#12B886");
        } else if (livello <= 20) {
          $(".livello_benzina").css("backgroundColor", "#F03E3E");
        }
      }

      if (e.data.cintura == false) {
        $(".icona_cintura").css("color", "#E03131");
      } else if (e.data.cintura == true) {
        $(".icona_cintura").css("color", "#099268");
      }

    } else if (e.data.action === "hide") {
      $(".contenitore_speed").addClass("hidden");
    }

    if (e.data.gear !== lastGear && !isNaN(e.data.gear)) {
      $(".gear").remove();
      $(".contenitore_speed").append(`<div class="gear">${e.data.gear}</div>`);
      lastGear = e.data.gear;
    }
  });
});


// function modalitaCinemaOpen() {
//   $('body').fadeIn();
// }

// function modalitaCinemaClose() {
//   $('body').fadeOut();
// }

// window.addEventListener("message", function(event) {
//   let data = event.data;

//   if (data.type === "cinema_open") {
//       console.log('apertura');
//       modalitaCinemaOpen();
//   }
//   else if (data.type === "cinema_close") {
//       console.log('chiusura');
//       modalitaCinemaClose();
//   }
// });
