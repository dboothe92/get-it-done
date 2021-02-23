let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

//handles button click
 function formSubmitHandler(event) {
    event.preventDefault();
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    };
};

//function to get repos from github api
function getUserRepos(user) {
    //format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    //Make a request to the url
    fetch(apiUrl).then(function(response) {
        //if request is successful 
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.status);
        };
    })
    .catch(function(error) {
        alert("unable to connect to GitHub");
    });
};

//displays list of repos on screen
function displayRepos(repos, searchTerm) {
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found"
        return;
    }

    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    
    //loop over repos
    for (let i = 0; i < repos.length; i++) {
        //format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;
        
        //create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        repoEl.setAttribute("target", "_blank");

        //create a span element to hold repo name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row alighn-right";

        //check if current repo has any issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>"
        };

        //append to container
        repoEl.appendChild(statusEl);

        //append container to DOM
        repoContainerEl.appendChild(repoEl);
    };
};

//function that only retrieves featured repos that have help wanted tags
function getFeaturedRepos(languages) {
    let apiUrl = "https://api.github.com/search/repositories?q=" + languages + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, languages);
            });
        } else {
            alert("Error  " + response.status);
        };
    });
};

//function to handle button clicks
function buttonClickHandler(event) {
    let language = event.target.getAttribute("data-language");
    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
};

//adds clickability to the language buttons
languageButtonsEl.addEventListener("click", buttonClickHandler);

userFormEl.addEventListener("submit", formSubmitHandler);