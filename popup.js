
trigger_live()

let app_url = "https://worldcup.aarhof.eu/"

let select_menu = document.querySelector(".option-select")

let app_frame = document.querySelector(".app-frame")



select_menu.onchange = function()
{   if(select_menu.value.match('#'))
{
    $('.app-frame').show()
    frame_url = `${app_url}${select_menu.value}/`
    // alert(frame_url)
    app_frame['src'] = frame_url
}
else
{
    trigger_live()
}
}

function trigger_live()
{
    let conscise = [], obj = {}
    chrome.storage.local.get('new_event', function (data) {
        conscise = data.new_event

        // console.log(global_event)

        chrome.storage.local.get('mson', function (data) {
            obj = data.mson

            // console.log(mson)
            // trigger_live(global_event, mson)
            
            $('.app-frame').hide()
            let headLive = $('<h1 class="headLive">Live Matches</h1>')
            let recordTable = $('<table class="recordTable" />')
    if(conscise.length==0)
    {
        recordTable.append(`<tr><td>No</td>  <td>Live Matches</td></tr>`)
    }
    else
    {
        for(let index in conscise)
    {
        recordTable.append(`<tr><td>${obj.teams[(conscise[index].home_team - 1)].name}</td>  <td>${obj.teams[(conscise[index].away_team - 1)].name}</td></tr>`)
        recordTable.append(`<tr><td><img class="flag" src="${obj.teams[(conscise[index].home_team - 1)].flag}" /></td>  <td><img class="flag" src="${obj.teams[(conscise[index].away_team - 1)].flag}" /></td></tr>`)
        recordTable.append(`<tr><td>${conscise[index].home_result}</td> <td>${conscise[index].away_result}</td></tr>`)
        // console.log(`${obj.teams[(conscise[index].home_team - 1)].name}  ${obj.teams[(conscise[index].away_team - 1)].name}`, `${conscise[index].home_result}  ${conscise[index].away_result}`)
    }
}
$('.liveDiv').html('')
$('.liveDiv').append(headLive)
$('.liveDiv').append(recordTable)
$('.liveDiv').show()
// console.log(conscise.length)
})
})
}
