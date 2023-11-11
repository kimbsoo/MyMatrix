setHeader();

async function setHeader(){
    const token = localStorage.getItem("x-access-token");

    if(!token){
        const signed = document.querySelector(".signed");
        signed.classList.add("hidden");
        return;
    }

    const config = {
        method: "get",
        url: url + "/jwt",
        headers: {
            "x-access-token": token,
        },
    };
    const res = await axios(config);

    if(res.data.code !== 200){
        console.log("잘못된 토큰입니다.",res);
        return;
    }

    const nickName = res.data.result.nickname;
    const spanNickName = document.querySelector("span.nickname");
    spanNickName.innerText = nickName;
    // console.log("IndexJs   :",nickName)

    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");
    return;
}

const buttonSignout = document.getElementById("sign-out");
buttonSignout.addEventListener("click",signout);

function signout(){
    localStorage.removeItem("x-access-token");
    location.reload();
}


