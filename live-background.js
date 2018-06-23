var live_url = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"

function do_app() {
    data_result = fetch(live_url, {}).
    then($res => {
        $res.json()
            .then($resJson => {

                console.log($resJson)

                matches = jsonQ($resJson).find("matches").value()
                matches = matches.reduce((a, b) => {
                    a.push(...b)
                    return a
                })
                live_matches = matches.filter(match => {
                    return moment(match.date)
                        .format("X") <= moment()
                        .format("X") &&
                        match.home_result != null &&
                        match.away_result != null
                        && match.finished == false

                })

                live_matches_scores = live_matches.map(match => {
                    return {
                        "name": match.name,
                        "home_team": match.home_team,
                        "away_team": match.away_team,
                        "home_result": match.home_result,
                        "away_result": match.away_result
                    }
                })

                console.log(live_matches_scores)

                chrome.storage.local.set(
                    {
                        'new_event': live_matches_scores
                    }
                )

                if (typeof (old_live) === "undefined") {
                    old_live = live_matches_scores
                }
                new_live = live_matches_scores
                new_event = get_match_difference(new_live, old_live)



                // console.log(new_event)

                old_live = new_live

                chrome.storage.local.set({
                    'global_event': new_event
                })
                //Save to chrome API Storage
                chrome.storage.local.set({
                    'mson': $resJson
                })

                chrome.storage.local.get('mson', function (data) {
                    mson = data.mson

                    // console.log(mson,'hmmm')
                })

            })
    })
}

function comparer(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.home_result == current.home_result && other.away_result == current.away_result
        }).length == 0;
    }
}

function get_match_difference(new_live, old_live) {
    new_event = []
    for (let s in new_live) {
        if (new_live[s].name == old_live[s].name) {
            if ((new_live[s].home_result != old_live[s].home_result) ||
                (new_live[s].away_result != old_live[s].away_result)) {
                new_event.push({
                    "name": new_live[s].name,
                    "home_team": new_live[s].home_team,
                    "away_team": new_live[s].away_team,
                    "home_result": new_live[s].home_result,
                    "away_result": new_live[s].away_result
                })
            }
        } else {
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

//Trigger the action
do_app()