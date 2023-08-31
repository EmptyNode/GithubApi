const getUsername1 = document.querySelector("#user1") as HTMLInputElement;
const getUsername2 = document.querySelector("#user2") as HTMLInputElement;
const formSubmit1 = document.querySelector("#form1") as HTMLFormElement;
const formSubmit2 = document.querySelector("#form2") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;

interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}


//reusable function
async function myCustomerFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);

    return data;
}

//let display the card UI

const showResultUi = (singleUser: UserData) => {
    const { avatar_url, login, url } = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src="${avatar_url}" alt="${login}"/>

        <hr/>
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}"/>
                <h1 id="details" >${login}</h1>
                <a id="details" href="${url}"> Github </a>
            </div>
        </div>`
    );
}


function fetchUserData(url: string) {
    myCustomerFetcher<UserData[]>(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUi(singleUser);
            console.log("login" + singleUser.login);

        }
    });
}

//default function call
fetchUserData("https://api.github.com/users");


//search function 
formSubmit1.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchTerm = getUsername1.value.toLowerCase();

    try {
        const url = "https://api.github.com/users";

        const allUserData = await myCustomerFetcher<UserData[]>(url, {});

        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });

        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML(
                "beforeend",
                `<p class = "empty-msg" >No matching useres found.</p>`
            );
        } else {
            for(const singleUSer of matchingUsers){
                showResultUi(singleUSer);
            }
        }

    } catch (error) {
        console.log(error);
    }
});


// .......................................

async function fetchFullNameUserData(username: string): Promise<UserData | null> {
    const url = `https://api.github.com/users/${username}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok - status: ${response.status}`);
        }

        const userData: UserData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

formSubmit2.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchTerm = getUsername2.value.toLowerCase();

    try {
        const userData = await fetchFullNameUserData(searchTerm);
        
        main_container.innerHTML = "";
        if (userData){
                showResultUi(userData);
        } else {
            main_container.insertAdjacentHTML(
                "beforeend",
                `<p class = "empty-msg" >No matching useres found.</p>`
            );    
        }
    } catch (error) {
        console.log(error);
    }
});



