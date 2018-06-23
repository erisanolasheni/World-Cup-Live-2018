
var old_live;
var new_live;
var new_event;

live_url = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"

function do_app()
{
data_result = fetch(live_url, {}).
then($res => 
{
    $res.json()
    .then($resJson =>
    {

        console.log($resJson)
        
        matches = jsonQ($resJson).find("matches").value()
        matches = matches.reduce((a, b) => {
            a.push(...b)
            return a
        })
        live_matches = matches.filter(match => 
        {
            return moment(match.date)
            .add(90,"minutes")
            .format("X") <= moment()
            .format("X") && 
            match.home_result != null &&
            match.away_result != null &&
            match.finished == false

        })

        live_matches_scores = live_matches.map(match =>
    {
        return {
            "name": match.name,
            "home_team" : match.home_team,
            "away_team" : match.away_team,
            "home_result": match.home_result,
            "away_result": match.away_result
        }
    })

        // console.log(live_matches_scores)

        if(typeof(old_live)==="undefined")
        {
            old_live = live_matches_scores
        }
        new_live = live_matches_scores
        new_event = get_match_difference(new_live, old_live)

        

        // console.log(new_event)

        old_live = new_live

        chrome.storage.local.set(
            {
                'global_event': new_event
            })
        //Save to chrome API Storage
        chrome.storage.local.set({
            'mson': $resJson
        })

        chrome.storage.local.get('mson', function (data) {
            mson = data.mson

            console.log(mson,'hmmm')
        })
        

        if(new_event.length>0)
        {
            // console.log(new_event, $resJson)
            trigger_goal(new_event, $resJson)   
        }
    })
})
}

//Trigger app

setInterval(do_app,5000)

function comparer(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.home_result == current.home_result && other.away_result == current.away_result
        }).length == 0;
    }
}

function trigger_goal(conscise, obj)
{
    let goalBack = $('<div class="goalBack" />')
    let goalContain = $('<div class="goalContain" />')
    let goal = $('<div class="goal">GOAL!!!</div>');
    let recordTable = $('<table class="recordTable" />')
    goalContain.append(goal)
    for(let index in conscise)
    {
        recordTable.append(`<tr><td>${obj.teams[(conscise[index].home_team - 1)].name}</td>  <td>${obj.teams[(conscise[index].away_team - 1)].name}</td></tr>`)
        recordTable.append(`<tr><td><img class="flag" src="${obj.teams[(conscise[index].home_team - 1)].flag}" /></td>  <td><img class="flag" src="${obj.teams[(conscise[index].away_team - 1)].flag}" /></td></tr>`)
        recordTable.append(`<tr><td>${conscise[index].home_result}</td> <td>${conscise[index].away_result}</td></tr>`)
        // console.log(`${obj.teams[(conscise[index].home_team - 1)].name}  ${obj.teams[(conscise[index].away_team - 1)].name}`, `${conscise[index].home_result}  ${conscise[index].away_result}`)
    }

    goalContain.append(recordTable)
    // console.log(conscise.length)

    goalBack.append(goalContain)

    goalBack.click(function () {
        $(this).fadeOut(function () {
            $(this).remove()
        })
    })
    //Remove any existing .goalBack Element
    $("body .goalBack").remove()
    $('body').append(goalBack)
}

function get_match_difference(new_live, old_live)
{
    new_event = []
    for (let s in new_live) {
        if (new_live[s].name == old_live[s].name) {
            if ((new_live[s].home_result != old_live[s].home_result) ||
                (new_live[s].away_result != old_live[s].away_result)) {
                new_event.push({
                    "name": new_live[s].name,
                    "home_team" : new_live[s].home_team,
                    "away_team" : new_live[s].away_team,
                    "home_result" : new_live[s].home_result,
                    "away_result" : new_live[s].away_result
                })
            }
        }
        else
        {
            new_event.push({
                "name": new_live[s].name,
                "home_team": new_live[s].home_team,
                "away_team": new_live[s].away_team,
                "home_result": new_live[s].home_result,
                "away_result": new_live[s].away_result
            })
        }
    }

    return new_event
}