let issueContainerEl = document.querySelector("#issues-container");

function getRepoIsuues(repo) {
    let apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
            });
        } else {
            alert("Error: " + response.status);
        };
    })
    .catch(function(error) {
        alert("There was an problem connecting to GitHub");
    })
};

function displayIssues(issues) {
    //Check if there are no issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "There are no open issues in this repo";
        return;
    }

    //creates containers for each issue/pull request
    for (i = 0; i < issues.length; i++) {
        let issuesEl = document.createElement("a");
        issuesEl.classList = "list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute = ("href", issues[i].html_url);
        issuesEl.setAttribute = ("target", "_blank");

        //create span to hold issue title
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issuesEl.appendChild(titleEl);

        //create type element
        let typeEl = document.createElement("span");

        //check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = ("(Pull Request)");
        } else {
            typeEl.textContent = ("(Issue)");
        };

        //append to container
        issuesEl.appendChild(typeEl);

        //append to issueContainerEl
        issueContainerEl.appendChild(issuesEl);
    };
};

getRepoIsuues("dboothe92/taskinator");