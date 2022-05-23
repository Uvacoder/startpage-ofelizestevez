let style_root = document.querySelector(':root');
let style_root_computed = getComputedStyle(style_root);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


let user_bg = getCookie("bg");
if (user_bg != ""){
    set_style("background-image","url('backgrounds/"+ user_bg +".jpg')");
    set_style("primary-color","#"+color_palettes[parseInt(user_bg)][0]);
    set_style("secondary-color","#"+color_palettes[parseInt(user_bg)][1]);
    set_style("tertiary-color","#"+color_palettes[parseInt(user_bg)][2]);
}


function get_style(variable) {
    // Get the styles (properties and values) for the root
    // Alert the value of the --blue variable
    console.log(variable+": "+style_root_computed.getPropertyValue('--'+variable));
  }

function set_style(variable,value) {
  // Set the value of variable --blue to another value (in this case "lightblue")
  style_root.style.setProperty('--' + variable, value);
}

