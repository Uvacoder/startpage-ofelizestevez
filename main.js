let input = document.getElementsByClassName("input")[0];
let input_line = document.getElementById("input_line");
let output = document.getElementById("output");
let terminal = document.getElementsByClassName("terminal")[0]

let subreddits = ["2meirl4meirl","abandonedporn","abruptchaos","actualpublicfreakouts","amitheasshole","anarchychess","android","apexlore","apexoutlands","apexuncovered","askreddit","bad_cop_no_donut","beforenafteradoption","bestofredditorupdates","blackpeopletwitter","bojackhorseman","choosingbeggars","cityporn","clashroyale","crappydesign","diy","designporn","fancyfollicles","firefoxcss","gamedeals","gamingcirclejerk","grandblue","hermitcraft","hiphopcirclejerk","idiotsincars","justnomil","justfuckmyshitup","justiceserved","kidcudi","magicmirror","magicmirrors","maliciouscompliance","mechanicalkeyboards","miniworlds","njtech","natureisfuckinglit","nobodyasked","paladins","paperback","piracy","politicalhumor","prorevenge","programmerhumor","properanimalnames","publicfreakout","python","raspberry_pi_projects","rainmeter","retrofuturism","retropie","rocketleagueesports","scp","sneakers","strangerthings","streetmartialarts","stretched","tiktokcringe","toiletpaperusa","tokyoghoul","trashtaste","trueoffmychest","ui_design","vaporwaveaesthetics","westsubever","anime","animepiracy","apexlegends","apexuniversity","apolloapp","apple","badcode","battlestations","beta","blockbustardcomics","bodyweightfitness","btd6guide","buildapc","buildapcsales","confidentlyincorrect","coolguides","cordcutters","creepyasterisks","criticalblunder","dankruto","desktops","electronics","fightporn","freshalbumart","gaming","graphic_design","greentext","hiphopheads","homeassistant","homelab","iosthemes","iwallpaper","iamverysmart","iphonewallpapers","itookapicture","jailbreak","jailbreakdevelopers","jailbreakpiracy","lossofalovedone","manga","marvelstudios","meirl","microgrowery","moviescirclejerk","news","notmeirl","okbuddyretard","pcmasterrace","pettyrevenge","pihole","powerwashingporn","programme_irl","raspberry_pi","relationship_advice","relationships","smartmirrors","softwaregore","talesfromtechsupport","technology","titanfolk","trashy","ublockorigin","unixporn","web_design","webdev","xqcow","zillowgonewild"]
let autocomplete = document.getElementById("autocomplete");
let suggestion;

// focuses input
input.focus();

function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// command list
let other_commands = {
    "help":{
        "command":help,
        "message": "Using this command will print out a tip for terminal or command ('--help')",
    },
    "clear":{
        "command":clear,
        "message": "Clear terminal",
    },
    "background":{
        "command":background,
        "message": "Change Background",
        "shortened": "bg",
    },
    "google":{
        "command":google,
        "message":"Google search a query",
    },
    "gmail":{
        "command":gmail,
        "message":"Go to Gmail",
        "shortened": "gm",
    },
    "drive":{
        "command":drive,
        "message":"Go to Google Drive",
        "shortened": "gd",
    },
    "reddit":{
        "command":reddit,
        "message":"Go to Reddit (NOT YET AVAILABLE)",
        "shortened": "r",
    },
    "youtube":{
        "command":youtube,
        "message":"Go to Youtube",
        "shortened": "yt",
    },
}

let argument_specific_commands = {
    "njit":{
        "command": "link_opener('https://portal.njit.edu/')",
        "message":"Go To NJIT",
    },
    "canvas":{
        "command": "link_opener('https://njit.instructure.com/')",
        "message":"Go To Canvas",
    },
    "mysql":{
        "command": "link_opener(https://web.njit.edu/mysql/phpMyAdmin/index.php?server=3&token=e26bab1f4da43e34c65d3d17316b6ffe')",
        "message":"Go To MySQL",
    },
    "twitter":{
        "command": "link_opener('https://twitter.com/')",
        "message":"Go To Twitter",
        "shortened": "twt",
    },
    "twitch":{
        "command": "link_opener('https://www.twitch.tv/')",
        "message":"Go To Twitch",
        "shortened": "ttv",
    },
    "netflix":{
        "command": "link_opener('https://www.netflix.com/browse')",
        "message":"Go To Netflix",
        "shortened": "netf",
    },
    "discord":{
        "command": "link_opener('https://discord.com/')",
        "message":"Go To Discord",
        "shortened": "disc",
    },
    "pyload":{
        "command": "link_opener('http://raspberrypi.home:8000/')",
        "message":"Go To Pyload",
        "shortened": "pyl",
    },
    "homeassistant":{
        "command": "link_opener('http://raspberrypi.home:8123/')",
        "message":"Go To HomeAssistant",
        "shortened": "ha",
    },
    "magicmirror":{
        "command": "link_opener('http://raspberrypi.home:8080/')",
        "message":"Go To MagicMirror",
        "shortened": "mm",
    },
    "pi-hole":{
        "command": "link_opener('http://raspberrypi.home/admin')",
        "message":"Go To Pi-Hole",
        "shortened": "pih",
    },
    "qbittorrent":{
        "command": "link_opener('http://raspberrypi.home:8081/')",
        "message":"Go To qBittorrent",
        "shortened": "qbit",
    },
}

let other_commands_shortened = {};
let argument_specific_commands_shortened = {};

for (var key in argument_specific_commands) {
    if ("shortened" in argument_specific_commands[key]){
        argument_specific_commands_shortened[argument_specific_commands[key]["shortened"]] = key
    }
}

for (var key in other_commands) {
    if ("shortened" in other_commands[key]){
        other_commands_shortened[other_commands[key]["shortened"]]=key
    }
}



// commands
function help(){
    let help_table = document.createElement("table");

    for(let [key,val] of Object.entries(Object.assign({}, other_commands, argument_specific_commands))){
        let help_row = document.createElement("tr");
        let help_row_key = document.createElement("td");
        help_row_key.classList.add("help_table_key")
        help_row_key.innerHTML=key;
        let help_row_val;
        help_row_val = document.createElement("td");
        help_row_val.innerHTML = val["message"];

        if (val.hasOwnProperty("shortened")){
            help_row_key.innerHTML += " ("+ val['shortened'] +")";
        }

        help_row_val.classList.add("accent_text");
        help_row.append(help_row_key, help_row_val);
        help_table.append(help_row);
        
        output.appendChild(help_table);
    }
}

function clear(){
    output.innerHTML = ""
}

function google(args=[]){
    if (args.includes("--help") || args.length == 0){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "google SEARCH_QUERY";
        create_help_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        output.append(create_help);
    }
    else{
        let search = args.join(" ");
        window.location.href ='http://google.com/search?q='+search;
    }
}

function gmail(args=[]){
    if (args.includes("--help") || args.length == 0){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "gmail NUM";
        create_help_1.classList.add("accent_text");

        let create_help__2 = document.createElement("div");
        create_help__2.className = "flex";
        let create_help__2_0 = document.createElement("p");
        create_help__2_0.innerHTML= "Usage:&nbsp;";
        let create_help__2_1 = document.createElement("p");
        create_help__2_1.innerHTML= "gm NUM";
        create_help__2_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        create_help__2.append(create_help__2_0,create_help__2_1);
        output.append(create_help,create_help__2);
    }
    else{
        let arg_num = args[0];
        window.location.href ='https://mail.google.com/mail/u/'+arg_num+'/#inbox';
    }
}

function drive(args=[]){
    if (args.includes("--help") || args.length == 0){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "drive NUM";
        create_help_1.classList.add("accent_text");

        let create_help__2 = document.createElement("div");
        create_help__2.className = "flex";
        let create_help__2_0 = document.createElement("p");
        create_help__2_0.innerHTML= "Usage:&nbsp;";
        let create_help__2_1 = document.createElement("p");
        create_help__2_1.innerHTML= "gd NUM";
        create_help__2_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        create_help__2.append(create_help__2_0,create_help__2_1);
        output.append(create_help,create_help__2);
    }
    else{
        let arg_num = args[0];
        window.location.href ='https://drive.google.com/drive/u/'+arg_num+'/my-drive';
    }
}

function link_opener(link){
    window.location.href =link;
}
function background(args=[]){
    if (args.includes("--help") || args.length == 0){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "background NUM";
        create_help_1.classList.add("accent_text");

        let create_help__2 = document.createElement("div");
        create_help__2.className = "flex";
        let create_help__2_0 = document.createElement("p");
        create_help__2_0.innerHTML= "Usage:&nbsp;";
        let create_help__2_1 = document.createElement("p");
        create_help__2_1.innerHTML= "bg NUM";
        create_help__2_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        create_help__2.append(create_help__2_0,create_help__2_1);
        output.append(create_help,create_help__2);
    }
    else{
        let arg_num = args[0];
        // set image
        if(arg_num >= 0 && arg_num < color_palettes.length){
            while (arg_num.length < 2){
                arg_num = "0"+ arg_num
            }

            set_style("background-image","url('backgrounds/"+ arg_num +".jpg')");
        }
        else{
            let ouput_line = document.createElement("p");
            ouput_line.innerText = "This background doesn't exist.";
            output.append(ouput_line);
        }
        
        // set variables
        set_style("primary-color","#"+color_palettes[parseInt(arg_num)][0]);
        set_style("secondary-color","#"+color_palettes[parseInt(arg_num)][1]);
        set_style("tertiary-color","#"+color_palettes[parseInt(arg_num)][2]);
        
        // set cookies
        setCookie("bg", arg_num, 365);
    }
}
function youtube(args=[]){
    if (args.length == 0){
        window.location.href ='https://www.youtube.com/';
    }
    else if (args.includes("--help")){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "youtube SEARCH_QUERY(optional)";
        create_help_1.classList.add("accent_text");

        let create_help__2 = document.createElement("div");
        create_help__2.className = "flex";
        let create_help__2_0 = document.createElement("p");
        create_help__2_0.innerHTML= "Usage:&nbsp;";
        let create_help__2_1 = document.createElement("p");
        create_help__2_1.innerHTML= "yt SEARCH_QUERY(optional)";
        create_help__2_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        create_help__2.append(create_help__2_0,create_help__2_1);
        output.append(create_help,create_help__2);
    }
    else {
        let search = args.join(" ");
        window.location.href ='https://www.youtube.com/results?search_query='+search;
        
    }
}
function reddit(args=[]){
    if (args.length == 0){
        window.location.href ='https://www.reddit.com/';
    }
    else if (args.includes("--help")){
        let create_help = document.createElement("div");
        create_help.className = "flex";
        let create_help_0 = document.createElement("p");
        create_help_0.innerHTML= "Usage:&nbsp;";
        let create_help_1 = document.createElement("p");
        create_help_1.innerHTML= "reddit SUBREDDIT(optional)";
        create_help_1.classList.add("accent_text");

        let create_help__2 = document.createElement("div");
        create_help__2.className = "flex";
        let create_help__2_0 = document.createElement("p");
        create_help__2_0.innerHTML= "Usage:&nbsp;";
        let create_help__2_1 = document.createElement("p");
        create_help__2_1.innerHTML= "r SUBREDDIT(optional)";
        create_help__2_1.classList.add("accent_text");

        create_help.append(create_help_0,create_help_1);
        create_help__2.append(create_help__2_0,create_help__2_1);
        output.append(create_help,create_help__2);
    }
    else {
        let search = args.join(" ");
        window.location.href ='https://www.reddit.com/r/'+search;
        
    }
}


input.addEventListener("keyup", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        let current_input_line = input_line.cloneNode();
        current_input_line.innerHTML = input_line.innerHTML;

        let copy_text_input = current_input_line.getElementsByClassName("text_input")[0]
        current_input_line.removeChild(copy_text_input)
        // copy_text_input.removeChild(current_input_line.getElementsByClassName("text_input")[0].getElementsByClassName("input")[0]);
        // copy_text_input.removeChild(current_input_line.getElementsByClassName("text_input")[0].getElementsByClassName("autocomplete")[0]);
        
        let uValue = document.createElement("p");
        uValue.innerHTML = input.value;
        current_input_line.appendChild(uValue);

        document.getElementById("output").append(current_input_line);
        

        let command_input = input.value.split(' ');
        
        if(command_input[0] in other_commands){
            if(command_input.length > 1){
                other_commands[command_input[0]]["command"](command_input.slice(1));
            }
            else{
                other_commands[command_input[0]]["command"]();
            }
        }
        else if(command_input[0] in other_commands_shortened){
            command_input[0] = other_commands_shortened[command_input[0]];
            if(command_input.length > 1){
                other_commands[command_input[0]]["command"](command_input.slice(1));
            }
            else{
                other_commands[command_input[0]]["command"]();
            }    
        }
        else if(command_input[0] in argument_specific_commands){
            eval(argument_specific_commands[command_input[0]]["command"]);
        }
        else if(command_input[0] in argument_specific_commands_shortened){
            command_input[0] = argument_specific_commands_shortened[command_input[0]];
            eval(argument_specific_commands[command_input[0]]["command"]);
        }
        else{
            let nocommand_output = document.createElement("div");
            nocommand_output.className = "flex";
            let nocommand_output_0 = document.createElement("p");
            nocommand_output_0.innerHTML = "Command not found. For a list of commands, type&nbsp;";
            let nocommand_output_1 = document.createElement("p");
            nocommand_output_1.className ="accent_text";
            nocommand_output_1.innerHTML = "'help'";
            let nocommand_output_2 = document.createElement("p");
            nocommand_output_2.innerHTML = "."
            nocommand_output.append(nocommand_output_0,nocommand_output_1,nocommand_output_2)

            document.getElementById("output").append(nocommand_output);
        }
        
        terminal.scrollTop = terminal.scrollHeight;

        input.value = "";
        autocomplete.innerHTML = "" 
    }
    else if (event.key === "Control"){
        if ((input.value.startsWith("r ") || input.value.startsWith("reddit ")) && (suggestion != undefined)){
            //  && (input.value.split(" ")[1] != "")
            input.value = input.value.split(" ")[0] + " " +suggestion;
        }
    }
    // add this else
    else {
        if(!(input.value.startsWith("r ") || input.value.startsWith("reddit "))){
            autocomplete.innerHTML = "";
        }
        else {
            autocomplete.innerHTML = "";
            let suggestion_result = [];
            Usubreddit = input.value.split(" ")[1];
            if (Usubreddit == ""){
            }
            else {
                for (i in subreddits){
                    subreddit = subreddits[i];
                    indx = subreddit.indexOf(Usubreddit);
                    if (indx != 0){
                        indx = 9999;
                    }
                    suggestion_result.push(indx);
                }
                if(Math.min(...suggestion_result) < 9999){
                    suggestion = subreddits[parseInt(suggestion_result.indexOf(Math.min(...suggestion_result)))]
                    autocomplete.innerHTML= input.value.split(" ")[0] + " " +suggestion
                }
                else {
                    suggestion = ""
                    autocomplete.innerHTML= input.value.split(" ")[0] + " " +suggestion               
                }
            }
        }
        else {
            autocomplete.innerHTML= ""
        }
    }
  });
