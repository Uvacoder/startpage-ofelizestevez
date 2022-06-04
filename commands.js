let db_commands;

// Helpers
function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function fileToJSON(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(JSON.parse(event.target.result))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
}

async function restoreJSON(file){
    let x = await fileToJSON(file)
    for(const [key, val] of Object.entries(x)){
        localStorage.setItem(key, val)
    }
    update_pre_determined_commands()
}

function commandStatus(name, status){
    console.log("Command: " + name)
    console.log("Status: " + status)
}

function describeUsage(commandUsage){
    let create_help = document.createElement("div");
    create_help.className = "flex";
    let create_help_0 = document.createElement("p");
    create_help_0.innerHTML= "Usage:&nbsp;";
    let create_help_1 = document.createElement("p");
    create_help_1.innerHTML= commandUsage;
    create_help_1.classList.add("accent_text");

    create_help.append(create_help_0,create_help_1);
    output.append(create_help);
}

function link_opener(link){
    window.location.href = link;
}

function backup(){
    const anchor = document.createElement("a");
    anchor.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage)));
    anchor.setAttribute('download', "command_backup.json");

    anchor.style.display = 'none';
    document.body.appendChild(anchor);
  
    anchor.click();
  
    document.body.removeChild(anchor);
}

function restore(){
    output.appendChild(fileUpload)
}

function update_pre_determined_commands(){
    for(let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i)
        let data = JSON.parse(localStorage[key])
        pre_determined_commands[key] = data
        all_commands_simplified = Object.assign({}, argumentative_commands, pre_determined_commands)
        update_shortened_commands()
        all_commands = Object.assign({}, all_commands_simplified, shortened_commands)
    }
}

function update_shortened_commands(){
    for (command in all_commands_simplified){
        // "shortened" in all_commands_simplified[command]
        if(all_commands_simplified[command].hasOwnProperty("shortened")){
            
            let shortened_command = all_commands_simplified[command]["shortened"]
            if ("arg" in all_commands_simplified[command]){
                shortened_commands[shortened_command] = {
                    "command": all_commands_simplified[command]["command"],
                    
                    "arg":all_commands_simplified[command]["arg"],
                    "message": all_commands_simplified[command]["message"],
                }
            }
            else {
                shortened_commands[shortened_command] = {
                    "command": all_commands_simplified[command]["command"],
                    "message": all_commands_simplified[command]["message"],
                }
            }

        }
    }
    all_commands = Object.assign({}, all_commands_simplified, shortened_commands)
}

// Command Functions
function help(){
    let help_table = document.createElement("table");

    for(let [key,val] of Object.entries(all_commands_simplified)){
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

function create(args = []){
    const types = ["link"];
    if (args.includes("--help") || args.length == 0){
        describeUsage("create TYPE NAME LINK SHORTNAME(optional)");
    }
    else {
        if(types.includes(args[0])){
            switch(args[0]){
                case "link":
                    if(!args[0],!args[1],!args[2]){
                        describeUsage("create link NAME LINK SHORTNAME(optional)");
                    }
                    else {
                        let name = args[1];
                        let link = args[2];
                        let short = args[3];

                        let data = {
                            command: "link_opener",
                            arg: link,
                            "message": "Go to " + name,
                            shortened: short,
                        }
                        localStorage.setItem(name, JSON.stringify(data));
                        update_pre_determined_commands()
                    }
                    break
            }
        }
        else {
            textTerminalRespond("Sorry, create command doesn't support this type of command");
            textTerminalRespond("Create supports:")
            for (i in types){
                textTerminalRespond(types[i]);
            }
            
        }
    }
}

function remove(args = []){
    if (args.includes("--help") || args.length == 0){
        describeUsage("remove COMMAND_NAME");
        describeUsage("rm COMMAND_NAME")
        textTerminalRespond("Make sure to only use the main command name and not the shortened name.")
    }
    else{
        let desire_rm = args[0];
        if(pre_determined_commands.hasOwnProperty(desire_rm)){
            popped_command = pre_determined_commands[desire_rm];
            delete pre_determined_commands[desire_rm];
            console.log(popped_command["shortened"])
            localStorage.removeItem(desire_rm);
            delete all_commands[desire_rm]
            delete all_commands_simplified[desire_rm]
            if(popped_command.hasOwnProperty("shortened")){
                desire_shortened_rm =  popped_command["shortened"]
                delete all_commands[desire_shortened_rm]
            }
        }
        else{
            textTerminalRespond("This command doesn't exist.");
        }
    }
}

function clear(){
    output.innerHTML = ""
}

function background(args=[]){
    if (args.includes("--help") || args.length == 0){
        describeUsage("background NUM");
        describeUsage("bg NUM")
    }
    else{
        let arg = args[0];
        let arg_num = parseInt(args[0]);
        console.log(args)
        console.log(arg_num)
        // set image
        if(arg >= 0 && arg < color_palettes.length){
            while (arg.length < 2){
                arg = "0"+ arg
            }
            console.log(arg)
            set_style("background-image","url('backgrounds/"+ arg +".jpg')");
        }
        else{
            textTerminalRespond("This background doesn't exist.");
        }
        
        // set variables
        set_style("primary-color","#"+color_palettes[arg_num][0]);
        set_style("secondary-color","#"+color_palettes[arg_num][1]);
        set_style("tertiary-color","#"+color_palettes[arg_num][2]);
        
        // set cookies
        setCookie("bg", arg, 365);
    }
}

function browse(args=[]){
    if (args.includes("--help") || args.length == 0){
        describeUsage("browse [LINK]");
        describeUsage("b [LINK]")
    }
    else{
        let link = args[0].includes('.') ? args[0] : args[0] + ".com";
        window.location.href = "https://www." + link;
    }
}

function google(args=[]){
    if (args.includes("--help")){
        describeUsage("google SEARCH_QUERY");
    }
    else {
        let search = args.join(" ");
        window.location.href ='http://google.com/search?q='+search;
    }
}


function gmail(args=[]){
    if (args.includes("--help")){
        describeUsage("gmail NUM");
        describeUsage("gm NUM");
    }
    else{
        let arg_num = args[0];
        window.location.href ='https://mail.google.com/mail/u/'+arg_num+'/#inbox';
    }
}

function drive(args=[]){
    if (args.includes("--help")){
        describeUsage("drive NUM");
        describeUsage("gd NUM");
    }
    else{
        let arg_num = args[0];
        window.location.href ='https://drive.google.com/drive/u/'+arg_num+'/my-drive';
    }
}

function reddit(args=[]){
    if (args.length == 0){
        window.location.href ='https://www.reddit.com/';
    }
    else if (args.includes("--help")){
        describeUsage("reddit SUBREDDIT(optional)");
        describeUsage("r SUBREDDIT(optional)");
    }
    else {
        let search = args.join(" ");
        window.location.href ='https://www.reddit.com/r/'+search;
        
    }
}

function youtube(args=[]){
    if (args.length == 0){
        window.location.href ='https://www.youtube.com/';
    }
    else if (args.includes("--help")){
        describeUsage("youtube SEARCH_QUERY(optional)");
        describeUsage("yt SEARCH_QUERY(optional)");
    }
    else {
        let search = args.join(" ");
        window.location.href ='https://www.youtube.com/results?search_query='+search;
        
    }
}

function twitch(args=[]){
    if (args.length == 0){
        window.location.href ='https://www.twitch.tv/';
    }
    else if (args.includes("--help")){
        describeUsage("twitch");
        describeUsage("ttv");
        describeUsage("twitch search SEARCH_QUERY");
        describeUsage("ttv s SEARCH_QUERY");
        describeUsage("twitch channel CHANNEL");
        describeUsage("ttv c CHANNEL");
        describeUsage("twitch directory DIRECTORY");
        describeUsage("ttv d DIRECTORY");
    }
    else {
        let sub_command = args[0];
        let search = args.splice(1).join(" ");
        console.log(search)
        switch(sub_command){
            case "c":
            case "channel":
                window.location.href = "https://www.twitch.tv/" + search;
                break
            case "s":
            case "search":
                window.location.href = "https://www.twitch.tv/search?term=" + search;
                break
            case "d":
            case "directory":
                window.location.href = "https://www.twitch.tv/directory/game/" + search;
                break
        }
        
    }  
}

// Lists of Commands


// argumentative commands
let argumentative_commands = {
    "help":{
        "command":"help",
        "message": "Using this command will print out a tip for terminal or command ('--help')",
    },
    "clear":{
        "command":"clear",
        "message": "Clear terminal",
    },
    "create":{
        "command":"create",
        "message": "Create new command",
    },
    "remove":{
        "command":"remove",
        "message": "Remove a created command.",
        "shortened": "rm",
    },
    "background":{
        "command":"background",
        "message": "Change Background",
        "shortened": "bg",
    },
    "backup":{
        "command":"backup",
        "message": "Download a backup of commands created with the 'create' command",
    },
    "restore":{
        "command":"restore",
        "message": "Use a previously downloaded command backup to restore your previously made commands",
    },
    "browse":{
        "command":"browse",
        "message": "Change Background",
        "shortened": "b",
    },
    "google":{
        "command":"google",
        "message":"Google search a query",
        "shortened": "g",
    },
    "gmail":{
        "command":"gmail",
        "message":"Go to Gmail",
        "shortened": "gm",
    },
    "drive":{
        "command":"drive",
        "message":"Go to Google Drive",
        "shortened": "gd",
    },
    "reddit":{
        "command":"reddit",
        "message":"Go to Reddit or a particular Subreddit",
        "shortened": "r",
    },
    "youtube":{
        "command":"youtube",
        "message":"Go to and Search Youtube",
        "shortened": "yt",
    },
    "twitch":{
        "command":"twitch",
        "message":"Go to and Search Twitch",
        "shortened": "ttv",
    },
}

// Pre-determined commands
let pre_determined_commands = {}

// main command list
let all_commands_simplified = Object.assign({}, argumentative_commands, pre_determined_commands) // used in help

let shortened_commands = {}

let all_commands = Object.assign({}, all_commands_simplified, shortened_commands) // will be expanded in the future


// POST
update_pre_determined_commands()
update_shortened_commands()